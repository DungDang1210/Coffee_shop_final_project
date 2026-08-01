import { useEffect, useState } from "react";

export default function PromoBanner({
  user
}) {
  const banners = [
    {
      title:
        "20% OFF For New Members",
      subtitle:
        "Enjoy your first handcrafted drink",
      image:
        "/images/banner-coffee.jpg",
      color:
        "from-orange-500 to-red-500"
    },

    {
      title:
        "Buy 1 Get 1 Coffee",
      subtitle:
        "Every weekend from 6PM",
      image:
        "/images/banner-latte.jpg",
      color:
        "from-[#6b4f4f] to-[#c08b5c]"
    },

    {
      title:
        "Vietnamese Signature Collection",
      subtitle:
        "Traditional taste with modern style",
      image:
        "/images/banner-vietnam.jpg",
      color:
        "from-amber-500 to-yellow-500"
    }
  ];

  const [current, setCurrent] =
    useState(0);

  useEffect(() => {

    const timer = setInterval(() => {

      setCurrent(prev =>
        prev === banners.length - 1
          ? 0
          : prev + 1
      );

    }, 4000);

    return () =>
      clearInterval(timer);

  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-[40px] bg-gradient-to-r ${banners[current].color} text-white mb-16 shadow-2xl`}
    >

      <div className="grid lg:grid-cols-2 items-center">

        {/* LEFT */}
        <div className="p-10 lg:p-16 z-10">

          {user?.isNewUser && (
            <p className="uppercase tracking-[4px] text-sm mb-4 opacity-80">
              Welcome Reward 🎉
            </p>
          )}

          <h1 className="text-5xl font-black leading-tight mb-6">
            {banners[current].title}
          </h1>

          <p className="text-lg opacity-90 mb-8">
            {banners[current].subtitle}
          </p>

          <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition">
            Order Now
          </button>
        </div>

        {/* RIGHT */}
        <div className="h-[400px] overflow-hidden">

          <img
            src={banners[current].image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">

        {banners.map((_, index) => (

          <button
            key={index}
            onClick={() => 
              console.log("clicked", index) ||
              setCurrent(index)}
            className={`
              w-3 h-3
              rounded-full
              transition-all duration-300

              ${
                current === index
                  ? "bg-white w-8"
                  : "bg-white/40" 
              }
            `}
          />

        ))}

      </div>
    </div>
  );
}