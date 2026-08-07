import { useMemo, useState } from "react";

import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Coffee,
  XCircle,
  Receipt
} from "lucide-react";

import RevenueChart from "./reports/RevenueChart";
import TopProductsChart from "./reports/TopProductsChart";


const RANGES = [
  { key: "7", label: "Last 7 days", days: 7 },
  { key: "30", label: "Last 30 days", days: 30 },
  { key: "all", label: "All time", days: null }
];


export default function Reports({
  orders = []
}) {

  const [range, setRange] = useState("30");

  // round first: an average like 133247.647 was
  // rendering as "133.247,647 ₫"
  const formatPrice = (price) =>
    Math.round(Number(price) || 0)
      .toLocaleString("vi-VN") + " ₫";

  const activeRange =
    RANGES.find(r => r.key === range) || RANGES[1];

  // Cancelled orders are excluded from revenue —
  // counting them inflated the numbers.
  const paidOrders = useMemo(
    () => orders.filter(
      o => o.status !== "Cancelled"
    ),
    [orders]
  );

  const orderDate = (o) =>
    new Date(o.createdAt || o.date || 0);

  // =====================
  // RANGE WINDOW
  // =====================
  const { current, previous } = useMemo(() => {

    if (!activeRange.days) {
      return { current: paidOrders, previous: [] };
    }

    const now = Date.now();

    const span =
      activeRange.days * 24 * 60 * 60 * 1000;

    const from = now - span;

    const prevFrom = from - span;

    return {

      current: paidOrders.filter(o => {
        const t = orderDate(o).getTime();
        return t >= from && t <= now;
      }),

      previous: paidOrders.filter(o => {
        const t = orderDate(o).getTime();
        return t >= prevFrom && t < from;
      })

    };

  }, [paidOrders, activeRange]);

  const revenueOf = (list) =>
    list.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );

  const totalRevenue = revenueOf(current);

  const prevRevenue = revenueOf(previous);

  // growth vs the equivalent previous window
  const growth =
    prevRevenue > 0
      ? ((totalRevenue - prevRevenue) / prevRevenue) * 100
      : null;

  const avgOrderValue =
    current.length
      ? totalRevenue / current.length
      : 0;

  const cancelledCount = orders.filter(
    o => o.status === "Cancelled"
  ).length;

  const pendingOrders = orders.filter(
    o => o.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    o => o.status === "Completed"
  ).length;

  // =====================
  // DAILY SERIES
  // =====================
  const series = useMemo(() => {

    const buckets = new Map();

    current.forEach(o => {

      const d = orderDate(o);

      if (Number.isNaN(d.getTime())) return;

      const key = d.toISOString().slice(0, 10);

      const row =
        buckets.get(key) ||
        { revenue: 0, orders: 0 };

      row.revenue += Number(o.total || 0);

      row.orders += 1;

      buckets.set(key, row);

    });

    return [...buckets.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, row]) => ({
        key,
        label: key.slice(5).replace("-", "/"),
        revenue: row.revenue,
        orders: row.orders
      }));

  }, [current]);

  // =====================
  // TOP PRODUCTS
  // =====================
  const topProducts = useMemo(() => {

    const map = {};

    current.forEach(order => {

      (order.items || []).forEach(item => {

        const name = item.name || "Unknown";

        if (!map[name]) {
          map[name] = { quantity: 0, revenue: 0 };
        }

        const qty =
          Number(item.quantity ?? item.qty) || 1;

        map[name].quantity += qty;

        map[name].revenue +=
          qty * Number(item.price || 0);

      });

    });

    return Object.entries(map)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);

  }, [current]);

  // =====================
  // BUSIEST HOURS
  // =====================
  const byHour = useMemo(() => {

    const hours = Array(24).fill(0);

    current.forEach(o => {

      const d = orderDate(o);

      if (!Number.isNaN(d.getTime())) {
        hours[d.getHours()] += 1;
      }

    });

    const max = Math.max(...hours, 1);

    return { hours, max };

  }, [current]);

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>

          <h1 className="text-4xl font-bold text-[#2d1e1e]">
            Reports Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            How the shop is growing. Cancelled orders
            are excluded from revenue.
          </p>

        </div>

        {/* RANGE */}
        <div className="flex flex-wrap gap-2">

          {RANGES.map(r => (

            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                range === r.key
                  ? "bg-[#2d1e1e] text-white"
                  : "bg-white border border-[#ddd] text-gray-600 hover:border-[#6b4f4f]"
              }`}
            >
              {r.label}
            </button>

          ))}

        </div>

      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <Card
          icon={<DollarSign />}
          title={`Revenue — ${activeRange.label.toLowerCase()}`}
          value={formatPrice(totalRevenue)}
          color="bg-green-100 text-green-600"
          delta={growth}
        />

        <Card
          icon={<ShoppingBag />}
          title="Orders in range"
          value={current.length}
          color="bg-blue-100 text-blue-600"
        />

        <Card
          icon={<Receipt />}
          title="Average order value"
          value={formatPrice(avgOrderValue)}
          color="bg-amber-100 text-amber-600"
        />

        <Card
          icon={<CheckCircle />}
          title="Completed / Pending"
          value={`${completedOrders} / ${pendingOrders}`}
          color="bg-purple-100 text-purple-600"
        />

      </div>

      {/* REVENUE TREND */}
      <div className="bg-white rounded-3xl shadow-sm border p-8">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

          <div className="flex items-center gap-3">

            <div className="p-3 rounded-xl bg-[#f5eee8] text-[#6b4f4f]">
              <TrendingUp />
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Revenue trend
              </h2>

              <p className="text-sm text-gray-500">
                Daily takings and order volume
              </p>

            </div>

          </div>

          {growth !== null && (

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                growth >= 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >

              {
                growth >= 0
                  ? <TrendingUp size={16} />
                  : <TrendingDown size={16} />
              }

              {growth >= 0 ? "+" : ""}
              {growth.toFixed(1)}% vs previous{" "}
              {activeRange.days} days

            </div>

          )}

        </div>

        <RevenueChart series={series} />

      </div>

      <div className="grid xl:grid-cols-2 gap-6">

        {/* TOP PRODUCTS */}
        <div className="bg-white rounded-3xl shadow-sm border p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 rounded-xl bg-[#f5eee8] text-[#6b4f4f]">
              <Coffee />
            </div>

            <h2 className="text-xl font-bold">
              Best sellers
            </h2>

          </div>

          <TopProductsChart
            data={topProducts}
            formatPrice={formatPrice}
          />

        </div>

        {/* BUSIEST HOURS */}
        <div className="bg-white rounded-3xl shadow-sm border p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 rounded-xl bg-[#f5eee8] text-[#6b4f4f]">
              <Clock />
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Busiest hours
              </h2>

              <p className="text-sm text-gray-500">
                When to have more staff on
              </p>

            </div>

          </div>

          <div className="flex items-end gap-[3px] h-40">

            {byHour.hours.map((n, hour) => (

              <div
                key={hour}
                className="flex-1 flex flex-col items-center justify-end h-full group"
                title={`${hour}:00 — ${n} order${n === 1 ? "" : "s"}`}
              >

                <div
                  className={`w-full rounded-t transition-all ${
                    n > 0
                      ? "bg-[#c08b5c] group-hover:bg-[#6b4f4f]"
                      : "bg-[#f3ece5]"
                  }`}
                  style={{
                    height: `${Math.max(
                      2,
                      (n / byHour.max) * 100
                    )}%`
                  }}
                />

              </div>

            ))}

          </div>

          <div className="flex justify-between text-xs text-gray-400 mt-2">

            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>23h</span>

          </div>

        </div>

      </div>

      {/* CANCELLATIONS */}
      {cancelledCount > 0 && (

        <div className="bg-white rounded-3xl shadow-sm border p-6 flex items-center gap-4">

          <div className="p-3 rounded-xl bg-red-50 text-red-600">
            <XCircle />
          </div>

          <div>

            <p className="font-semibold text-[#2d1e1e]">
              {cancelledCount} cancelled order
              {cancelledCount === 1 ? "" : "s"} all time
            </p>

            <p className="text-sm text-gray-500">
              Not counted in any revenue figure above.
            </p>

          </div>

        </div>

      )}

    </div>

  );

}


function Card({
  icon,
  title,
  value,
  color,
  delta
}) {

  return (

    <div className="bg-white rounded-3xl shadow-sm border p-6">

      <div className="flex justify-between items-start">

        <div className={`p-4 rounded-2xl ${color}`}>
          {icon}
        </div>

        {typeof delta === "number" && (

          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              delta >= 0
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >

            {
              delta >= 0
                ? <TrendingUp size={12} />
                : <TrendingDown size={12} />
            }

            {delta >= 0 ? "+" : ""}
            {delta.toFixed(0)}%

          </span>

        )}

      </div>

      <p className="text-gray-500 mt-5 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2 text-[#2d1e1e]">
        {value}
      </h2>

    </div>

  );

}
