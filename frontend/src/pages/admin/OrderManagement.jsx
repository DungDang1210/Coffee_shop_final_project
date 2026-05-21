import {
  Clock3,
  CheckCircle2,
  XCircle,
  Coffee
} from "lucide-react";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function OrderManagement({
  orders,
  setOrders
}) {
  const updateStatus = (id, newStatus) => {
    setOrders(
      orders.map(order =>
        order.id === id
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Preparing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={16} />;
      case "Cancelled":
        return <XCircle size={16} />;
      case "Preparing":
        return <Coffee size={16} />;
      default:
        return <Clock3 size={16} />;
    }
  };

  const { markOrdersViewed } = useOutletContext();

  return (
    <div className="min-h-screen bg-[#f8f5f2] p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#2d1e1e]">
            Order Management
          </h1>

          <p className="text-gray-500 mt-2">
            Track and manage incoming customer orders.
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-[#eee] p-16 text-center">
            <Coffee
              size={48}
              className="mx-auto text-gray-300 mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-500">
              Incoming customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders
              .slice()
              .reverse()
              .map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow-sm border border-[#eee] overflow-hidden hover:shadow-md transition"
                >
                  {/* Header */}
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

                  {/* Items */}
                  <div className="p-8 space-y-4">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between border-b border-[#f2f2f2] pb-4"
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

                  {/* Footer */}
                  <div className="px-8 py-5 bg-[#faf7f4] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value)
                      }
                      className="border border-[#ddd] px-4 py-3 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#c08b5c]"
                    >
                      <option>Pending</option>
                      <option>Preparing</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>

                    <span className="text-xl font-bold text-[#6b4f4f]">
                      Total: ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}

      </div>
    </div>
  );
}