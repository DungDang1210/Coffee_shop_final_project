const Order = require("../models/Order");


// 1 point per 1.000đ spent
const POINTS_PER_VND = 1 / 1000;


const TIERS = [

  {
    key: "BRONZE",
    name: "Bronze",
    minPoints: 0,
    color: "#b08968",
    perks: [
      "Member-only promotions",
      "A free drink on your birthday"
    ]
  },

  {
    key: "SILVER",
    name: "Silver",
    minPoints: 500,
    color: "#9aa5b1",
    perks: [
      "5% off every order",
      "Free size upgrade",
      "Member-only promotions"
    ]
  },

  {
    key: "GOLD",
    name: "Gold",
    minPoints: 1500,
    color: "#c08b5c",
    perks: [
      "10% off every order",
      "A free drink every 10 orders",
      "Priority pickup"
    ]
  },

  {
    key: "PLATINUM",
    name: "Platinum",
    minPoints: 4000,
    color: "#6b4f4f",
    perks: [
      "15% off every order",
      "A free drink every month",
      "Early access to seasonal menus",
      "Priority pickup"
    ]
  }

];


// =====================================
// POINTS EARNED BY A SINGLE ORDER
// =====================================

function pointsForOrder(order) {

  const total = Number(order?.total);

  if (!Number.isFinite(total) || total <= 0) {
    return 0;
  }

  return Math.floor(total * POINTS_PER_VND);

}


// =====================================
// TIER FOR A POINT BALANCE
// =====================================

function resolveTier(points) {

  const safePoints =
    Number.isFinite(points) && points > 0
      ? Math.floor(points)
      : 0;

  // highest tier whose threshold is met
  let index = 0;

  TIERS.forEach((tier, i) => {

    if (safePoints >= tier.minPoints) {
      index = i;
    }

  });

  const current = TIERS[index];

  const next = TIERS[index + 1] || null;

  const pointsToNext =
    next
      ? next.minPoints - safePoints
      : 0;

  // progress through the CURRENT tier band,
  // so the bar restarts at each new tier
  const bandStart = current.minPoints;

  const bandEnd = next
    ? next.minPoints
    : current.minPoints;

  const progress =
    next
      ? Math.min(
          // floor, so the bar never reads 100%
          // while points are still owed
          99,
          Math.floor(
            ((safePoints - bandStart) /
              (bandEnd - bandStart)) * 100
          )
        )
      : 100;

  return {
    points: safePoints,
    tier: current,
    nextTier: next,
    pointsToNext,
    progress
  };

}


// =====================================
// PERSONAL VOUCHERS
//
// These are granted to ONE member, unlike the
// public /api/promotions records. A member who
// does not own the voucher cannot use it.
// =====================================

const WELCOME_VOUCHER = {
  code: "WELCOME20",
  title: "New Member 20% Off",
  type: "PERCENT",
  discount: 20,
  source: "WELCOME",
  description:
    "20% off your first order — welcome to Brew Haven"
};


// one reward voucher per tier above Bronze
const TIER_VOUCHERS = {

  SILVER: {
    code: "SILVER5",
    title: "Silver Member 5% Off",
    type: "PERCENT",
    discount: 5,
    source: "TIER",
    description:
      "Your Silver tier reward — 5% off any order"
  },

  GOLD: {
    code: "GOLD10",
    title: "Gold Member 10% Off",
    type: "PERCENT",
    discount: 10,
    source: "TIER",
    description:
      "Your Gold tier reward — 10% off any order"
  },

  PLATINUM: {
    code: "PLATINUM15",
    title: "Platinum Member 15% Off",
    type: "PERCENT",
    discount: 15,
    source: "TIER",
    description:
      "Your Platinum tier reward — 15% off any order"
  }

};


function tierIndex(key) {

  return TIERS.findIndex(t => t.key === key);

}


// =====================================
// GRANT TIER VOUCHERS ON UPGRADE
//
// Mutates `user` and returns the vouchers that
// were newly granted, so the UI can announce
// them. Caller is responsible for saving.
// =====================================

function syncMemberVouchers(user) {

  const currentKey =
    resolveTier(user.points).tier.key;

  const previousKey = user.rewardTier;

  const granted = [];

  if (tierIndex(currentKey) <= tierIndex(previousKey)) {

    // no upgrade
    user.rewardTier = previousKey || currentKey;

    return granted;

  }

  // grant every tier reward between the old tier
  // (exclusive) and the new one (inclusive), so a
  // member who jumps two tiers gets both
  const from =
    previousKey === null
      ? 0
      : tierIndex(previousKey) + 1;

  const to = tierIndex(currentKey);

  for (let i = from; i <= to; i++) {

    const reward =
      TIER_VOUCHERS[TIERS[i].key];

    if (!reward) continue;

    const alreadyHas =
      (user.vouchers || []).some(
        v => v.code === reward.code
      );

    if (alreadyHas) continue;

    user.vouchers.push({
      ...reward,
      used: false,
      grantedAt: new Date()
    });

    granted.push(reward);

  }

  user.rewardTier = currentKey;

  return granted;

}


// =====================================
// LIFETIME POINTS FROM ORDER HISTORY
//
// Used once per user to backfill members
// who ordered before rewards existed.
// =====================================

async function pointsFromOrderHistory(userId) {

  const orders = await Order.find({
    userId: String(userId)
  });

  return orders.reduce(
    (sum, order) =>
      sum + pointsForOrder(order),
    0
  );

}


module.exports = {
  TIERS,
  POINTS_PER_VND,
  WELCOME_VOUCHER,
  TIER_VOUCHERS,
  pointsForOrder,
  resolveTier,
  syncMemberVouchers,
  pointsFromOrderHistory
};
