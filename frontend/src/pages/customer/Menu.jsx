import Navbar from "../../components/common/Navbar";
import ProductCard from "../../components/product/ProductCard";
import HeroSlider from "../../components/home/HeroSlider";
import { useSearchParams } from "react-router-dom";

import {
  DRINK_CATEGORIES as DRINK_CATS,
  FOOD_CATEGORIES
} from "../admin/menu/utils/menuConstants";

const VIETNAMESE = "⭐ Vietnamese Coffee";

// the Vietnamese filter is a subcategory, the rest
// are real categories
const DRINK_CATEGORIES = [
  VIETNAMESE,
  ...DRINK_CATS
];

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

  // The selected category lives in the URL, so
  // going into a product and pressing Back returns
  // you to the same list instead of resetting to
  // "All Menu".
  const [searchParams, setSearchParams] =
    useSearchParams();

  const mainCategory =
    searchParams.get("category") || "All";

  const setMainCategory = (category) => {

    const next = new URLSearchParams(searchParams);

    if (category === "All") {
      next.delete("category");
    } else {
      next.set("category", category);
    }

    // replace, not push: browsing categories should
    // not fill the history with entries you have to
    // click back through
    setSearchParams(next, { replace: true });

  };

  // =========================
  // FILTER
  // =========================

  const filteredProducts = products.filter(
    product =>
      mainCategory === "All" ||
      product.category === mainCategory
      || (mainCategory === VIETNAMESE && product.subcategory === "Vietnamese Coffee")
  );

  // Best sellers, rating cao nhất trước.
  // 6 món = 2 hàng grid gọn gàng. Trước là 3
  // (quá ít), rồi thử hiện hết 23 món dạng rail
  // cuộn ngang (làm vỡ ProductCard).
  const bestSellers = products
    .filter(p => p.bestSeller)
    .sort(
      (a, b) =>
        (Number(b.rating) || 0) -
        (Number(a.rating) || 0)
    )
    .slice(0, 6);

  // how many drinks sit behind each button, so an
  // empty category is obvious before you click it
  const countFor = (category) => {

    if (category === VIETNAMESE) {

      return products.filter(
        p => p.subcategory === "Vietnamese Coffee"
      ).length;

    }

    return products.filter(
      p => p.category === category
    ).length;

  };

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
                      className={`text-left px-4 py-3 rounded-xl transition flex justify-between items-center gap-2 ${
                        mainCategory === cat
                          ? "bg-[#6b4f4f] text-white"
                          : "hover:bg-[#f3ece5]"
                      }`}
                    >

                      <span>{cat}</span>

                      <span
                        className={
                          mainCategory === cat
                            ? "text-white/70 text-sm"
                            : "text-gray-400 text-sm"
                        }
                      >
                        {countFor(cat)}
                      </span>

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
                      className={`text-left px-4 py-3 rounded-xl transition flex justify-between items-center gap-2 ${
                        mainCategory === cat
                          ? "bg-[#6b4f4f] text-white"
                          : "hover:bg-[#f3ece5]"
                      }`}
                    >

                      <span>{cat}</span>

                      <span
                        className={
                          mainCategory === cat
                            ? "text-white/70 text-sm"
                            : "text-gray-400 text-sm"
                        }
                      >
                        {countFor(cat)}
                      </span>

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

                  <p className="text-gray-500 mt-1">
                    {bestSellers.length} most-loved drinks
                  </p>

                </div>

                {/* Grid, cùng kiểu với danh sách sản phẩm
                    bên dưới. Trước đây thử rail cuộn ngang
                    nhưng bọc ProductCard trong div min-w
                    cố định làm vỡ layout của card. */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                  {bestSellers.map(product => (

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