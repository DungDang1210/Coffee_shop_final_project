export default function PromotionCard({
  promo,
  active,
  onApply
}) {

  const backgrounds = {
    FREESHIP: "from-green-500 to-emerald-700",
    FLASHSALE: "from-orange-500 to-red-600",
    BUY5GET1: "from-purple-600 to-pink-600",
    ECO: "from-teal-500 to-green-600"
  };

  const labels = {
    FREESHIP: "🚚 Free Shipping",
    FLASHSALE: "⚡ Happy Hour",
    BUY5GET1: "🥤 Buy 5 Get 1",
    ECO: "🌱 Eco Reward"
  };

  return (

    <div
      className={`
      bg-gradient-to-br
      ${backgrounds[promo.type] || "from-[#6b4f4f] to-[#2d1e1e]"}
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
      {promo.banner && (

        <img
          src={promo.banner}
          alt={promo.title}
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

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm opacity-80">
            Promotion Type
          </p>

          <p className="text-xl font-bold tracking-widest">
            {labels[promo.type]}
          </p>

        </div>

        <button

          onClick={() => onApply(promo)}

          className={`
          px-5
          py-2
          rounded-full
          font-semibold
          transition
          ${
            active
              ? "bg-white text-black"
              : "bg-black/20 hover:bg-black/40"
          }
          `}
        >

          {active ? "Applied ✓" : "Apply"}

        </button>

      </div>

    </div>

  );
}