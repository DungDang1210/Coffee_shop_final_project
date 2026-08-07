

export const DELIVERY_FEE = 15000;


export function voucherKey(voucher) {

  if (!voucher) return null;

  return String(
    voucher._id ||
    voucher.code ||
    voucher.title ||
    ""
  );

}


export function sameVoucher(a, b) {

  const ka = voucherKey(a);

  const kb = voucherKey(b);

  return Boolean(ka) && ka === kb;

}

export const TAX_RATE = 0.1;


// total number of drinks in the cart
export function cartQuantity(cart = []) {

  return cart.reduce(
    (n, item) =>
      n + (Number(item.qty) || 1),
    0
  );

}


// =====================================
// BREAK DOWN ONE VOUCHER
// =====================================

export function priceCart(cart = [], voucher = null) {

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * (Number(item.qty) || 1),
    0
  );

  // percentage off the subtotal
  const percentOff =
    voucher?.discount
      ? subtotal * voucher.discount / 100
      : 0;

  const quantity = cartQuantity(cart);

  // fixed / conditional perks by type
  let perkOff = 0;

  let freeShipping = false;

  switch (voucher?.type) {

    case "FREESHIP":
      freeShipping = true;
      break;

    // FLASHSALE deliberately adds nothing here.
    // Happy Hour already carries discount: 15, and
    // the old checkout applied BOTH the percentage
    // and a second hard-coded 15% — charging 30%
    // off instead of the advertised 15%.
    case "FLASHSALE":
      break;

    case "BUY5GET1":
      // cheapest drink free once you have 6
      perkOff =
        quantity >= 6 && cart.length
          ? Math.min(...cart.map(i => i.price))
          : 0;
      break;

    case "ECO":
      perkOff = 5000;
      break;

    default:
      break;

  }

  const shippingFee =
    freeShipping ? 0 : DELIVERY_FEE;

  const discountedSubtotal =
    Math.max(0, subtotal - percentOff - perkOff);

  const tax =
    discountedSubtotal * TAX_RATE;

  const total =
    discountedSubtotal + shippingFee + tax;

  return {
    subtotal,
    percentOff,
    perkOff,
    freeShipping,
    shippingFee,
    discountedSubtotal,
    tax,
    total
  };

}


// =====================================
// SAVINGS VS NO VOUCHER
// =====================================

export function voucherSavings(cart = [], voucher = null) {

  if (!voucher) return 0;

  const base = priceCart(cart, null);

  const withVoucher = priceCart(cart, voucher);

  return Math.max(
    0,
    Math.round(base.total - withVoucher.total)
  );

}


// =====================================
// WHY A VOUCHER CANNOT BE USED YET
// returns null when it is usable
// =====================================

export function voucherBlocker(cart = [], voucher) {

  if (voucher?.type === "BUY5GET1") {

    const quantity = cartQuantity(cart);

    if (quantity < 6) {

      const missing = 6 - quantity;

      return `Add ${missing} more drink${
        missing === 1 ? "" : "s"
      } to unlock this`;

    }

  }

  return null;

}


// =====================================
// RANK EVERY VOUCHER FOR THIS CART
//
// Returns the list sorted best-first, each
// annotated with savings and whether it is
// currently usable.
// =====================================

export function rankVouchers(cart = [], vouchers = []) {

  return vouchers
    .map(voucher => {

      const blocker =
        voucherBlocker(cart, voucher);

      return {
        voucher,
        savings: voucherSavings(cart, voucher),
        blocker,
        usable: !blocker
      };

    })
    .sort((a, b) => {

      // usable options first, then by money saved
      if (a.usable !== b.usable) {
        return a.usable ? -1 : 1;
      }

      return b.savings - a.savings;

    });

}


// =====================================
// SHORT HUMAN LABEL
// =====================================

export function voucherLabel(voucher) {

  switch (voucher?.type) {

    case "FREESHIP":
      return "Free shipping";

    case "FLASHSALE":
      return "15% flash sale";

    case "BUY5GET1":
      return "Buy 5 get 1 free";

    case "ECO":
      return "Bring your own tumbler";

    default:
      return voucher?.discount
        ? `${voucher.discount}% off`
        : "Special offer";

  }

}
