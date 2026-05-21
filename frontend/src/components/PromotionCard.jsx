export default function PromotionCard({
  promo,
  active,
  onApply
}) {
  return (
    <div
      className={`bg-gradient-to-r ${promo.background}
      text-white rounded-3xl p-6 shadow-xl relative overflow-hidden`}
    >
      <div className="absolute right-[-20px] top-[-20px] text-8xl opacity-10">
        %
      </div>

      <h2 className="text-2xl font-bold mb-2">
        {promo.title}
      </h2>

      <p className="mb-4 text-white/90">
        {promo.description}
      </p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">
            Promo Code
          </p>

          <p className="text-xl font-bold tracking-widest">
            {promo.code}
          </p>
        </div>

        <button
          onClick={() => onApply(promo)}
          className={`px-5 py-2 rounded-full font-semibold transition ${
            active
              ? "bg-white text-black"
              : "bg-black/20 hover:bg-black/40"
          }`}
        >
          {active ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}