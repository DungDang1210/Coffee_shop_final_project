export default function Reports({ orders }) {
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const pendingOrders = orders.filter(
    order => order.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    order => order.status === "Completed"
  ).length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Reports Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Total Orders</h2>
          <p className="text-3xl font-bold mt-2">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Revenue</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Pending</h2>
          <p className="text-3xl font-bold mt-2 text-yellow-500">
            {pendingOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Completed</h2>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {completedOrders}
          </p>
        </div>
      </div>
    </div>
  );
}