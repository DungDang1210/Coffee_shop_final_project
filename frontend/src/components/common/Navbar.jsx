import { Link, useNavigate } from "react-router-dom";

import {
  Coffee,
  ShoppingCart,
  UserCircle2,
  ShieldCheck,
  Circle
} from "lucide-react";

export default function Navbar({
  cartCount,
  user,
  setUser
}) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);

    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#fcfaf8]/90 border-b border-[#e8ddd2] shadow-sm">

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          className="flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6b4f4f] via-[#4b332f] to-[#2d1e1e] flex items-center justify-center shadow-lg group-hover:scale-105 transition duration-300">
            <Coffee
              size={28}
              className="text-[#f5e6d8]"
              strokeWidth={2.2}
            />
          </div>

          <div className="leading-tight hidden sm:block">
            <h1 className="text-xl font-bold tracking-[0.18em] text-[#3d2b2b] group-hover:text-[#6b4f4f] transition">
              BREW HAVEN
            </h1>

            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8a7a6f]">
              Artisan Coffee House
            </p>
          </div>
        </Link>

        {/* ================= NAV ================= */}
        <div className="flex items-center gap-4 md:gap-6 text-[15px] font-medium text-[#4b3a35]">

          <Link
            to="/menu"
            className="hover:text-[#c08b5c] transition hidden md:block"
          >
            Our Menu
          </Link>

          <Link
            to="/favorites"
            className="hover:text-[#c08b5c] transition hidden md:block"
          >
            Favorites
          </Link>

          <Link
            to="/orders"
            className="hover:text-[#c08b5c] transition hidden md:block"
          >
            Orders
          </Link>

          {/* ================= ADMIN ================= */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-2 bg-gradient-to-r from-[#2d1e1e] to-[#4b332f] text-white px-5 py-2.5 rounded-full hover:scale-105 transition shadow-lg"
            >
              <ShieldCheck size={18} />
              <span className="hidden md:block">
                Admin
              </span>
            </Link>
          )}

          {/* ================= CART ================= */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 bg-[#6b4f4f] text-white px-5 py-2.5 rounded-full hover:bg-[#5a3f3f] hover:scale-105 shadow-md transition"
          >
            <ShoppingCart size={18} />

            <span className="hidden md:block">
              Cart
            </span>

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c08b5c] text-white text-xs font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ================= PROMOTIONS ================= */}
          <Link
            to="/promotions"
            className="hover:text-[#c08b5c] transition hidden md:block"
          >
            Promotions
          </Link>

          {/* ================= USER ================= */}
          {user ? (
            <div className="flex items-center gap-3">

              {/* PROFILE */}
              <Link
                to="/profile"
                className="flex items-center gap-3 group"
              >

                {/* AVATAR */}
                <div className="relative">

                  {user?.avatar ? (
                    <img
                      src={user.avatar || "/images/default-avatar.png"}
                      alt={user.name}
                      onError={(e) => {
                        e.target.src = "/images/default-avatar.png";
                      }}
                      className="
                      w-12
                      h-12
                      rounded-full
                      object-cover
                      border-2
                      border-[#e8ddd2]
                      shadow-md
                      group-hover:scale-105
                      transition
                      "
                    />
                                      ) : (
                    <div className="w-12 h-12 rounded-full bg-[#f3e8dd] flex items-center justify-center border border-[#e8ddd2] shadow-sm group-hover:scale-105 transition">
                      <UserCircle2
                        size={30}
                        className="text-[#6b4f4f]"
                      />
                    </div>
                  )}

                  {/* ONLINE BADGE */}
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />

                </div>

                {/* INFO */}
                <div className="leading-tight hidden lg:block">

                  <p className="text-sm font-bold text-[#3d2b2b]">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-500 truncate max-w-[170px]">
                    {user.email}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium">

                    <Circle
                      size={8}
                      fill="currentColor"
                    />

                    {
                      user.avatar
                      ? "Google Account"
                      : "Online"
                    }

                  </div>

                </div>

              </Link>

              {/* LOGOUT */}
              <button
              onClick={handleLogout}
              className="
              ml-2
              px-4
              py-2
              rounded-full
              bg-red-50
              text-red-600
              font-semibold
              hover:bg-red-500
              hover:text-white
              transition
              "
              >
              Logout
              </button>

            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#c08b5c] text-white px-5 py-2.5 rounded-full hover:bg-[#a87246] hover:scale-105 shadow-md transition"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}