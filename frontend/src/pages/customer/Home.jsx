import Navbar from "../../components/common/Navbar";
import ProductCard from "../../components/product/ProductCard";
import { Link } from "react-router-dom";
import PersonalizedAI from "../../components/ai/PersonalizedAI";
import PromoBanner from "../../components/home/PromoBanner";
import { useState } from "react";

export default function Home({
  products = [],
  cart = [],
  setCart,
  user,
  orders,
  setUser,
  favorites,
  setFavorites,
  showToast
}) {

  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
      title: "Crafted Coffee",
      subtitle: "For Every Mood"
    },
    {
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      title: "Vietnamese Coffee",
      subtitle: "Authentic & Traditional"
    },
    {
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
      title: "Freshly Brewed",
      subtitle: "Every Single Day"
    }
  ];

  const [currentSlide, setCurrentSlide] =
    useState(0);

  return (
    <>
      <Navbar
        cartCount={cart.length}
        user={user}
        setUser={setUser}
      />

      {/* HERO */}
      <PromoBanner user={user} />

      <section
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')"
        }}
      >

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

        <div className="relative text-center text-white z-10 px-6">

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Crafted Coffee <br /> For Every Mood
          </h1>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover handcrafted drinks, AI-powered recommendations,
            and the perfect cup tailored to your taste.
          </p>

          <Link
            to="/menu"
            className="inline-block bg-[#c08b5c] hover:bg-[#a87246] px-8 py-4 rounded-full font-semibold text-lg transition"
          >
            Order Now
          </Link>

        </div>

      </section>

      {/* PERSONALIZED AI */}
      <PersonalizedAI
        user={user}
        cart={cart}
        setCart={setCart}
        showToast={showToast}
      />

      {/* CATEGORIES */}
      <section className="bg-[#efe7de] py-16">

        <div className="max-w-7xl mx-auto px-10">

          <h2 className="text-3xl font-bold mb-8 text-center">
            Explore Our Categories
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {["Coffee", "Tea", "Dessert"].map(cat => (

              <div
                key={cat}
                className="bg-white rounded-2xl p-8 text-center shadow hover:shadow-lg transition"
              >

                <h3 className="text-2xl font-semibold mb-2">
                  {cat}
                </h3>

                <p className="text-gray-500">
                  Premium {cat.toLowerCase()} crafted daily
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* MAIN CONTENT */}
      <section className="bg-[#fcfaf8] py-16">

        <div className="max-w-7xl mx-auto px-10">

          {/* AI Recommendations */}
          <div className="bg-[#f8f3ef] rounded-3xl p-8 mb-14">

            <h2 className="text-2xl font-semibold mb-6">
              Recommended for you 🤖
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {products.slice(0, 3).map(product => (

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

          {/* PROMO */}
          <section className="mb-14">

            <div className="bg-[#6b4f4f] rounded-3xl p-10 text-white flex flex-col md:flex-row justify-between items-center">

              <div>

                <h2 className="text-3xl font-bold mb-2">
                  20% OFF First Order 🎉
                </h2>

                <p className="text-gray-200">
                  Sign up today and enjoy exclusive discounts.
                </p>

              </div>

              <Link
                to="/promotions"
                className="mt-4 md:mt-0 bg-[#c08b5c] px-6 py-3 rounded-full font-semibold hover:bg-[#a87246] transition"
              >
                Claim Offer
              </Link>

            </div>

          </section>

          {/* MENU CTA */}
          <section className="bg-white rounded-3xl p-8 shadow-sm text-center">

            <h2 className="text-3xl font-bold mb-4">
              Explore Our Full Menu
            </h2>

            <p className="text-gray-600 mb-6">
              Browse our complete handcrafted coffee and dessert collection.
            </p>

            <Link
              to="/menu"
              className="inline-block bg-[#6b4f4f] text-white px-8 py-3 rounded-full hover:bg-[#5a3f3f] transition"
            >
              View Full Menu
            </Link>

          </section>

        </div>

      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[#efe7de] py-20">

        <div className="max-w-7xl mx-auto px-10">

          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">

            <div className="bg-white rounded-2xl p-8 shadow">

              <h3 className="text-xl font-semibold mb-2">
                AI Recommendations
              </h3>

              <p className="text-gray-600">
                Personalized drink suggestions for every customer.
              </p>

            </div>

            <div className="bg-white rounded-2xl p-8 shadow">

              <h3 className="text-xl font-semibold mb-2">
                Premium Ingredients
              </h3>

              <p className="text-gray-600">
                Fresh beans and high quality ingredients.
              </p>

            </div>

            <div className="bg-white rounded-2xl p-8 shadow">

              <h3 className="text-xl font-semibold mb-2">
                Fast Delivery
              </h3>

              <p className="text-gray-600">
                Brewed fresh and delivered quickly.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-[#2d1e1e] text-white py-12">

        <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-3 gap-8">

          <div>

            <h3 className="text-2xl font-bold mb-3">
              Brew Haven ☕
            </h3>

            <p className="text-gray-300">
              Premium handcrafted coffee made for every mood.
            </p>

          </div>

          <div>

            <h4 className="font-semibold mb-3">
              Quick Links
            </h4>

            <div className="space-y-2 text-gray-300">

              <p>Home</p>
              <p>Menu</p>
              <p>Favorites</p>
              <p>Orders</p>

            </div>

          </div>

          <div>

            <h4 className="font-semibold mb-3">
              Contact
            </h4>

            <div className="space-y-2 text-gray-300">

              <p>📍 Ho Chi Minh City</p>
              <p>📞 +84 123 456 789</p>
              <p>✉️ support@brewhaven.com</p>

            </div>

          </div>

        </div>

        <p className="text-center text-gray-400 mt-10 text-sm">
          © 2026 Brew Haven. All rights reserved.
        </p>

      </footer>
    </>
  );
}
