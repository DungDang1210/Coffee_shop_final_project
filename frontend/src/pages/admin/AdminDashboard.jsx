import {
  Link,
  Outlet,
  useLocation
} from "react-router-dom";

import { useState } from "react";

import {
  LayoutDashboard,
  Coffee,
  ClipboardList,
  BarChart3,
  Package,
  CreditCard,
  ShieldCheck,
  Bell
} from "lucide-react";

export default function AdminDashboard({
  orders = []
}) {
  const location = useLocation();

  const [lastViewedOrderId, setLastViewedOrderId] =
    useState(
      Number(localStorage.getItem("lastViewedOrderId")) || 0
    );

  const latestOrderId =
    orders.length > 0
      ? orders[orders.length - 1].id
      : 0;

  const newOrderCount = orders.filter(
    (order) => order.id > lastViewedOrderId
  ).length;

  const markOrdersViewed = () => {
    localStorage.setItem(
      "lastViewedOrderId",
      latestOrderId
    );

    setLastViewedOrderId(latestOrderId);
  };

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
      label: "Supplies",
      path: "/admin/supplies",
      icon: Package
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: CreditCard
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

        {/* ADMIN PROFILE CARD */}
        <div className="bg-white/10 border border-white/10 rounded-2xl p-4 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-4">

            {/* Avatar */}
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Admin Avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#c08b5c] shadow-md"
            />

            <div className="flex-1">
              <h4 className="font-semibold text-white">
                Admin Owner
              </h4>

              <p className="text-xs text-[#ddd]">
                Coffee Shop Manager
              </p>

              {/* ONLINE BADGE */}
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />

                <span className="text-xs font-semibold text-green-300">
                  Online Now
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* NAVIGATION */}
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

        {/* FOOTER STATUS */}
        <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3 text-sm">
            <Bell size={16} className="text-yellow-300" />
            <span>
              {newOrderCount > 0
                ? `${newOrderCount} new orders pending`
                : "No new notifications"}
            </span>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">

        <div className="bg-white rounded-3xl shadow-sm border border-[#eee] p-8 min-h-[calc(100vh-80px)]">
          <Outlet context={{ markOrdersViewed }} />
        </div>

      </main>
    </div>
  );
}