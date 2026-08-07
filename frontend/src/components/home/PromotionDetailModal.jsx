import {
  X,
  Tag,
  Check,
  Info,
  Copy
} from "lucide-react";

import { getPromoStyle } from "../../utils/promoTypes";

import { voucherLabel } from "../../utils/voucherValue";

const RULES = {

  FREESHIP: {
    how: "Your delivery fee is waived at checkout.",
    terms: [
      "Applies to the 15.000₫ standard delivery fee",
      "Delivery address required",
      "Cannot be combined with another voucher"
    ]
  },

  FLASHSALE: {
    how: "A percentage comes off your item subtotal.",
    terms: [
      "Discount applies to drinks and food subtotal",
      "Taken before tax is calculated",
      "One voucher per order"
    ]
  },

  BUY5GET1: {
    how: "Buy 6 drinks and the cheapest one is free.",
    terms: [
      "Your cart must contain at least 6 drinks",
      "The lowest-priced item becomes free",
      "Counts total quantity, not distinct products"
    ]
  },

  ECO: {
    how: "Bring your own tumbler and save a flat amount.",
    terms: [
      "Flat 5.000₫ off the order",
      "Please hand your tumbler to the barista",
      "One discount per order"
    ]
  },

  PERCENT: {
    how: "A percentage comes off your item subtotal.",
    terms: [
      "Personal voucher — tied to your account",
      "Single use",
      "One voucher per order"
    ]
  },

  WELCOME: {
    how: "20% off, on your very first order.",
    terms: [
      "New members only",
      "Valid on your first order only",
      "Single use"
    ]
  }

};

const DEFAULT_RULE = {
  how: "Apply it at checkout to see the discount.",
  terms: ["One voucher per order"]
};


export default function PromotionDetailModal({
  promo,
  applied,
  onApply,
  onClose,
  showToast
}) {

  if (!promo) return null;

  const style = getPromoStyle(promo.type);

  const rule =
    RULES[promo.type] || DEFAULT_RULE;

  const copyCode = () => {

    if (!promo.code) return;

    navigator.clipboard
      ?.writeText(promo.code)
      .then(() =>
        showToast?.(`Code ${promo.code} copied!`)
      );

  };

  return (

    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >

      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={promo.title}
      >

        {/* HEADER */}
        <div
          className={`relative bg-gradient-to-br ${style.gradient} text-white p-7`}
        >

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>

          <span className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] mb-4">

            <span aria-hidden="true">
              {style.icon}
            </span>

            {style.label}

          </span>

          <h2 className="text-2xl font-black leading-tight pr-10">
            {promo.title}
          </h2>

          <p className="text-white/85 mt-2">
            {voucherLabel(promo)}
          </p>

        </div>

        <div className="p-7 space-y-6">

          {/* WHAT IT IS */}
          <div>

            <h3 className="font-bold text-[#2d1e1e] mb-2 flex items-center gap-2">

              <Info size={16} />

              How it works

            </h3>

            <p className="text-gray-600 leading-relaxed">
              {rule.how}
            </p>

            {promo.description && (

              <p className="text-gray-500 text-sm mt-2">
                {promo.description}
              </p>

            )}

          </div>

          {/* CODE */}
          {promo.code && (

            <div>

              <h3 className="font-bold text-[#2d1e1e] mb-2 flex items-center gap-2">

                <Tag size={16} />

                Voucher code

              </h3>

              <button
                onClick={copyCode}
                className="w-full flex items-center justify-between gap-3 bg-[#f3e2d0] border-2 border-dashed border-[#c08b5c] rounded-xl px-5 py-3.5 hover:bg-[#ecd6bd] transition group"
              >

                <span className="font-mono font-bold tracking-[0.2em] text-[#8a5f34]">
                  {promo.code}
                </span>

                <span className="flex items-center gap-1.5 text-sm text-[#8a5f34] font-semibold">

                  <Copy size={15} />

                  Copy

                </span>

              </button>

            </div>

          )}

          {/* TERMS */}
          <div>

            <h3 className="font-bold text-[#2d1e1e] mb-3">
              Conditions
            </h3>

            <ul className="space-y-2">

              {rule.terms.map(term => (

                <li
                  key={term}
                  className="flex items-start gap-2.5 text-sm text-gray-600"
                >

                  <Check
                    size={15}
                    className="text-green-600 shrink-0 mt-0.5"
                  />

                  {term}

                </li>

              ))}

              {promo.expireDate && (

                <li className="flex items-start gap-2.5 text-sm text-gray-600">

                  <Check
                    size={15}
                    className="text-green-600 shrink-0 mt-0.5"
                  />

                  Valid until{" "}
                  {
                    new Date(promo.expireDate)
                      .toLocaleDateString("vi-VN")
                  }

                </li>

              )}

            </ul>

          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">

            <button
              onClick={onClose}
              className="flex-1 px-5 py-3.5 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50 transition"
            >
              Close
            </button>

            <button
              onClick={() => {
                onApply?.(promo);
                onClose();
              }}
              disabled={applied}
              className={`flex-1 px-5 py-3.5 rounded-xl font-semibold transition ${
                applied
                  ? "bg-green-100 text-green-700 cursor-default"
                  : "bg-[#6b4f4f] text-white hover:bg-[#5a3f3f]"
              }`}
            >

              {
                applied
                  ? "Applied ✓"
                  : "Use this offer"
              }

            </button>

          </div>

          <p className="text-xs text-gray-400 text-center">
            Vouchers are applied at checkout, where
            you can see the exact saving on your cart.
          </p>

        </div>

      </div>

    </div>

  );

}
