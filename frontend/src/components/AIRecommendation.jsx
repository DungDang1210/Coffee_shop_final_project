import { useState } from "react";
import {
  Sparkles,
  Zap,
  Candy,
  Cloud,
  Target,
  Loader2
} from "lucide-react";

export default function AIRecommendation({
  products = [],
  cart = [],
  setCart,
  showToast
}) {

  const [recommendation, setRecommendation] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const moods = [
    {
      label: "Need Energy",
      icon: <Zap size={18} />,
      key: "energy"
    },
    {
      label: "Sweet Craving",
      icon: <Candy size={18} />,
      key: "sweet"
    },
    {
      label: "Relaxing",
      icon: <Cloud size={18} />,
      key: "relax"
    },
    {
      label: "Focus Mode",
      icon: <Target size={18} />,
      key: "focus"
    }
  ];

  // =========================
  // LOCAL AI ENGINE
  // =========================

  const getAIRecommendation = (mood) => {

    switch (mood) {

      case "energy":

        return products.filter(product =>

          product.category === "Coffee" ||

          product.name.toLowerCase().includes("espresso") ||

          product.description
            .toLowerCase()
            .includes("strong")

        );

      case "sweet":

        return products.filter(product =>

          product.category === "Dessert Drink" ||

          product.category === "Sweet" ||

          product.description
            .toLowerCase()
            .includes("sweet") ||

          product.name
            .toLowerCase()
            .includes("caramel")

        );

      case "relax":

        return products.filter(product =>

          product.category === "Tea" ||

          product.name
            .toLowerCase()
            .includes("latte") ||

          product.description
            .toLowerCase()
            .includes("smooth")

        );

      case "focus":

        return products.filter(product =>

          product.category === "Coffee" ||

          product.name
            .toLowerCase()
            .includes("americano") ||

          product.name
            .toLowerCase()
            .includes("espresso")

        );

      default:
        return [];
    }

  };

  // =========================
  // HANDLE AI
  // =========================

  const handleRecommend = async (moodKey) => {

    setLoading(true);

    setRecommendation(null);

    setTimeout(() => {

      const matches =
        getAIRecommendation(moodKey);

      if (matches.length === 0) {

        setLoading(false);

        return;
      }

      // RANDOM PRODUCT
      const randomProduct =
        matches[
          Math.floor(Math.random() * matches.length)
        ];

      let reason = "";

      switch (moodKey) {

        case "energy":
          reason =
            "Perfect caffeine boost to recharge your day ⚡";
          break;

        case "sweet":
          reason =
            "Sweet, creamy and comforting for your cravings 🍬";
          break;

        case "relax":
          reason =
            "Smooth and calming drink for relaxing moments ☁️";
          break;

        case "focus":
          reason =
            "Helps you stay alert and focused 🎯";
          break;

        default:
          reason =
            "Recommended specially for you 🤖";
      }

      setRecommendation({
        ...randomProduct,
        reason
      });

      setLoading(false);

    }, 1200);
  };

  // =========================
  // ADD CART
  // =========================

  const addToCart = () => {

    if (!recommendation) return;

    const exist = cart.find(
      item =>
        item._id === recommendation._id
    );

    if (exist) {

      setCart(
        cart.map(item =>

          item._id === recommendation._id

            ? {
                ...item,
                qty: item.qty + 1
              }

            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...recommendation,
          qty: 1,
          customization: {
            size: "Medium",
            sugar: "100%",
            ice: "Normal",
            milk: "Regular"
          }
        }
      ]);
    }

    showToast?.(
      `${recommendation.name} added to cart`
    );
  };

  return (

    <section className="bg-[#fcfaf8] py-20">

      <div className="max-w-7xl mx-auto px-10">

        <div className="bg-gradient-to-br from-[#fffaf5] to-[#f7efe8] rounded-[32px] p-10 border border-[#eee] shadow-sm">

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">

            <div className="p-4 rounded-2xl bg-[#6b4f4f] text-white shadow-lg">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#2d1e1e]">
                AI Coffee Assistant
              </h2>

              <p className="text-gray-500">
                Smart recommendations based on your mood.
              </p>
            </div>

          </div>

          {/* MOODS */}
          <div className="grid md:grid-cols-4 gap-4 mb-10">

            {moods.map((mood) => (

              <button
                key={mood.key}
                onClick={() =>
                  handleRecommend(mood.key)
                }
                className="group bg-white border border-[#eee] rounded-2xl py-5 px-4 flex flex-col items-center gap-3 hover:border-[#c08b5c] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >

                <div className="text-[#6b4f4f] group-hover:scale-110 transition">
                  {mood.icon}
                </div>

                <span className="font-semibold text-sm">
                  {mood.label}
                </span>

              </button>

            ))}

          </div>

          {/* LOADING */}
          {loading && (

            <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center border border-[#eee]">

              <Loader2
                size={40}
                className="animate-spin text-[#6b4f4f] mb-4"
              />

              <h3 className="text-xl font-bold text-[#2d1e1e] mb-2">
                AI is choosing your drink...
              </h3>

              <p className="text-gray-500">
                Finding the perfect match ☕
              </p>

            </div>

          )}

          {/* RESULT */}
          {recommendation && !loading && (

            <div className="animate-fadeIn bg-white rounded-3xl p-6 border border-[#eee] shadow-lg">

              <div className="flex flex-col md:flex-row gap-6 items-center">

                <img
                  src={recommendation.image}
                  alt={recommendation.name}
                  className="w-36 h-36 rounded-2xl object-cover shadow-md"
                />

                <div className="flex-1">

                  <h3 className="text-2xl font-bold text-[#2d1e1e] mb-2">
                    {recommendation.name}
                  </h3>

                  <p className="text-gray-600 mb-3">
                    {recommendation.description}
                  </p>

                  <p className="text-sm text-[#6b4f4f] font-medium">
                    🤖 {recommendation.reason}
                  </p>

                </div>

                <button
                  onClick={addToCart}
                  className="bg-[#6b4f4f] text-white px-6 py-3 rounded-2xl hover:bg-[#5a3f3f] hover:scale-105 transition"
                >
                  Add to Cart
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}