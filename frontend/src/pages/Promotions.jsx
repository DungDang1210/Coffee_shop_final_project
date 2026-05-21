import Navbar from "../components/Navbar";

export default function Promotions({
  cart = [],
  user,
  setUser,
  showToast
}) {

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);

    if (showToast) {
      showToast(`Coupon ${code} copied!`);
    } else {
      alert(`Coupon ${code} copied!`);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <Navbar
        cartCount={cart.length}
        user={user}
        setUser={setUser}
      />

      <section className="min-h-screen bg-[#fcfaf8] py-20 px-6">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-16">

            <p className="uppercase tracking-[5px] text-[#c08b5c] font-semibold mb-3">
              LIMITED TIME OFFERS
            </p>

            <h1 className="text-5xl md:text-6xl font-black text-[#2d1e1e] mb-5">
              Promotions & Deals 🎉
            </h1>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Enjoy handcrafted coffee with exclusive discounts,
              seasonal rewards, and member-only specials.
            </p>

          </div>

          {/* PROMOTIONS GRID */}
          <div className="grid lg:grid-cols-2 gap-10">

            {/* PROMO 1 */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#6b4f4f] to-[#2d1e1e] text-white rounded-[32px] p-10 shadow-2xl">

              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

              <p className="uppercase tracking-[4px] text-[#e7c7a5] text-sm mb-4">
                NEW CUSTOMER
              </p>

              <h2 className="text-4xl font-black mb-4">
                20% OFF
                <br />
                Your First Order
              </h2>

              <p className="text-gray-300 mb-8 leading-relaxed">
                Create your account today and unlock premium
                handcrafted drinks with instant savings.
              </p>

              {/* COUPON */}
              <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 flex items-center justify-between mb-8 backdrop-blur">

                <div>
                  <p className="text-xs text-gray-300 mb-1">
                    PROMO CODE
                  </p>

                  <h3 className="text-2xl font-black tracking-[3px]">
                    WELCOME20
                  </h3>
                </div>

                <button
                  onClick={() => copyCoupon("WELCOME20")}
                  className="bg-[#c08b5c] hover:bg-[#a87246] px-5 py-3 rounded-full font-semibold transition"
                >
                  Copy
                </button>

              </div>

              <p className="text-sm text-gray-400">
                Valid until December 31, 2026
              </p>

            </div>

            {/* PROMO 2 */}
            <div className="bg-white rounded-[32px] p-10 shadow-xl border border-[#f0e5db]">

              <p className="uppercase tracking-[4px] text-[#c08b5c] text-sm mb-4">
                WEEKEND SPECIAL
              </p>

              <h2 className="text-4xl font-black text-[#2d1e1e] mb-4">
                Buy 1 Get 1 Free ☕
              </h2>

              <p className="text-gray-600 leading-relaxed mb-8">
                Every Friday, enjoy Buy 1 Get 1 Free on selected
                signature drinks and seasonal specials.
              </p>

              {/* OFFER BOX */}
              <div className="bg-[#f8f3ef] rounded-2xl p-6 mb-8">

                <div className="flex justify-between items-center mb-3">

                  <span className="text-gray-500">
                    Offer Code
                  </span>

                  <span className="font-bold text-[#6b4f4f]">
                    BOGOFRIDAY
                  </span>

                </div>

                <button
                  onClick={() => copyCoupon("BOGOFRIDAY")}
                  className="w-full bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white py-4 rounded-2xl font-semibold transition"
                >
                  Claim Deal
                </button>

              </div>

              {/* TIMER */}
              <div className="flex gap-4">

                {["12", "08", "45"].map((time, i) => (

                  <div
                    key={i}
                    className="flex-1 bg-[#fcfaf8] rounded-2xl py-5 text-center"
                  >

                    <h3 className="text-3xl font-black text-[#2d1e1e]">
                      {time}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {i === 0
                        ? "Hours"
                        : i === 1
                        ? "Minutes"
                        : "Seconds"}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* MEMBER SECTION */}
          <div className="mt-16 bg-[#efe7de] rounded-[32px] p-10 flex flex-col lg:flex-row justify-between items-center gap-8">

            <div>

              <p className="uppercase tracking-[4px] text-[#c08b5c] text-sm mb-3">
                MEMBER REWARDS
              </p>

              <h2 className="text-4xl font-black text-[#2d1e1e] mb-4">
                Earn Free Drinks Faster
              </h2>

              <p className="text-gray-600 max-w-2xl">
                Join Brew Haven Rewards and collect points
                every time you order coffee, desserts,
                or seasonal specials.
              </p>

            </div>

            <button
              onClick={() => copyCoupon("BREWVIP")}
              className="bg-[#2d1e1e] hover:bg-[#4b332f] text-white px-8 py-4 rounded-full font-semibold transition hover:scale-105"
            >
              Join Rewards
            </button>

          </div>

        </div>

      </section>
    </>
  );
}