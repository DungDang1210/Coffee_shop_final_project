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

  // NEXT
  const nextSlide = () => {

    setCurrent(prev =>
      prev === signatureProducts.length - 1
        ? 0
        : prev + 1
    );

  };

  // PREV
  const prevSlide = () => {

    setCurrent(prev =>
      prev === 0
        ? signatureProducts.length - 1
        : prev - 1
    );

  };

  return (

    <section className="bg-[#f6f1eb] overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">

        <div className="grid lg:grid-cols-2 items-center gap-10">

          {/* LEFT */}
          <div>

            <p className="uppercase tracking-[4px] text-[#c08b5c] text-sm font-semibold mb-4">
              SIGNATURE DRINK
            </p>

            <h1 className="text-5xl lg:text-6xl font-black text-[#2d1e1e] mb-6">
              {currentProduct.name}
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {currentProduct.description}
            </p>

            <div className="flex items-center gap-6">

              <span className="text-4xl font-black text-[#6b4f4f]">
                ${currentProduct.price}
              </span>

              <button
                onClick={() =>
                  navigate(`/product/${currentProduct._id}`)
                }
                className="bg-[#6b4f4f] hover:bg-[#5a3f3f]
                text-white px-8 py-4 rounded-full
                font-bold transition"
              >
                Add to Cart
              </button>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-10">

              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-white shadow"
              >
                ←
              </button>

              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-white shadow"
              >
                →
              </button>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex justify-center">

            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="w-[420px] h-[420px] object-contain drop-shadow-2xl"
            />

          </div>

        </div>

      </div>

    </section>

  );
}