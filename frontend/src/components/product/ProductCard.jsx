import { Link, useNavigate } from "react-router-dom";
import { Star, Flame } from "lucide-react";

export default function ProductCard({
  product,
  favorites = [],
  setFavorites,
  showToast
}) {

  const navigate = useNavigate();

  const isFavorite = favorites.some(
    item => item._id === product._id
  );

  const rating =
    Number.isFinite(
      Number(product.rating)
    )
    ?
    Number(product.rating)
    :
    4.8;


  const reviewCount =
    Number.isFinite(
      Number(product.reviewCount)
    )
    ?
    Number(product.reviewCount)
    :
    124;

  const toggleFavorite = () => {

    if (!setFavorites) return;

    if (isFavorite) {

      setFavorites(
        favorites.filter(
          item => item._id !== product._id
        )
      );

      showToast?.(
        `${product.name} removed from favorites`
      );

    } else {

      setFavorites([
        ...favorites,
        product
      ]);

      showToast?.(
        `${product.name} added to favorites`
      );
    }
  };

  const getStockBadge = () => {

    switch (product.supplyStatus) {

      case "Low":
        return (
          <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">
            Low Stock
          </span>
        );

      case "Out":
        return (
          <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
            Out of Stock
          </span>
        );

      default:
        return (
          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
            In Stock
          </span>
        );
    }
  };

  return (

    <div className="relative bg-white rounded-3xl shadow-sm overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">

      {/* BEST SELLER */}
      {product.bestSeller && (
        <div className="absolute top-3 left-3 z-10 bg-[#c08b5c] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow">
          <Flame size={12} />
          Best Seller
        </div>
      )}

      {/* FAVORITE */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 text-xl bg-white/90 rounded-full p-2 shadow hover:scale-110 transition"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      {/* IMAGE */}
      <Link to={`/product/${product._id}`}>

        <div className="overflow-hidden">

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
          />

        </div>

      </Link>

      {/* CONTENT */}
      <div className="p-5">

        <div className="flex justify-between items-start mb-2">

          <Link to={`/product/${product._id}`}>

            <h3 className="font-bold text-xl hover:text-[#6b4f4f] transition">
              {product.name}
            </h3>

          </Link>

          {getStockBadge()}

        </div>

        {/* RATING */}
        <div className="flex items-center gap-1 mb-4">

          {[...Array(5)].map((_, i) => (

            <Star
              key={i}
              size={18}
              className={
                i < Math.round(rating) 
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />

          ))}

          <span className="text-sm text-gray-500 ml-2">
            ({reviewCount} reviews)
          </span>

        </div>


        {/* DESCRIPTION */}
        <p className="text-base text-gray-600 mb-5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* PRICE + BUTTON */}
        <div className="flex justify-between items-center">

          <span className="text-[#6b4f4f] font-bold text-2xl">
            {product.price.toLocaleString("vi-VN")} ₫
          </span>

          <button
            onClick={() =>
              navigate(`/product/${product._id}`)
            }
            disabled={
              product.supplyStatus === "Out"
            }
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              product.supplyStatus === "Out"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#6b4f4f] text-white hover:bg-[#5a3f3f]"
            }`}
          >
            {product.supplyStatus === "Out"
              ? "Unavailable"
              : "Add"}
          </button>

        </div>

      </div>

    </div>
  );
}