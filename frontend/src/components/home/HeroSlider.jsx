import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSlider({
  products = [],
}) {
  const navigate = useNavigate();

  const signatureProducts = products.filter(
    product => product.signature
  );

  const [current, setCurrent] = useState(0);

  // FIX CRASH
  if (signatureProducts.length === 0) {
    return null;
  }

  const currentProduct =
    signatureProducts[current] || {};

  // AUTO SLIDE
  useEffect(() => {

    const interval = setInterval(() => {

      setCurrent(prev =>
        prev === signatureProducts.length - 1
          ? 0
          : prev + 1
      );

    }, 4000);

    return () => clearInterval(interval);

  }, [signatureProducts.length]);

  return (
    <section className="bg-gradient-to-br from-[#f8f3ef] to-[#efe7de] overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">

        <div className="grid lg:grid-cols-2 items-center gap-12">

          {/* LEFT CONTENT */}
          <div>

            <span className="inline-block bg-[#c08b5c]/20 text-[#6b4f4f] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              ☕ Signature Collection
            </span>

            <h1 className="text-5xl lg:text-7xl font-black text-[#2d1e1e] leading-tight mb-6">
              {currentProduct.name}
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl mb-8">
              {currentProduct.description}
            </p>

            <div className="flex items-center gap-8 mb-10">

              <span className="text-5xl font-black text-[#6b4f4f]">
                {currentProduct.price.toLocaleString("vi-VN")} ₫
              </span>

              <button
                onClick={() =>
                  navigate(`/product/${currentProduct._id}`)
                }
                className="
                  bg-[#6b4f4f]
                  hover:bg-[#523838]
                  text-white
                  px-8 py-4
                  rounded-full
                  font-bold
                  transition
                  hover:scale-105
                "
              >
                View Product
              </button>

            </div>

            {/* DOTS */}
            <div className="flex gap-3">

              {signatureProducts.map((_, index) => (

                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`
                    h-3 rounded-full transition-all duration-300

                    ${
                      current === index
                        ? "bg-[#6b4f4f] w-10"
                        : "bg-[#cdbfb3] w-3"
                    }
                  `}
                />

              ))}

            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">

            <div
              className="
                relative
                w-[500px]
                h-[500px]
                rounded-full
                bg-white
                shadow-2xl
                flex
                items-center
                justify-center
              "
            >

              <img
                key={currentProduct._id}
                src={currentProduct.image}
                alt={currentProduct.name}
                className="
                  w-[420px]
                  h-[420px]
                  object-contain
                  drop-shadow-2xl
                  animate-fadeSlide
                "
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}