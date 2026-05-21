import { Link, useNavigate } from "react-router-dom";

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const updateQty = (targetItem, type) => {
    setCart(
      cart
        .map((item) => {
          const isSameItem =
            item._id === targetItem._id &&
            item.customization?.size === targetItem.customization?.size &&
            item.customization?.sugar === targetItem.customization?.sugar &&
            item.customization?.ice === targetItem.customization?.ice &&
            item.customization?.milk === targetItem.customization?.milk;

          if (isSameItem) {
            return {
              ...item,
              qty: type === "inc" ? item.qty + 1 : item.qty - 1,
            };
          }

          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-[#fcfaf8] py-12 px-6">
      <div className="flex items-center justify-center gap-4 mb-10 text-sm font-medium">
        <span className="text-[#c08b5c] font-bold">
          Cart
        </span>
        <span>→</span>
        <span className="text-gray-400">
          Checkout
        </span>
        <span>→</span>
        <span className="text-gray-400">
          Success
        </span>
      </div>
      <div className="max-w-7xl mx-auto">

        <button
          onClick={() => navigate("/menu")}
          className="mb-8 text-[#6b4f4f] font-semibold hover:underline"
        >
          ← Continue Ordering
        </button>

        <h1 className="text-4xl font-bold mb-10">
          Your Cart 🛒
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mb-6">
              Add your favorite drinks and desserts to get started.
            </p>

            <Link
              to="/menu"
              className="inline-block bg-[#6b4f4f] text-white px-6 py-3 rounded-xl hover:bg-[#5a3f3f] transition"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">

            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-5">

              {cart.map((item, index) => (
                <Link
                  key={index}
                  to={`/product/${item._id}`}
                  state={{ editItem: item }}
                  className="bg-white rounded-3xl shadow-sm p-5 flex gap-5 hover:shadow-md transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-2xl"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-bold">
                      {item.name}
                    </h3>

                    <p className="text-[#6b4f4f] font-semibold mb-3">
                      ${item.price}
                    </p>

                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="bg-[#f3ede8] px-3 py-1 rounded-full">
                        {item.customization?.size || "Medium"}
                      </span>
                      <span className="bg-[#f3ede8] px-3 py-1 rounded-full">
                        {item.customization?.sugar || "100%"} Sugar
                      </span>
                      <span className="bg-[#f3ede8] px-3 py-1 rounded-full">
                        {item.customization?.ice || "Normal"}
                      </span>
                      <span className="bg-[#f3ede8] px-3 py-1 rounded-full">
                        {item.customization?.milk || "Regular"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          updateQty(item, "dec");
                        }}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        −
                      </button>

                      <span className="font-semibold text-lg">
                        {item.qty}
                      </span>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          updateQty(item, "inc");
                        }}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-lg font-bold text-[#6b4f4f]">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                </Link>
              ))}

            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white rounded-3xl shadow-sm p-8 h-fit sticky top-28">
              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>$2.00</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>

                <hr />

                <div className="flex justify-between text-xl font-bold text-black">
                  <span>Total</span>
                  <span>
                    ${(total + 2 + total * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block text-center mt-8 bg-[#6b4f4f] text-white py-4 rounded-xl font-semibold hover:bg-[#5a3f3f] transition"
              >
                Proceed to Checkout
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}