import { useState, useEffect } from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  ShieldCheck,
  ArrowLeft,
  KeyRound
} from "lucide-react";

export default function AdminLogin({
  setAdmin,
  showToast
}) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    adminKey: ""
  });

  const [loading, setLoading] =
    useState(false);

  // =========================
  // LOCK SCROLL
  // =========================
  useEffect(() => {

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "auto";
    };

  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });

  };

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {

    e.preventDefault();

    // ADMIN SECRET KEY
    if (
      form.adminKey !==
      "BREWHAVEN2026"
    ) {

      showToast?.(
        "Invalid admin access key"
      );

      return;

    }

    setLoading(true);

    try {

      const res = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email: form.email,
            password:
              form.password
          })
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.message ||
          "Login failed"
        );

      }

      // SAVE ADMIN
      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      setAdmin(data.admin);

      showToast?.(
        "Welcome Admin ☕"
      );

      navigate(
        "/admin/dashboard"
      );

    } catch (err) {

      showToast?.(
        err.message ||
        "Login error"
      );

    }

    setLoading(false);

  };

  return (

    <div className="fixed inset-0 bg-[#f6f1eb] flex items-center justify-center px-6 overflow-hidden">

      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-[#eee] overflow-hidden">

        {/* TOP */}
        <div className="bg-gradient-to-r from-[#2d1e1e] to-[#5a3f3f] p-8 text-white text-center relative">

          {/* BACK BUTTON */}
          <button
            onClick={() =>
              navigate("/login")
            }
            className="absolute top-5 left-5 bg-white/10 hover:bg-white/20 p-2 rounded-xl transition"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">

            <ShieldCheck size={38} />

          </div>

          <h1 className="text-4xl font-black mb-2">
            Staff Portal
          </h1>

          <p className="text-white/70">
            Authorized personnel only
          </p>

        </div>

        {/* FORM */}
        <div className="p-8">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-[#ddd] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#6b4f4f]"
              required
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-[#ddd] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#6b4f4f]"
              required
            />

            {/* ADMIN KEY */}
            <div className="relative">

              <KeyRound
                size={18}
                className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400"
              />

              <input
                type="password"
                name="adminKey"
                placeholder="Admin Access Key"
                value={form.adminKey}
                onChange={handleChange}
                className="w-full border border-[#ddd] rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 focus:ring-[#6b4f4f]"
                required
              />

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white py-4 rounded-2xl font-bold text-lg transition"
            >
              {
                loading
                  ? "Signing in..."
                  : "Admin Login"
              }
            </button>

          </form>

          {/* BACK TO USER */}
          <button
            onClick={() =>
              navigate("/login")
            }
            className="w-full mt-5 border border-[#ddd] py-4 rounded-2xl font-semibold hover:bg-gray-50 transition"
          >
            Back to User Login
          </button>

        </div>

      </div>

    </div>

  );

}