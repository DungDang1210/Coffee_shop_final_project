import { useNavigate } from "react-router-dom";
import {
  Clock3,
  CheckCircle2,
  XCircle,
  Receipt,
  RotateCcw,
  Coffee
} from "lucide-react";

export default function OrderHistory({
  orders,
  cart,
  setCart,
  showToast
}) {
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Preparing":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={16} />;

      case "Preparing":
        return <Coffee size={16} />;

      case "Cancelled":
        return <XCircle size={16} />;

      default:
        return <Clock3 size={16} />;
    }
  };
  
  const orderStages = [
    "Pending",
    "Preparing",
    "Completed"
  ];

  const handleReorder = (order) => {
    let updatedCart = [...cart];

    order.items.forEach((orderItem) => {
      const existingIndex = updatedCart.findIndex(
        (cartItem) =>
          cartItem._id === orderItem._id &&
          cartItem.customization?.size === orderItem.customization?.size &&
          cartItem.customization?.sugar === orderItem.customization?.sugar &&
          cartItem.customization?.ice === orderItem.customization?.ice &&
          cartItem.customization?.milk === orderItem.customization?.milk
      );

      if (existingIndex !== -1) {
        updatedCart[existingIndex].qty += orderItem.qty;
      } else {
        updatedCart.push({ ...orderItem });
      }
    });

    setCart(updatedCart);

    showToast("Items added to cart!");

    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] py-10 px-6">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-[#6b4f4f] font-semibold hover:underline"
        >
          ← Back
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#2d1e1e] mb-2">
            Your Orders
          </h1>

          <p className="text-gray-500">
            Review your recent coffee purchases and track order progress.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-[#eee] p-16 text-center">
            <Receipt
              className="mx-auto mb-4 text-gray-300"
              size={52}
            />

            <h2 className="text-2xl font-bold mb-2">
              No Orders Yet
            </h2>

            <p className="text-gray-500">
              Once you place an order, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders
              .slice()
              .reverse()
              .map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow-sm border border-[#eee] overflow-hidden hover:shadow-md transition"
                >
                  {/* HEADER */}
                  <div className="bg-[#f8f3ef] px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <h2 className="font-bold text-lg text-[#2d1e1e]">
                        #{order.id}
                      </h2>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Date
                      </p>

                      <p className="font-medium">
                        {order.date}
                      </p>
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  <div className="px-8 pt-6">
                    <div className="flex items-center justify-between gap-2">
                      {orderStages.map((stage, index) => {
                        const currentIndex =
                          order.status === "Pending"
                          ? 0
                          : orderStages.indexOf(order.status);

                        const active = index <= currentIndex;

                        return (
                          <div
                            key={stage}
                            className="flex-1 flex items-center"
                          >
                            <div className="flex flex-col items-center w-full">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition ${
                                  active
                                    ? "bg-[#6b4f4f] text-white"
                                    : "bg-[#eee] text-gray-400"
                                }`}
                              >
                                {index + 1}
                              </div>

                              <span
                                className={`text-xs mt-2 font-medium ${
                                  active
                                    ? "text-[#6b4f4f]"
                                    : "text-gray-400"
                                }`}
                              >
                                {stage}
                              </span>
                            </div>

                            {index !== orderStages.length - 1 && (
                              <div
                                className={`h-1 flex-1 mx-2 rounded ${
                                  index < currentIndex
                                    ? "bg-[#6b4f4f]"
                                    : "bg-[#eee]"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div className="p-8 space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start border-b border-[#f2f2f2] pb-4"
                      >
                        <div>
                          <h3 className="font-semibold text-[#2d1e1e]">
                            {item.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Qty: {item.qty}
                          </p>

                          {item.customization && (
                            <p className="text-xs text-gray-400 mt-1">
                              {item.customization.size} •{" "}
                              {item.customization.sugar} Sugar •{" "}
                              {item.customization.ice} Ice •{" "}
                              {item.customization.milk}
                            </p>
                          )}
                        </div>

                        <span className="font-semibold text-[#6b4f4f]">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div className="px-8 py-5 bg-[#faf7f4] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <span className="text-gray-500 font-medium">
                      {order.items.length} item(s)
                    </span>

                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-[#6b4f4f]">
                        Total: ${order.total.toFixed(2)}
                      </span>

                      <button
                        onClick={() => handleReorder(order)}
                        className="flex items-center gap-2 bg-[#6b4f4f] text-white px-5 py-2 rounded-xl hover:bg-[#5a3f3f] transition"
                      >
                        <RotateCcw size={16} />
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}


      </div>
    </div>
    
  );
}