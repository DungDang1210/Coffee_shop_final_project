import { useEffect, useState } from "react";
import PromotionCard from "../../components/home/PromotionCard";
import Navbar from "../../components/common/Navbar";

export default function Promotions({
  cart = [],
  user,
  setUser,
  showToast
}) {

  const [promotions ,setPromotions]=useState([]);

  const [applied,setApplied]=useState(null);

  useEffect(() => {

    const savedPromo =
      JSON.parse(
        localStorage.getItem("promotion")
      );

    if(savedPromo){
      setApplied(savedPromo);
    }

  }, []);

  useEffect(()=>{

  fetch(
  "http://localhost:5000/api/promotions"
  )

  .then(res=>res.json())

  .then(data=>{

  setPromotions(
  data.filter(
  promo=>promo.active
  )
  );

  })

  .catch(err=>console.log(err));


  },[]);



  const apply = (promo) => {

    localStorage.setItem(

      "promotion",

      JSON.stringify(promo)

    );

    setApplied(promo);

    showToast?.(

      `${promo.title} Applied!`

    );

  };

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
              s & Deals 🎉
            </h1>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Enjoy handcrafted coffee with exclusive discounts,
              seasonal rewards, and member-only specials.
            </p>

          </div>

          <div
            className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-8
            "
            >


            {
            promotions.map(promo=>(


            <PromotionCard

            key={promo._id}

            promo={promo}

            active={
            applied?._id === promo._id
            }

            onApply={
            apply
            }

            />


            ))

            }


            </div>
            {
              applied && (

                <div className="text-center mt-10">

                  <button

                    onClick={() => {

                      setApplied(null);

                      localStorage.removeItem("promotion");

                      showToast?.("Promotion removed");

                    }}

                    className="
                    px-6 py-3
                    rounded-full
                    bg-red-500
                    text-white
                    hover:bg-red-600
                    "

                  >
                    Remove 
                  </button>

                </div>

              )
            }

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