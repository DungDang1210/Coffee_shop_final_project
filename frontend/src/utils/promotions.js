

const KEY = "promotion";

const EVENT = "promotion-changed";


export function getAppliedPromotion() {

  try {

    return JSON.parse(
      localStorage.getItem(KEY)
    );

  } catch {

    return null;

  }

}


export function applyPromotion(promo) {

  localStorage.setItem(
    KEY,
    JSON.stringify(promo)
  );

  window.dispatchEvent(
    new CustomEvent(EVENT, {
      detail: promo
    })
  );

}


export function clearPromotion() {

  localStorage.removeItem(KEY);

  window.dispatchEvent(
    new CustomEvent(EVENT, {
      detail: null
    })
  );

}


// returns an unsubscribe function
export function onPromotionChange(handler) {

  const local = (e) =>
    handler(e.detail);

  // fires when another tab changes it
  const cross = (e) => {

    if (e.key === KEY) {
      handler(getAppliedPromotion());
    }

  };

  window.addEventListener(EVENT, local);

  window.addEventListener("storage", cross);

  return () => {

    window.removeEventListener(EVENT, local);

    window.removeEventListener("storage", cross);

  };

}
