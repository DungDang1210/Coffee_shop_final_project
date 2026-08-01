import Navbar from "../../components/common/Navbar";
import ProductCard from "../../components/product/ProductCard";
import HeroSlider from "../../components/home/HeroSlider";
import { useState } from "react";

export default function Menu({
  products = [],
  cart = [],
  setCart,
  user,
  setUser,
  favorites,
  setFavorites,
  showToast
}) {

  const [mainCategory, setMainCategory] =
    useState("All");

  // =========================
  // CATEGORIES
  // =========================

  const DRINK_CATEGORIES = [
    "⭐ Vietnamese Coffee",
    "Coffee",
    "Tea",
    "Smoothie",
    "Juice",
    "Soda",
    "Dessert Drink"
  ];

  const FOOD_CATEGORIES = [
    "Sweet",
    "Bakery"
  ];

  // =========================
  // FILTER
  // =========================

  const filteredProducts = products.filter(
    product =>
      mainCategory === "All" ||
      product.category === mainCategory
      || (mainCategory === "⭐ Vietnamese Coffee" && product.subcategory === "Vietnamese Coffee")
  );

  return (
    <>
      {/* NAVBAR */}
      <Navbar
        cartCount={cart?.length || 0}
        user={user}
        setUser={setUser}
      />

      {/* HERO */}
      <HeroSlider
        products={products}
      />

      <section className="bg-[#fcfaf8] min-h-screen py-16">

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="grid lg:grid-cols-[280px_1fr] gap-10">

            {/* SIDEBAR */}
            <div className="w-[280px] h-screen sticky top-0 overflow-y-auto bg-[#faf7f4] border-r border-[#eee] px-8 py-10">

              {/* DRINKS */}
              <div className="mb-10">

                <h2 className="text-3xl font-bold text-[#2d1e1e] mb-5">
                  Drinks
                </h2>

                <div className="flex flex-col gap-3">

                  <button
                    onClick={() =>
                      setMainCategory("All")
                    }
                    className={`text-left px-4 py-3 rounded-xl transition ${
                      mainCategory === "All"
                        ? "bg-[#2d1e1e] text-white"
                        : "hover:bg-[#f3ece5]"
                    }`}
                  >
                    All Menu
                  </button>

                  {DRINK_CATEGORIES.map(cat => (

                    <button
                      key={cat}
                      onClick={() =>
                        setMainCategory(cat)
                      }
                      className={`text-left px-4 py-3 rounded-xl transition ${
                        mainCategory === cat
                          ? "bg-[#6b4f4f] text-white"
                          : "hover:bg-[#f3ece5]"
                      }`}
                    >
                      {cat}
                    </button>

                  ))}

                </div>

              </div>

              {/* FOOD */}
              <div>

                <h2 className="text-3xl font-bold text-[#2d1e1e] mb-5">
                  Food
                </h2>

                <div className="flex flex-col gap-3">

                  {FOOD_CATEGORIES.map(cat => (

                    <button
                      key={cat}
                      onClick={() =>
                        setMainCategory(cat)
                      }
                      className={`text-left px-4 py-3 rounded-xl transition ${
                        mainCategory === cat
                          ? "bg-[#6b4f4f] text-white"
                          : "hover:bg-[#f3ece5]"
                      }`}
                    >
                      {cat}
                    </button>

                  ))}

                </div>

              </div>

            </div>

            {/* CONTENT */}
            <div>

              {/* BEST SELLER */}
              <div className="mb-16">

                <div className="mb-8">

                  <p className="uppercase tracking-[4px] text-[#c08b5c] text-sm font-semibold">
                    CUSTOMER FAVORITES
                  </p>

                  <h2 className="text-4xl font-black text-[#2d1e1e]">
                    Best Sellers ✨
                  </h2>

                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                  {products
                    .filter(product => product.bestSeller)
                    .slice(0, 3)
                    .map(product => (

                      <ProductCard
                        key={product._id}
                        product={product}
                        user={user}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        showToast={showToast}
                      />

                  ))}

                </div>

              </div>

              {/* PRODUCT LIST */}
              <div>

                <div className="flex items-center justify-between mb-8">

                  <h2 className="text-4xl font-bold text-[#2d1e1e]">

                    {mainCategory === "All"
                      ? "All Menu"
                      : mainCategory}

                  </h2>

                  <span className="text-gray-500">
                    {filteredProducts.length} items
                  </span>

                </div>

                {filteredProducts.length === 0 ? (

                  <div className="bg-white rounded-3xl p-20 text-center shadow-sm">

                    <h3 className="text-2xl font-bold text-[#6b4f4f] mb-3">
                      No items found
                    </h3>

                    <p className="text-gray-500">
                      Try another category.
                    </p>

                  </div>

                ) : (

                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {filteredProducts.map(product => (

                      <ProductCard
                        key={product._id}
                        product={product}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        showToast={showToast}
                      />

                    ))}

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}