import {
  useParams,
  useNavigate,
  useLocation
} from "react-router-dom";

import { useState } from "react";

export default function ProductDetail({

    products,
    cart,
    setCart,

    favorites,
    setFavorites,

    user,
    showToast

}) {

  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const editItem = location.state?.editItem;

  const product = products.find(
    p => String(p._id) === String(id)
  );

  const formatPrice = price =>
    Number(price).toLocaleString("vi-VN") + " ₫";

  const finalPrice = () => {

    let price = Number(product.price);

    if(size === "Small"){
      price -= 5000;
    }

    if(size === "Large"){
      price += 8000;
    }

    return price;

  };

  /* =========================
     STATES
  ========================= */

  const [size, setSize] = useState(
    editItem?.customization?.size || "Medium"
  );

  const [sugar, setSugar] = useState(
    editItem?.customization?.sugar || "100%"
  );

  const [ice, setIce] = useState(
    editItem?.customization?.ice || "Normal"
  );

  const [milk, setMilk] = useState(
    editItem?.customization?.milk || "Regular"
  );

  const [qty, setQty] = useState(
    editItem?.qty || 1
  );

  if (!product) {
    return (
      <h1 className="p-10">
        Product not found
      </h1>
    );
  }

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = () => {

    if (!user) {
      showToast?.("Please login first");
      navigate("/login");
      return;

    }

    /* ===== EDIT EXISTING ITEM ===== */
    if (editItem) {

      setCart(
        cart.map((item) => {

          const isEditingTarget =
            String(item._id) === String(editItem._id) &&
            item.customization?.size ===
              editItem.customization?.size &&
            item.customization?.sugar ===
              editItem.customization?.sugar &&
            item.customization?.ice ===
              editItem.customization?.ice &&
            item.customization?.milk ===
              editItem.customization?.milk;

          if (isEditingTarget) {

            return {
              ...item,

              price: finalPrice(),

              qty,

              customization: {
                size,
                sugar,
                ice,
                milk
              }
            };

          }

          return item;

        })
      );

      navigate("/cart");

      return;
    }

    /* ===== NORMAL ADD ===== */
    const exist = cart.find(
      (item) =>
        String(item._id) === String(product._id) &&
        item.customization?.size === size &&
        item.customization?.sugar === sugar &&
        item.customization?.ice === ice &&
        item.customization?.milk === milk
    );

    if (exist) {

      setCart(
        cart.map((item) =>
          String(item._id) === String(product._id) &&
          item.customization?.size === size &&
          item.customization?.sugar === sugar &&
          item.customization?.ice === ice &&
          item.customization?.milk === milk
            ? {
                ...item,
                price: finalPrice(),
                qty: item.qty + qty
              }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...product,

          price: finalPrice(),

          // ===================
          // AI Recommendation
          // ===================

          taste: product.taste,
          temperature: product.temperature,
          milk: product.milk,
          caffeine: product.caffeine,
          intensity: product.intensity,

          qty,

          customization: {
            size,
            sugar,
            ice,
            milk
          }
        }
      ]);

    }

    navigate("/cart");

  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] py-12 px-6">

      <div className="max-w-6xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-[#6b4f4f] font-semibold hover:underline"
        >
          ← Back
        </button>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* IMAGE */}
          <div className="bg-white rounded-3xl p-4 shadow-sm">

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[550px] object-cover rounded-2xl"
            />

          </div>

          {/* INFO */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">

            {/* TOP */}
            <div className="flex items-center gap-3 mb-4">
              {product.bestSeller && (
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                  🔥 Best Seller
                </span>
              )}

              {product.signature && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  ⭐ Signature
                </span>
              )}

              {product.seasonal && (
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                  🌸 Seasonal
                </span>
              )}

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                In Stock
              </span>

              <span className="text-yellow-500 font-medium">
                ★ {product.rating || 4.8}
              </span>

              <span className="text-gray-500 text-sm">
                ({product.reviewCount || 124} Reviews)
              </span>

            </div>

            {/* NAME */}
            <h1 className="text-4xl font-bold mb-3">
              {product.name}
            </h1>

            {/* DESC */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* PRICE */}
            <h2 className="text-3xl font-bold text-[#6b4f4f] mb-8">
              {formatPrice(finalPrice())}
            </h2>
            <button
              onClick={() => {

              if(!user){
                showToast?.("Please login first");
                navigate("/login");
                return;
              }

              const existed = favorites.some(
                item => String(item._id) === String(product._id)
              );


              if(existed){

                setFavorites(
                  favorites.filter(
                    item => String(item._id)!==String(product._id)
                  )
                );

                showToast?.("Removed from favorites");

              }
              else{

                setFavorites([
                  ...favorites,
                  product
                ]);

                showToast?.("Added to favorites");

              }

              }}

              className="
              mb-6
              border
              border-[#6b4f4f]
              text-[#6b4f4f]
              px-4
              py-2
              rounded-xl
              hover:bg-[#6b4f4f]
              hover:text-white
              transition
              "
              >

              {
              favorites.some(
              item=>String(item._id)===String(product._id)
              )
              ? "♥ Remove Favorite"
              : "♡ Add Favorite"
              }

              </button>

            <div className="border-t pt-6 mt-6 space-y-2 text-sm">

                <div className="flex justify-between">
                  <span>Taste</span>
                  <span>{product.taste}</span>
                </div>

                <div className="flex justify-between">
                  <span>Temperature</span>
                  <span>{product.temperature}</span>
                </div>

                <div className="flex justify-between">
                  <span>Milk</span>
                  <span>{product.milk ? "Yes" : "No"}</span>
                </div>

                <div className="flex justify-between">
                  <span>Caffeine</span>
                  <span>{product.caffeine}</span>
                </div>

                <div className="flex justify-between">
                  <span>Intensity</span>
                  <span>{product.intensity}/5</span>
                </div>

              </div>

            {/* CUSTOMIZATION */}
            <div className="space-y-5">
              {/* SIZE */}
              <div>

                <label className="font-semibold block mb-2">
                  Size
                </label>

                <select
                  value={size}
                  onChange={(e) =>
                    setSize(e.target.value)
                  }
                  className="w-full border border-[#ddd] p-3 rounded-xl"
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>

              </div>

              {/* SUGAR */}
              <div>

                <label className="font-semibold block mb-2">
                  Sugar Level
                </label>

                <select
                  value={sugar}
                  onChange={(e) =>
                    setSugar(e.target.value)
                  }
                  className="w-full border border-[#ddd] p-3 rounded-xl"
                >
                  <option>0%</option>
                  <option>50%</option>
                  <option>100%</option>
                </select>

              </div>

              {/* ICE */}
              <div>

                <label className="font-semibold block mb-2">
                  Ice Level
                </label>

                <select
                  value={ice}
                  onChange={(e) =>
                    setIce(e.target.value)
                  }
                  className="w-full border border-[#ddd] p-3 rounded-xl"
                >
                  <option>No Ice</option>
                  <option>Less Ice</option>
                  <option>Normal</option>
                </select>

              </div>

              {/* MILK */}
              <div>

                <label className="font-semibold block mb-2">
                  Milk Type
                </label>

                <select
                  value={milk}
                  onChange={(e) =>
                    setMilk(e.target.value)
                  }
                  className="w-full border border-[#ddd] p-3 rounded-xl"
                >
                  <option>Regular</option>
                  <option>Oat Milk</option>
                  <option>Almond Milk</option>
                  <option>Soy Milk</option>
                </select>

              </div>

              {/* QUANTITY */}
              <div>

                <label className="font-semibold block mb-3">
                  Quantity
                </label>

                <div className="flex items-center gap-4">

                  <button
                    onClick={() =>
                      setQty(prev =>
                        prev > 1
                          ? prev - 1
                          : 1
                      )
                    }
                    className="w-12 h-12 rounded-xl bg-[#f3ece5] text-2xl font-bold hover:bg-[#e8ddd2] transition"
                  >
                    -
                  </button>

                  <span className="text-2xl font-bold min-w-[40px] text-center">
                    {qty}
                  </span>

                  <button
                    onClick={() =>
                      setQty(prev => prev + 1)
                    }
                    className="w-12 h-12 rounded-xl bg-[#6b4f4f] text-white text-2xl font-bold hover:bg-[#5a3f3f] transition"
                  >
                    +
                  </button>

                </div>

              </div>

            </div>

            {/* CTA */}
            <button
              onClick={addToCart}
              className="w-full mt-8 bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white py-4 rounded-xl font-semibold text-lg transition"
            >
              {editItem
                ? "Save Changes"
                : `Add ${qty} to Cart`}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}