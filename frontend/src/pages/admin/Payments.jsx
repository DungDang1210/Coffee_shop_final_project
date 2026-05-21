export default function Payments({
  orders,
  setOrders
}) {
  const updatePaymentStatus = (id, status) => {
    setOrders(
      orders.map(order =>
        order.id === id
          ? {
              ...order,
              paymentStatus: status
            }
          : order
      )
    );
  };

  const getColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Unpaid":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Payment Management
      </h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold">
                Order #{order.id}
              </h2>

              <p className="text-sm text-gray-500">
                ${order.total.toFixed(2)}
              </p>
            </div>

            <select
              value={order.paymentStatus}
              onChange={(e) =>
                updatePaymentStatus(
                  order.id,
                  e.target.value
                )
              }
              className={`px-3 py-2 rounded-lg font-semibold ${getColor(order.paymentStatus)}`}
            >
              <option>Paid</option>
              <option>Unpaid</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}