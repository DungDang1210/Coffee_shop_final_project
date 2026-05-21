import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Brain,
  TrendingUp
} from "lucide-react";

export default function PersonalizedAI({
  orders = [],
  products = [],
  cart = [],
  setCart,
  showToast
}) {

  const [recommendation, setRecommendation] =
    useState(null);

  // =========================
  // AI LEARNING ENGINE
  // =========================

  useEffect(() => {

    if (!orders.length || !products.length) {
      return;
    }

    // =========================
    // STEP 1:
    // COUNT USER PREFERENCES
    // =========================

    const categoryScore = {};
    const subcategoryScore = {};
    const orderedNames = [];

    orders.forEach(order => {

      order.items.forEach(item => {

        orderedNames.push(item.name);

        // CATEGORY SCORE
        categoryScore[item.category] =
          (categoryScore[item.category] || 0)
          + item.qty;

        // SUBCATEGORY SCORE
        subcategoryScore[item.subcategory] =
          (subcategoryScore[item.subcategory] || 0)
          + item.qty;

      });

    });

    // =========================
    // STEP 2:
    // FIND FAVORITE CATEGORY
    // =========================

    const favoriteCategory =
      Object.keys(categoryScore).reduce(
        (a, b) =>
          categoryScore[a] > categoryScore[b]
            ? a
            : b
      );

    const favoriteSubcategory =
      Object.keys(subcategoryScore).reduce(
        (a, b) =>
          subcategoryScore[a] >
          subcategoryScore[b]
            ? a
            : b
      );

    // =========================
    // STEP 3:
    // FIND RELATED PRODUCTS
    // =========================

    const possibleProducts =
      products.filter(product => {

        // NOT ALREADY ORDERED
        const alreadyOrdered =
          orderedNames.includes(product.name);

        return (

          !alreadyOrdered &&

          (
            product.category ===
              favoriteCategory ||

            product.subcategory ===
              favoriteSubcategory
          )
        );

      });

    // =========================
    // STEP 4:
    // PRIORITIZE GOOD PRODUCTS
    // =========================

    const rankedProducts =
      possibleProducts.sort((a, b) => {

        const scoreA =
          (a.bestSeller ? 2 : 0) +
          (a.signature ? 3 : 0);

        const scoreB =
          (b.bestSeller ? 2 : 0) +
          (b.signature ? 3 : 0);

        return scoreB - scoreA;

      });

    // =========================
    // STEP 5:
    // RANDOM SMART PICK
    // =========================

    const finalPick =
      rankedProducts[
        Math.floor(
          Math.random() *
          Math.min(rankedProducts.length, 3)
        )
      ];

    if (finalPick) {

      setRecommendation({
        product: finalPick,
        reason:
          `You often enjoy ${favoriteCategory} and ${favoriteSubcategory} drinks, so this could match your taste perfectly.`
      });

    }

  }, [orders, products]);

  // =========================
  // ADD TO CART
  // =========================

  const handleAdd = () => {

    if (!recommendation) return;

    const exist = cart.find(
      item =>
        item._id ===
        recommendation.product._id
    );

    if (exist) {

      setCart(
        cart.map(item =>

          item._id ===
          recommendation.product._id

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
          ...recommendation.product,
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
      `${recommendation.product.name} added to cart`
    );
  };

  // =========================
  // EMPTY
  // =========================

  if (!recommendation) {
    return null;
  }

  return (

    <section className="mb-14">

      <div className="bg-gradient-to-r from-[#fffaf5] to-[#f3e9df] p-8 rounded-3xl border border-[#eee] shadow-sm">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">

          <div className="p-3 bg-[#6b4f4f] text-white rounded-xl">
            <Brain size={18} />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-[#2d1e1e]">
              AI Personalized Pick
            </h2>

            <p className="text-gray-500 text-sm">
              Based on your order history and taste preferences
            </p>

          </div>

        </div>

        {/* CONTENT */}
        <div className="flex flex-col md:flex-row items-center gap-6">

          <img
            src={recommendation.product.image}
            alt={recommendation.product.name}
            className="w-32 h-32 rounded-3xl object-cover shadow-lg"
          />

          <div className="flex-1">

            <div className="flex items-center gap-2 mb-2 text-[#c08b5c]">

              <TrendingUp size={16} />

              <span className="text-sm font-semibold">
                Smart AI Recommendation
              </span>

            </div>

            <h3 className="text-2xl font-bold text-[#2d1e1e] mb-2">
              {recommendation.product.name}
            </h3>

            <p className="text-gray-600 mb-3">
              {recommendation.product.description}
            </p>

            <p className="text-sm text-[#6b4f4f] font-medium">
              🤖 {recommendation.reason}
            </p>

          </div>

          <Link
            to={`/product/${recommendation.product._id}`}
            className="bg-[#6b4f4f] text-white px-6 py-3 rounded-2xl hover:bg-[#5a3f3f] hover:scale-105 transition"
          >
            View & Add to Cart
          </Link>

        </div>

      </div>

    </section>

  );
}