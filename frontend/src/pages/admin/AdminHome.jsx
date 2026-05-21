import {
  ShoppingBag,
  DollarSign,
  Coffee,
  Clock3,
  TrendingUp,
  Star
} from "lucide-react";

export default function AdminHome({ orders = [] }) {
  const totalRevenue = orders.reduce(
    (sum, order) =>
      order.status === "Completed"
        ? sum + order.total
        : sum,
    0
  );

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const preparingOrders = orders.filter(
    (o) => o.status === "Preparing"
  ).length;

  const completedOrders = orders.filter(
    (o) => o.status === "Completed"
  ).length;

  const allItems = orders.flatMap((order) => order.items);

  const productCount = {};

  allItems.forEach((item) => {
    productCount[item.name] =
      (productCount[item.name] || 0) + item.qty;
  });

  const topProduct =
    Object.entries(productCount).sort(
      (a, b) => b[1] - a[1]
    )[0];

  return (
    <div>
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#2d1e1e] mb-2">
          Dashboard Overview
        </h1>

        <p className="text-gray-500">
          Monitor your coffee shop performance in real-time.
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <DashboardCard
          title="Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={<DollarSign />}
          color="green"
        />

        <DashboardCard
          title="Pending"
          value={pendingOrders}
          icon={<Clock3 />}
          color="yellow"
        />

        <DashboardCard
          title="Preparing"
          value={preparingOrders}
          icon={<Coffee />}
          color="blue"
        />

        <DashboardCard
          title="Completed"
          value={completedOrders}
          icon={<ShoppingBag />}
          color="purple"
        />
      </div>

      {/* INSIGHTS */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* TOP PRODUCT */}
        <div className="bg-gradient-to-br from-[#6b4f4f] to-[#4e3636] text-white rounded-3xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Star className="text-yellow-300" />
            <h2 className="text-xl font-bold">
              Best Selling Product
            </h2>
          </div>

          {topProduct ? (
            <>
              <h3 className="text-3xl font-bold mb-2">
                {topProduct[0]}
              </h3>

              <p className="text-[#e8dede]">
                Sold {topProduct[1]} cups/orders
              </p>
            </>
          ) : (
            <p className="text-[#ddd]">
              No sales data yet.
            </p>
          )}
        </div>

        {/* PERFORMANCE */}
        <div className="bg-white rounded-3xl p-8 border border-[#eee] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-green-500" />
            <h2 className="text-xl font-bold text-[#2d1e1e]">
              Performance Summary
            </h2>
          </div>

          <div className="space-y-4 text-sm">
            <SummaryRow
              label="Total Orders"
              value={orders.length}
            />

            <SummaryRow
              label="Completion Rate"
              value={
                orders.length
                  ? `${Math.round(
                      (completedOrders / orders.length) * 100
                    )}%`
                  : "0%"
              }
            />

            <SummaryRow
              label="Avg Revenue / Order"
              value={
                orders.length
                  ? `$${(
                      totalRevenue / completedOrders || 0
                    ).toFixed(2)}`
                  : "$0"
              }
            />
          </div>
        </div>

      </div>

      {/* RECENT ORDERS */}
      <div className="mt-10 bg-white rounded-3xl p-8 border border-[#eee] shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-[#2d1e1e]">
          Recent Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">
            No recent orders available.
          </p>
        ) : (
          <div className="space-y-4">
            {orders
              .slice()
              .reverse()
              .slice(0, 5)
              .map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center border-b border-[#f2f2f2] pb-4"
                >
                  <div>
                    <h4 className="font-semibold">
                      Order #{order.id}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {order.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-[#6b4f4f]">
                      ${order.total.toFixed(2)}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  color
}) {
  const colors = {
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600"
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eee] hover:shadow-md transition">
      <div className="flex justify-between items-center mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
      </div>

      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold text-[#2d1e1e] mt-2">
        {value}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-bold text-[#2d1e1e]">
        {value}
      </span>
    </div>
  );
}