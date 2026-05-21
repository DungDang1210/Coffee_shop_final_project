import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Checkout({
  cart,
  setCart,
  orders,
  setOrders,
  user
}) {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "Cash"
  });

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  const deliveryFee = 2.5;

  const voucher =
    user?.vouchers?.find(v => !v.used);

  const discount = voucher
    ? (subtotal * voucher.discount) /
      100
    : 0;

  const discountedSubtotal =
    subtotal - discount;

  const tax = discountedSubtotal * 0.08;

  const grandTotal =
    discountedSubtotal +
    deliveryFee +
    tax;

  /* =========================
     PLACE ORDER
  ========================= */
  const handlePlaceOrder = async () => {
    if (
      !customer.name ||
      !customer.email ||
      !customer.phone
    ) {
      alert("Please fill all customer information.");
      return;
    }

    const newOrder = {
      id: Date.now(),

      userId: user?._id || "guest",

      items: cart,

      subtotal: subtotal,

      discount,

      voucherCode:
        voucher?.code || null,

      deliveryFee,

      tax,

      total: grandTotal,

      status: "Pending",

      paymentStatus:
        customer.paymentMethod === "Cash"
          ? "Unpaid"
          : "Paid",

      paymentMethod: customer.paymentMethod,

      customer,

      date: new Date().toLocaleString()
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(newOrder)
        }
      );

      const savedOrder = await response.json();

      setOrders((prev) => [
        ...prev,
        savedOrder
      ]);

      setCart([]);

      if (voucher) {

        const updatedUser = {
          ...user,

          isNewUser: false,

          vouchers:
            user.vouchers.map(v =>
              v.code === voucher.code
                ? {
                    ...v,
                    used: true
                  }
                : v
            )
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      }

      navigate("/success");

    } catch (err) {
      console.log("Order Error:", err);

      alert("Failed to place order.");
    }
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-10 text-sm font-medium">
          <span className="text-gray-400">
            Cart
          </span>

          <span>→</span>

          <span className="text-[#c08b5c] font-bold">
            Checkout
          </span>

          <span>→</span>

          <span className="text-gray-400">
            Success
          </span>
        </div>

        <button
          onClick={() => navigate("/cart")}
          className="mb-8 text-[#6b4f4f] font-semibold hover:underline"
        >
          ← Back to Cart
        </button>

        <h1 className="text-4xl font-bold mb-10">
          Secure Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT FORM */}
          <div className="lg:col-span-2 space-y-8">

            {/* Customer Info */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                Customer Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      name: e.target.value
                    })
                  }
                  className="border p-4 rounded-xl focus:ring-2 focus:ring-[#c08b5c] outline-none"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      email: e.target.value
                    })
                  }
                  className="border p-4 rounded-xl focus:ring-2 focus:ring-[#c08b5c] outline-none"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      phone: e.target.value
                    })
                  }
                  className="border p-4 rounded-xl md:col-span-2 focus:ring-2 focus:ring-[#c08b5c] outline-none"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                Payment Method
              </h2>

              <div className="grid md:grid-cols-3 gap-4">

                {["Cash", "Card", "E-Wallet"].map(method => (
                  <button
                    key={method}
                    onClick={() =>
                      setCustomer({
                        ...customer,
                        paymentMethod: method
                      })
                    }
                    className={`p-4 rounded-2xl border font-medium transition ${
                      customer.paymentMethod === method
                        ? "border-[#6b4f4f] bg-[#f8f3ef]"
                        : "border-gray-200 hover:border-[#c08b5c]"
                    }`}
                  >
                    {method}
                  </button>
                ))}

              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-white rounded-3xl shadow-sm p-8 h-fit sticky top-24">

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">

              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>

                  <span>
                    $
                    {(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}

            </div>

            <hr className="my-4" />

            <div className="space-y-3 text-sm mb-6">

              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {voucher && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>
                    {voucher.code}
                  </span>

                  <span>
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee</span>

                <span>
                  ${deliveryFee.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>

                <span>
                  ${tax.toFixed(2)}
                </span>
              </div>

            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-xl mb-6">

              <span>Total</span>

              <span className="text-[#6b4f4f]">
                ${grandTotal.toFixed(2)}
              </span>

            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white py-4 rounded-2xl font-semibold text-lg transition hover:scale-[1.02]"
            >
              Place Order
            </button>

            <p className="text-xs text-gray-400 mt-4 text-center">
              By placing order you agree to our Terms.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}