import { Link } from "react-router-dom";

import {
  Heart,
  ShoppingCart,
  Trash2,
  Coffee
} from "lucide-react";

import Navbar from "../../components/common/Navbar";
import ProductCard from "../../components/product/ProductCard";

export default function Favorites({
  products = [],
  favorites = [],
  cart = [],
  setCart,
  user,
  setUser,
  setFavorites,
  showToast
}) {

  // resolve against the live catalogue so prices
  // and stock are current, and drop anything that
  // has since been removed from the menu
  const saved = favorites
    .map(item =>
      products.find(p => p._id === item._id)
    )
    .filter(Boolean);

  const formatPrice = (price) =>
    Math.round(Number(price) || 0)
      .toLocaleString("vi-VN") + " ₫";

  const totalValue = saved.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );

  const addAllToCart = () => {

    let next = [...cart];

    saved.forEach(product => {

      const exist = next.find(
        i => i._id === product._id
      );

      if (exist) {

        next = next.map(i =>
          i._id === product._id
            ? { ...i, qty: i.qty + 1 }
            : i
        );

      } else {

        next.push({
          ...product,
          qty: 1,
          customization: {
            size: "Medium",
            sugar: "100%",
            ice: "Normal",
            milk: "Regular"
          }
        });

      }

    });

    setCart(next);

    showToast?.(
      `${saved.length} drink${saved.length === 1 ? "" : "s"} added to cart`
    );

  };

  const clearAll = () => {

    if (
      !window.confirm(
        "Remove every drink from your favorites?"
      )
    ) return;

    setFavorites([]);

    showToast?.("Favorites cleared");

  };

  // suggestions so the page never looks bare
  const suggestions = products
    .filter(p =>
      p.bestSeller &&
      !saved.some(s => s._id === p._id)
    )
    .sort(
      (a, b) =>
        (Number(b.rating) || 0) -
        (Number(a.rating) || 0)
    )
    .slice(0, 3);

  return (
    <>
      <Navbar
        cartCount={cart.length}
        user={user}
        setUser={setUser}
      />

      <div className="min-h-screen bg-[#fcfaf8] py-12 px-6">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-wrap items-end justify-between gap-5 mb-10">

            <div>

              <p className="uppercase tracking-[4px] text-[#c08b5c] text-sm font-semibold mb-2">
                Your collection
              </p>

              <h1 className="text-4xl font-black text-[#2d1e1e] flex items-center gap-3">

                Favorite Drinks

                <Heart
                  size={30}
                  className="fill-red-500 text-red-500"
                />

              </h1>

              {saved.length > 0 && (

                <p className="text-gray-500 mt-2">
                  {saved.length} saved ·{" "}
                  {formatPrice(totalValue)} if you
                  ordered one of each
                </p>

              )}

            </div>

            {saved.length > 0 && (

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={addAllToCart}
                  className="flex items-center gap-2 bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white px-6 py-3 rounded-xl font-semibold transition"
                >

                  <ShoppingCart size={18} />

                  Add all to cart

                </button>

                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 border border-[#ddd] text-gray-600 px-5 py-3 rounded-xl font-semibold hover:border-red-400 hover:text-red-600 transition"
                >

                  <Trash2 size={17} />

                  Clear

                </button>

              </div>

            )}

          </div>

          {/* EMPTY STATE */}
          {saved.length === 0 ? (

            <div className="bg-white rounded-[32px] shadow-sm border border-[#eee] p-12 sm:p-16 text-center">

              <div className="w-20 h-20 rounded-full bg-[#f3e8dd] flex items-center justify-center mx-auto mb-6">

                <Heart
                  size={34}
                  className="text-[#c08b5c]"
                />

              </div>

              <h2 className="text-2xl font-bold text-[#2d1e1e] mb-3">
                No favorites yet
              </h2>

              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Tap the heart on any drink to save it
                here. Handy for the one you order every
                morning.
              </p>

              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white px-8 py-4 rounded-full font-semibold transition"
              >

                <Coffee size={18} />

                Browse the menu

              </Link>

              {/* popular picks to get started */}
              {suggestions.length > 0 && (

                <div className="mt-12 pt-10 border-t border-[#f0e8e0]">

                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                    Popular with other customers
                  </p>

                  <div className="grid sm:grid-cols-3 gap-6 text-left">

                    {suggestions.map(product => (

                      <ProductCard
                        key={product._id}
                        product={product}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        showToast={showToast}
                      />

                    ))}

                  </div>

                </div>

              )}

            </div>

          ) : (

            <>

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">

                {saved.map(product => (

                  <ProductCard
                    key={product._id}
                    product={product}
                    cart={cart}
                    setCart={setCart}
                    favorites={favorites}
                    setFavorites={setFavorites}
                    showToast={showToast}
                  />

                ))}

              </div>

              {/* MORE LIKE THESE */}
              {suggestions.length > 0 && (

                <div className="mt-16">

                  <h2 className="text-2xl font-bold text-[#2d1e1e] mb-2">
                    You might also like
                  </h2>

                  <p className="text-gray-500 mb-6">
                    Best sellers you haven’t saved yet.
                  </p>

                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">

                    {suggestions.map(product => (

                      <ProductCard
                        key={product._id}
                        product={product}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        showToast={showToast}
                      />

                    ))}

                  </div>

                </div>

              )}

            </>

          )}

        </div>

      </div>
    </>
  );
}
