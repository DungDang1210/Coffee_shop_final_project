import { useState } from "react";

import { getPromoStyle } from "../../utils/promoTypes";

export default function PromotionCard({
  promo,
  active,
  onApply,
  onDetails
}) {

  const style = getPromoStyle(promo.type);

  const [failed, setFailed] = useState("");

  const image =
    failed === "all"
      ? null
      : failed === "banner" || !promo.banner
        ? style.image
        : promo.banner;

  const handleImageError = () => {

    setFailed(prev =>
      prev === "banner" || !promo.banner
        ? "all"
        : "banner"
    );

  };

  return (

    <div
      className={`
      bg-gradient-to-br
      ${style.gradient}
      text-white
      rounded-3xl
      p-6
      shadow-xl
      relative
      overflow-hidden
      `}
    >

      {/* Background % */}
      <div className="absolute right-[-20px] top-[-20px] text-8xl opacity-10">
        %
      </div>

      {/* Banner */}
      {image && (

        <img
          key={image}
          src={image}
          alt=""
          onError={handleImageError}
          className="
          w-full
          h-40
          object-cover
          rounded-2xl
          mb-5
          "
        />

      )}

      <h2 className="text-2xl font-bold mb-2">
        {promo.title}
      </h2>

      <p className="mb-6 text-white/90">
        {promo.description}
      </p>

      <div className="flex justify-between items-end gap-3">

        <div className="min-w-0">

          <p className="text-sm opacity-80">
            Promotion Type
          </p>

          <p className="text-lg font-bold tracking-wide truncate">
            {style.icon} {style.label}
          </p>

          {promo.code && (

            <p className="font-mono text-xs mt-1 opacity-80 tracking-widest">
              {promo.code}
            </p>

          )}

        </div>

        <div className="flex flex-col gap-2 shrink-0">

          <button

            onClick={() => onApply(promo)}

            className={`px-5 py-2 rounded-full font-semibold transition whitespace-nowrap ${
              active
                ? "bg-white text-black"
                : "bg-black/20 hover:bg-black/40"
            }`}
          >

            {active ? "Applied ✓" : "Apply"}

          </button>

          {/* details so the customer can actually
              understand the offer */}
          <button
            onClick={() => onDetails?.(promo)}
            className="px-5 py-1.5 rounded-full text-sm font-medium border border-white/40 hover:bg-white/15 transition whitespace-nowrap"
          >
            Details
          </button>

        </div>

      </div>

    </div>

  );
}