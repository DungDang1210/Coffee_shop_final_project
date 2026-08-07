

export const PROMO_TYPES = {

  FREESHIP: {
    label: "Free Shipping",
    icon: "🚚",
    gradient: "from-green-600 to-emerald-800",
    image: "/images/banner-free-shipping.jpg"
  },

  FLASHSALE: {
    label: "Happy Hour",
    icon: "⚡",
    gradient: "from-orange-500 to-red-600",
    image: "/images/banner-happy-hour.jpg"
  },

  BUY5GET1: {
    label: "Buy 5 Get 1",
    icon: "🥤",
    gradient: "from-purple-600 to-pink-600",
    image: "/images/banner-buy-5-get-1.jpg"
  },

  ECO: {
    label: "Eco Reward",
    icon: "🌱",
    gradient: "from-teal-600 to-green-700",
    image: "/images/banner-eco-reward.jpg"
  },

  // personal new-member voucher
  WELCOME: {
    label: "Welcome Offer",
    icon: "🎁",
    gradient: "from-[#8a5f34] to-[#c08b5c]",
    image: "/images/banner-new-member.jpg"
  },

  // personal tier reward
  PERCENT: {
    label: "Member Reward",
    icon: "👑",
    gradient: "from-[#5a3f3f] to-[#c08b5c]",
    image: "/images/banner-coffee.jpg"
  }

};

export const DEFAULT_PROMO_TYPE = {
  label: "Special Offer",
  icon: "🎉",
  gradient: "from-[#6b4f4f] to-[#2d1e1e]",
  image: "/images/banner-coffee.jpg"
};

export function getPromoStyle(type) {

  return (
    PROMO_TYPES[type] ||
    DEFAULT_PROMO_TYPE
  );

}
