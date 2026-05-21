import { useState } from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  Coffee,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

export default function Login({
  setUser
}) {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  // =========================
  // LOGIN
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        alert(data.message);

        return;

      }

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        data.token
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // UPDATE STATE
      setUser(data.user);

      alert(
        "Login successful ☕"
      );

      navigate("/");

    } catch (err) {

      console.log(err);

      alert("Server error");

    }

  };

  return (

    <div className="h-screen bg-[#f7f3ee] flex items-center justify-center overflow-hidden px-6">

      <div className="w-full max-w-6xl h-[92vh] bg-white rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#5a3f3f] via-[#6b4f4f] to-[#8b6b61] text-white p-14 overflow-hidden">

          {/* BACKGROUND EFFECT */}
          <div className="absolute top-[-120px] right-[-100px] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl" />

          <div className="absolute bottom-[-100px] left-[-80px] w-[260px] h-[260px] rounded-full bg-[#d9b08c]/20 blur-3xl" />

          {/* LOGO */}
          <div className="relative z-10">

            <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg mb-8">

              <Coffee size={38} />

            </div>

            <h1 className="text-6xl font-black leading-tight mb-6">
              Brew
              <br />
              Haven
            </h1>

            <p className="text-lg text-white/80 leading-relaxed max-w-md">
              Experience premium handcrafted coffee,
              cozy vibes, and personalized recommendations
              designed just for you.
            </p>

          </div>

          {/* FEATURES */}
          <div className="relative z-10 space-y-5">

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5">

              <h3 className="font-bold text-xl mb-2">
                AI Coffee Assistant
              </h3>

              <p className="text-white/70 text-sm leading-relaxed">
                Smart drink suggestions based on your mood,
                preferences, and order history.
              </p>

            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5">

              <h3 className="font-bold text-xl mb-2">
                Premium Experience
              </h3>

              <p className="text-white/70 text-sm leading-relaxed">
                Modern café ordering system with rewards,
                vouchers, and personalized recommendations.
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#fcfaf8] flex items-center justify-center px-10 py-10 overflow-hidden">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="lg:hidden text-center mb-8">

              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#6b4f4f] text-white flex items-center justify-center shadow-lg mb-4">

                <Coffee size={36} />

              </div>

              <h1 className="text-4xl font-black text-[#2d1e1e]">
                Brew Haven
              </h1>

            </div>

            {/* TITLE */}
            <div className="mb-8">

              <h2 className="text-4xl font-black text-[#2d1e1e] leading-tight">
                Welcome Back
              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Login to continue your premium coffee experience ☕
              </p>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>

                <label className="text-sm font-semibold text-[#2d1e1e] block mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white border border-[#e8dfd8] px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#6b4f4f] transition"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value
                    })
                  }
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label className="text-sm font-semibold text-[#2d1e1e] block mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white border border-[#e8dfd8] px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#6b4f4f] transition"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password:
                        e.target.value
                    })
                  }
                />

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="w-full bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >

                Login

                <ArrowRight size={20} />

              </button>

            </form>

            {/* REGISTER */}
            <div className="mt-6 text-center">

              <p className="text-gray-500 text-sm">
                Don’t have an account?
              </p>

              <Link
                to="/register"
                className="inline-block mt-2 text-[#6b4f4f] font-bold hover:underline"
              >
                Create Account
              </Link>

            </div>

            {/* DIVIDER */}
            <div className="my-6 flex items-center gap-4">

              <div className="flex-1 h-[1px] bg-[#e8dfd8]" />

              <span className="text-xs tracking-[3px] text-gray-400 font-semibold">
                STAFF ACCESS
              </span>

              <div className="flex-1 h-[1px] bg-[#e8dfd8]" />

            </div>

            {/* ADMIN LOGIN */}
            <button
              onClick={() =>
                navigate("/admin/login")
              }
              className="w-full border-2 border-[#2d1e1e] text-[#2d1e1e] py-4 rounded-2xl font-bold hover:bg-[#2d1e1e] hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
            >

              <ShieldCheck size={20} />

              Admin / Staff Portal

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}
