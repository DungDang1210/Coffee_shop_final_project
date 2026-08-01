import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function Success() {
  return (
    <div className="min-h-screen bg-[#fcfaf8] flex flex-col justify-center items-center px-6">

      {/* Progress Stepper */}
      <div className="flex items-center justify-center gap-4 mb-10 text-sm font-medium">
        <span className="text-gray-400">Cart</span>
        <span>→</span>
        <span className="text-gray-400">Checkout</span>
        <span>→</span>
        <span className="text-[#c08b5c] font-bold">Success</span>
      </div>

      {/* Success Card */}
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-xl w-full text-center border border-[#eee]">

        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center shadow-inner">
          <CheckCircle2
            size={58}
            className="text-green-500"
            strokeWidth={2}
          />
        </div>

        <h1 className="text-4xl font-bold text-[#2d1e1e] mb-4">
          Order Confirmed!
        </h1>

        <p className="text-gray-600 mb-2">
          Thank you for choosing Brew Haven.
        </p>

        <p className="text-gray-500 mb-8">
          Your handcrafted drinks are being prepared ☕
        </p>

        {/* Order Status Box */}
        <div className="bg-[#f8f3ef] rounded-2xl p-5 mb-8 text-left">
          <p className="text-sm text-gray-500 mb-2">
            Estimated Preparation Time
          </p>

          <p className="font-bold text-[#6b4f4f] text-lg">
            10 – 15 Minutes
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/orders"
            className="flex-1 bg-[#6b4f4f] text-white py-3 rounded-xl hover:bg-[#5a3f3f] transition"
          >
            View Orders
          </Link>

          <Link
            to="/menu"
            className="flex-1 border border-[#6b4f4f] text-[#6b4f4f] py-3 rounded-xl hover:bg-[#f8f3ef] transition"
          >
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
}