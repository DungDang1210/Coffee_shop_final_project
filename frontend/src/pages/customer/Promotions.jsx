import { useEffect, useState } from "react";
import PromotionCard from "../../components/home/PromotionCard";
import Navbar from "../../components/common/Navbar";
import MemberAward from "../../components/rewards/MemberAward";
import PromotionDetailModal from "../../components/home/PromotionDetailModal";

import {
  getAppliedPromotion,
  applyPromotion,
  clearPromotion,
  onPromotionChange
} from "../../utils/promotions";

export default function Promotions({
  cart = [],
  user,
  setUser,
  showToast
}) {

  const [promotions ,setPromotions]=useState([]);

  const [applied,setApplied]=
    useState(getAppliedPromotion);

  // promo whose details are open
  const [detailPromo,setDetailPromo]=
    useState(null);

  // stays in sync with the home page banner
  useEffect(
    () => onPromotionChange(setApplied),
    []
  );

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

    applyPromotion(promo);

    showToast?.(

      `${promo.title} Applied!`

    );

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
              Specials & Deals 🎉
            </h1>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Enjoy handcrafted coffee with exclusive discounts,
              seasonal rewards, and member-only specials.
            </p>

          </div>

          {/* MEMBER REWARDS — first, so members see
              what they've earned before the public
              deals */}
          <div className="mb-16">

            <MemberAward user={user} />

          </div>

          {/* PUBLIC DEALS */}
          <div className="mb-8">

            <h2 className="text-3xl font-black text-[#2d1e1e] mb-2">
              Deals for everyone
            </h2>

            <p className="text-gray-600">
              Available to all customers — pick one at
              checkout.
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

            onDetails={
            setDetailPromo
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

                      clearPromotion();

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

        </div>

        <PromotionDetailModal
          promo={detailPromo}
          applied={applied?._id === detailPromo?._id}
          onApply={apply}
          onClose={() => setDetailPromo(null)}
          showToast={showToast}
        />

      </section>
    </>
  );
}