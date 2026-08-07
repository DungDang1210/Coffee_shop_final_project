import { useMemo } from "react";

import { Link, useOutletContext } from "react-router-dom";

import {
  ShoppingBag,
  DollarSign,
  Coffee,
  Clock3,
  TrendingUp,
  TrendingDown,
  Star,
  CheckCircle,
  Truck,
  XCircle,
  ArrowRight,
  Receipt,
  Package,
  Bell
} from "lucide-react";


const money = (v) =>
  Math.round(Number(v) || 0)
    .toLocaleString("vi-VN") + " ₫";

const dayKey = (d) =>
  new Date(d).toISOString().slice(0, 10);

// createdAt is the real field. The old dashboard read
// order.date, which the Order schema strips, so
// "today's revenue" was permanently 0.
const orderTime = (o) =>
  new Date(o.createdAt || o.date || 0);


export default function AdminHome({
  orders = []
}) {

  const { newOrderCount = 0 } =
    useOutletContext() || {};

  // Cancelled orders are not income
  const paid = useMemo(
    () => orders.filter(
      o => o.status !== "Cancelled"
    ),
    [orders]
  );

  const stats = useMemo(() => {

    const now = new Date();

    const todayK = dayKey(now);

    const yesterdayK = dayKey(
      new Date(now.getTime() - 86400000)
    );

    const revenueOn = (key) =>
      paid
        .filter(o => {

          const t = orderTime(o);

          return (
            !Number.isNaN(t.getTime()) &&
            dayKey(t) === key
          );

        })
        .reduce(
          (s, o) => s + Number(o.total || 0),
          0
        );

    const todayOrders = paid.filter(o => {

      const t = orderTime(o);

      return (
        !Number.isNaN(t.getTime()) &&
        dayKey(t) === todayK
      );

    });

    const today = revenueOn(todayK);

    const yesterday = revenueOn(yesterdayK);

    const change =
      yesterday > 0
        ? ((today - yesterday) / yesterday) * 100
        : null;

    const total = paid.reduce(
      (s, o) => s + Number(o.total || 0),
      0
    );

    const byStatus = (s) =>
      orders.filter(o => o.status === s).length;

    // last 7 days for the sparkline
    const spark = Array.from(
      { length: 7 },
      (_, i) => {

        const d = new Date(
          now.getTime() - (6 - i) * 86400000
        );

        return {
          key: dayKey(d),
          label: d.toLocaleDateString("vi-VN", {
            weekday: "short"
          }),
          revenue: revenueOn(dayKey(d))
        };

      }
    );

    return {
      today,
      todayCount: todayOrders.length,
      change,
      total,
      avg: paid.length ? total / paid.length : 0,
      pending: byStatus("Pending"),
      preparing: byStatus("Preparing"),
      delivering: byStatus("Delivering"),
      completed: byStatus("Completed"),
      cancelled: byStatus("Cancelled"),
      spark
    };

  }, [orders, paid]);

  // top products
  const topProducts = useMemo(() => {

    const map = {};

    paid.forEach(order => {

      (order.items || []).forEach(item => {

        const name = item.name || "Unknown";

        const qty =
          Number(item.quantity ?? item.qty) || 1;

        if (!map[name]) {
          map[name] = { qty: 0, revenue: 0 };
        }

        map[name].qty += qty;

        map[name].revenue +=
          qty * Number(item.price || 0);

      });

    });

    return Object.entries(map)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

  }, [paid]);

  const recent = useMemo(
    () => [...orders]
      .sort((a, b) => orderTime(b) - orderTime(a))
      .slice(0, 6),
    [orders]
  );

  const sparkMax = Math.max(
    ...stats.spark.map(d => d.revenue),
    1
  );

  const completionRate =
    orders.length
      ? Math.round(
          stats.completed / orders.length * 100
        )
      : 0;

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-start gap-4">

        <div>

          <h1 className="text-4xl font-bold text-[#2d1e1e]">
            Welcome back ☕
          </h1>

          <p className="text-gray-500 mt-2">
            {
              new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
              })
            }
          </p>

        </div>

        {newOrderCount > 0 && (

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 px-5 py-3 rounded-2xl hover:bg-amber-100 transition"
          >

            <Bell
              size={18}
              className="text-amber-600 animate-pulse"
            />

            <span className="font-bold text-amber-900">
              {newOrderCount} new order
              {newOrderCount === 1 ? "" : "s"}
            </span>

            <ArrowRight
              size={16}
              className="text-amber-700"
            />

          </Link>

        )}

      </div>

      {/* HERO: TODAY + SPARKLINE */}
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">

        <div className="bg-gradient-to-br from-[#5a3f3f] to-[#2d1e1e] text-white rounded-3xl p-8 shadow-lg">

          <div className="flex items-start justify-between gap-4 mb-6">

            <div>

              <p className="text-[#e0b891] text-sm uppercase tracking-[0.16em] mb-2">
                Revenue today
              </p>

              <p className="text-4xl font-black leading-none">
                {money(stats.today)}
              </p>

              <p className="text-white/70 text-sm mt-2">
                from {stats.todayCount} order
                {stats.todayCount === 1 ? "" : "s"}
              </p>

            </div>

            {stats.change !== null && (

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
                  stats.change >= 0
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >

                {
                  stats.change >= 0
                    ? <TrendingUp size={14} />
                    : <TrendingDown size={14} />
                }

                {stats.change >= 0 ? "+" : ""}
                {stats.change.toFixed(0)}%

              </span>

            )}

          </div>

          {/* 7-DAY SPARKLINE */}
          <div className="flex items-end gap-2 h-24">

            {stats.spark.map((d, i) => (

              <div
                key={d.key}
                className="flex-1 flex flex-col items-center justify-end h-full group"
                title={`${d.label}: ${money(d.revenue)}`}
              >

                <div
                  className={`w-full rounded-t transition-all ${
                    i === stats.spark.length - 1
                      ? "bg-[#c08b5c]"
                      : "bg-white/25 group-hover:bg-white/40"
                  }`}
                  style={{
                    height: `${Math.max(
                      3,
                      (d.revenue / sparkMax) * 100
                    )}%`
                  }}
                />

                <span className="text-[10px] text-white/50 mt-2">
                  {d.label}
                </span>

              </div>

            ))}

          </div>

          <p className="text-white/50 text-xs mt-4">
            Last 7 days · cancelled orders excluded
          </p>

        </div>

        {/* ORDER PIPELINE */}
        <div className="bg-white rounded-3xl p-8 border shadow-sm">

          <h2 className="text-xl font-bold mb-1">
            Order pipeline
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            What needs attention right now
          </p>

          <div className="space-y-3">

            <PipelineRow
              icon={<Clock3 size={16} />}
              label="Pending"
              value={stats.pending}
              tone="yellow"
              urgent={stats.pending > 0}
            />

            <PipelineRow
              icon={<Coffee size={16} />}
              label="Preparing"
              value={stats.preparing}
              tone="blue"
            />

            <PipelineRow
              icon={<Truck size={16} />}
              label="Delivering"
              value={stats.delivering}
              tone="purple"
            />

            <PipelineRow
              icon={<CheckCircle size={16} />}
              label="Completed"
              value={stats.completed}
              tone="green"
            />

            {stats.cancelled > 0 && (

              <PipelineRow
                icon={<XCircle size={16} />}
                label="Cancelled"
                value={stats.cancelled}
                tone="red"
              />

            )}

          </div>

          <Link
            to="/admin/orders"
            className="mt-6 flex items-center justify-center gap-2 w-full bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white py-3 rounded-xl font-semibold transition"
          >
            Manage orders
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>

      {/* KPI ROW */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <DashboardCard
          title="Lifetime revenue"
          value={money(stats.total)}
          icon={<DollarSign />}
          color="green"
        />

        <DashboardCard
          title="Total orders"
          value={orders.length}
          icon={<ShoppingBag />}
          color="blue"
        />

        <DashboardCard
          title="Average order"
          value={money(stats.avg)}
          icon={<Receipt />}
          color="amber"
        />

        <DashboardCard
          title="Completion rate"
          value={`${completionRate}%`}
          icon={<CheckCircle />}
          color="purple"
        />

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* TOP PRODUCTS */}
        <div className="bg-white rounded-3xl p-8 border shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-2.5 rounded-xl bg-[#f5eee8] text-[#6b4f4f]">
              <Star size={18} />
            </div>

            <h2 className="text-xl font-bold">
              Best sellers
            </h2>

          </div>

          {
            topProducts.length === 0
              ? (
                <p className="text-gray-400">
                  No sales data yet.
                </p>
              )
              : (

                <div className="space-y-4">

                  {topProducts.map((p, i) => (

                    <div key={p.name}>

                      <div className="flex justify-between items-baseline gap-3 mb-1.5">

                        <span className="text-sm font-medium text-[#2d1e1e] truncate">

                          <span className="text-[#c08b5c] font-bold mr-2">
                            #{i + 1}
                          </span>

                          {p.name}

                        </span>

                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {p.qty} sold
                        </span>

                      </div>

                      <div className="h-2 rounded-full bg-[#f3ece5] overflow-hidden">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#8a5f34] to-[#c08b5c] transition-all duration-700"
                          style={{
                            width: `${
                              (p.qty / topProducts[0].qty) * 100
                            }%`
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              )
          }

          <Link
            to="/admin/reports"
            className="mt-6 inline-flex items-center gap-2 text-[#6b4f4f] font-semibold hover:underline"
          >
            Full reports
            <ArrowRight size={15} />
          </Link>

        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-3xl p-8 border shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-2.5 rounded-xl bg-[#f5eee8] text-[#6b4f4f]">
              <Package size={18} />
            </div>

            <h2 className="text-xl font-bold">
              Latest orders
            </h2>

          </div>

          {
            recent.length === 0
              ? (
                <p className="text-gray-500">
                  No orders yet.
                </p>
              )
              : (

                <div className="space-y-3">

                  {recent.map(order => (

                    <Link
                      key={order._id}
                      to="/admin/orders"
                      className="flex justify-between items-center bg-[#faf7f3] hover:bg-[#f3ece5] rounded-xl p-4 transition gap-3"
                    >

                      <div className="min-w-0">

                        <p className="font-semibold text-[#2d1e1e]">
                          #{order._id?.slice(-6).toUpperCase()}
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {
                            orderTime(order).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit"
                            })
                          }
                          {" · "}
                          {order.items?.length || 0} item
                          {order.items?.length === 1 ? "" : "s"}
                        </p>

                      </div>

                      <div className="text-right shrink-0">

                        <p className="font-bold text-[#6b4f4f]">
                          {money(order.total)}
                        </p>

                        <StatusPill status={order.status} />

                      </div>

                    </Link>

                  ))}

                </div>

              )
          }

        </div>

      </div>

    </div>

  );

}


function StatusPill({ status }) {

  const tones = {
    Completed: "bg-green-100 text-green-700",
    Preparing: "bg-blue-100 text-blue-700",
    Delivering: "bg-purple-100 text-purple-700",
    Cancelled: "bg-red-100 text-red-700",
    Pending: "bg-yellow-100 text-yellow-700"
  };

  return (

    <span
      className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
        tones[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>

  );

}


function PipelineRow({
  icon,
  label,
  value,
  tone,
  urgent
}) {

  const tones = {
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700"
  };

  return (

    <div
      className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${
        urgent
          ? "bg-amber-50 border border-amber-200"
          : "bg-[#faf7f3]"
      }`}
    >

      <span className="flex items-center gap-3">

        <span className={`p-1.5 rounded-lg ${tones[tone]}`}>
          {icon}
        </span>

        <span className="text-sm font-medium text-[#2d1e1e]">
          {label}
        </span>

      </span>

      <span className="text-lg font-bold text-[#2d1e1e]">
        {value}
      </span>

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
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-purple-100 text-purple-600"
  };

  return (

    <div className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-lg transition">

      <div className={`p-3 rounded-xl w-fit ${colors[color]}`}>
        {icon}
      </div>

      <p className="text-gray-500 mt-4 text-sm">
        {title}
      </p>

      <h2 className="text-2xl font-bold mt-1.5 text-[#2d1e1e]">
        {value}
      </h2>

    </div>

  );

}
