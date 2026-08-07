import {
  Link,
  Outlet,
  useLocation
} from "react-router-dom";

import {
  LayoutDashboard,
  Coffee,
  ClipboardList,
  BarChart3,
  Package,
  RefreshCw
} from "lucide-react";

import useLiveOrders from "../../hooks/useLiveOrders";

export default function AdminDashboard({
  orders = [],
  setOrders
}) {

  const location = useLocation();

  // who is signed in (set by AdminLogin)
  const admin = (() => {

    try {

      return JSON.parse(
        localStorage.getItem("admin")
      );

    } catch {

      return null;

    }

  })();

  // polls /api/orders, so a cancel or a reorder made
  // on the customer side shows up here without a
  // manual refresh
  const {
    newOrders,
    newOrderCount,
    cancelledOrders,
    pendingOrders,
    refreshing,
    lastSyncedAt,
    refresh,
    markSeen
  } = useLiveOrders(orders, setOrders);

  const markOrdersViewed = markSeen;

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Menu Management",
      path: "/admin/menu",
      icon: Coffee
    },
    {
      label: "Order Management",
      path: "/admin/orders",
      icon: ClipboardList,
      badge: newOrderCount
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: BarChart3
    },
    {
      label: "Inventory",
      path: "/admin/inventory",
      icon: Package
    }
  ];

  return (
    <div className="min-h-screen flex bg-[#f5f3f0]">

      {/* SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-[#5a3f3f] to-[#3e2a2a] text-white p-6 sticky top-0 h-screen shadow-2xl flex flex-col">

        {/* BRAND */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Owner Panel
          </h2>

          <p className="text-sm text-[#d8cfcf] mt-2">
            Coffee Shop Management
          </p>
        </div>

        {/* WHO IS SIGNED IN */}
        <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-sm">

          <div className="w-11 h-11 rounded-full bg-[#c08b5c] text-[#2d1e1e] flex items-center justify-center font-black text-lg shrink-0">
            {
              (admin?.name || "A")
                .charAt(0)
                .toUpperCase()
            }
          </div>

          <div className="min-w-0 flex-1">

            <p className="font-semibold text-white text-sm truncate">
              {admin?.name || "Admin"}
            </p>

            <p className="text-[11px] text-[#d8cfcf] truncate">
              {admin?.email || "Coffee Shop Manager"}
            </p>

          </div>

          <span
            title="Online"
            className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shrink-0"
          />

        </div>

        {/* NAVIGATION
            The "Today" snapshot card used to sit here.
            It duplicated the Dashboard page, which shows
            the same figures with more room, so the
            sidebar just repeats itself. */}
        <nav className="space-y-3 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={
                  item.label === "Order Management"
                    ? markOrdersViewed
                    : undefined
                }
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group ${
                  active
                    ? "bg-white/15 shadow-lg"
                    : "hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />

                  <span className="font-medium">
                    {item.label}
                  </span>
                </div>

                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs min-w-[24px] h-[24px] flex items-center justify-center rounded-full animate-pulse shadow">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER — live sync status.
            The old "No new notifications" line is
            gone; the alert now lives in Order
            Management where it can be acted on. */}
        <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10">

          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-3 text-sm w-full text-left hover:text-white transition disabled:opacity-60"
          >

            <RefreshCw
              size={16}
              className={`text-[#d8cfcf] ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            <span className="text-[#d8cfcf]">
              {
                refreshing
                  ? "Syncing orders..."
                  : lastSyncedAt
                    ? `Synced ${lastSyncedAt.toLocaleTimeString("vi-VN")}`
                    : "Sync orders"
              }
            </span>

          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">

        <div className="
          bg-white 
          rounded-3xl 
          shadow-sm 
          border 
          border-[#eee] 
          p-8 
          min-h-[calc(100vh-80px)]
        ">

          <Outlet
            context={{
              markOrdersViewed,
              newOrders,
              newOrderCount,
              cancelledOrders,
              pendingOrders,
              refreshing,
              lastSyncedAt,
              refresh
            }}
          />

        </div>

      </main>
          </div>
    
  );
}