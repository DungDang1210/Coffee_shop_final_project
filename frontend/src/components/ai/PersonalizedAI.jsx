import { useEffect, useState } from "react";
import { Brain, TrendingUp } from "lucide-react";

export default function PersonalizedAI({
  user,
  cart = [],
  setCart,
  showToast
}) {
  const token = localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  fetch("http://localhost:5000/api/ai/...", {
      headers: authHeaders
  })

  const [
    recommendation,
    setRecommendation
  ] = useState(null);

  // ============================
  // LOAD AI PERSONALIZATION
  // ============================
  useEffect(()=>{

    if(!user?._id){
      return;
    }

    const fetchAI =
      async()=>{

        try{

          const response =
            await fetch(
              "http://localhost:5000/api/ai/recommend",
              {

                method:"POST",

                headers:{

                  "Content-Type": "application/json",
                  ...authHeaders()

                },

                body: JSON.stringify({})

              }

            );

          const data =
            await response.json();

          if(data.product){

              setRecommendation(data);

          }

        }

        catch(error){
          console.log(
            "AI Error:",
            error
          );

        }

      };

    fetchAI();

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
  // NO DATA
  // ============================

  if(!recommendation || !recommendation.product){
    return null;
  }

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

              AI personalized drink based on your taste

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

            <div className=" flex items-center gap-2 text-[#c08b5c] mb-2">

              <TrendingUp size={16}/>

              <span className="text-sm font-semibold">

                AI Match

              </span>

            </div>

            <h3 className="text-2xl font-bold">

              {
                recommendation.product.name
              }

            </h3>

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
