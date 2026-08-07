import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  TrendingUp,
  LoaderCircle,
  Sparkles
} from "lucide-react";

export default function PersonalizedAI({
  user,
  cart = [],
  setCart,
  showToast
}) {

  const [
    recommendation,
    setRecommendation
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  // ============================
  // LOAD AI PERSONALIZATION
  // ============================
  useEffect(()=>{

    if(!user?._id){

      setRecommendation(null);

      return;

    }

    let cancelled = false;

    setLoading(true);

    const token =
      localStorage.getItem("token");

    fetch(
      "http://localhost:5000/api/ai/recommend",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          ...(
            token
              ? { Authorization: `Bearer ${token}` }
              : {}
          )
        },

        body: JSON.stringify({
          userId: user._id
        })
      }
    )

      .then(res => res.json())

      .then(data => {

        if (cancelled) return;

        if (data?.product) {
          setRecommendation(data);
        }

      })

      .catch(error =>
        console.log("AI Error:", error)
      )

      .finally(() => {

        if (!cancelled) setLoading(false);

      });

    return () => {
      cancelled = true;
    };

  },[user?._id]);

  // ============================
  // ADD TO CART
  // ============================

  const handleAdd = ()=>{

    if(!recommendation?.product || !setCart){
      return;
    }

    const product =
      recommendation.product;

    const exist =
      cart.find(
        item =>
          item._id === product._id
      );

    if(exist){

      setCart(

        cart.map(item=>

          item._id === product._id
          ?
          {
            ...item,
            qty:item.qty + 1
          }
          :
          item
        )

      );

    }

    else{

      setCart([

        ...cart,

        {

          ...product,

          qty:1,

          customization:{

            size:"Medium",

            sugar:"100%",

            ice:"Normal",

            milk:"Regular"

          }

        }

      ]);

    }

    showToast?.(

      `${product.name} added to cart`

    );

  };

  // ============================
  // LOADING
  // ============================

  if(loading && !recommendation){

    return (

      <section className="mb-14">

        <div className="bg-gradient-to-r from-[#fffaf5] to-[#f3e9df] p-8 rounded-3xl border shadow-sm flex items-center gap-3 text-gray-500">

          <LoaderCircle
            size={18}
            className="animate-spin"
          />

          Reading your taste profile...

        </div>

      </section>

    );

  }

  // ============================
  // NO DATA
  // ============================

  if(!recommendation || !recommendation.product){
    return null;
  }

  const fromHistory =
    recommendation.basedOn === "history";

  return (

    <section className="mb-14">

      <div className="bg-gradient-to-r from-[#fffaf5] to-[#f3e9df] p-8 rounded-3xl border shadow-sm">

        {/* HEADER */}

        <div className="flex items-center gap-3 mb-6">

          <div className="p-3 bg-[#6b4f4f] text-white rounded-xl">

            <Brain size={20}/>

          </div>

          <div>


            <h2 className="text-2xl font-bold text-[#2d1e1e]">

              ✨ Just For You

            </h2>


            <p className="text-gray-500 text-sm">

              {
                fromHistory
                  ? `Matched against ${recommendation.ordersAnalyzed} of your past orders`
                  : "A house signature to get you started"
              }

            </p>

          </div>

        </div>

        {/* PRODUCT */}

        <div
          className="flex flex-col md:flex-row items-center gap-6">

          <img

            src={
              recommendation.product.image
            }

            alt={
              recommendation.product.name
            }


            className="w-36 h-36 rounded-3xl object-cover shadow-lg"

          />

          <div className="flex-1">

            <div className="flex items-center gap-3 mb-2 flex-wrap">

              <span className="flex items-center gap-2 text-[#c08b5c]">

                <TrendingUp size={16}/>

                <span className="text-sm font-semibold">
                  AI Match
                </span>

              </span>

              {fromHistory && recommendation.score > 0 && (

                <span className="inline-flex items-center gap-1 bg-[#f3e2d0] text-[#8a5f34] text-xs font-bold px-2.5 py-1 rounded-full">

                  <Sparkles size={12} />

                  {recommendation.score} pt match

                </span>

              )}

            </div>

            <Link
              to={`/product/${recommendation.product._id}`}
              className="text-2xl font-bold hover:text-[#6b4f4f] transition"
            >

              {
                recommendation.product.name
              }

            </Link>

            <p className="text-gray-600 mt-2">

              {
                recommendation.product.description
              }

            </p>

            <p className="mt-3 text-[#6b4f4f] font-medium">

              🤖 {
                recommendation.reason
              }

            </p>

          </div>

          <button

            onClick={handleAdd}

            className="bg-[#6b4f4f] text-white px-6 py-3 rounded-2xl hover:bg-[#5a3f3f] transition">

            Add To Cart

          </button>



        </div>




      </div>



    </section>


  );

}
