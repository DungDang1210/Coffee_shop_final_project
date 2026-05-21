import { useState } from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  Coffee,
  Gift,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] =
    useState(false);

  // =========================
  // REGISTER
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            ...form,

            isNewUser: true,

            vouchers: [
              {
                code: "WELCOME20",
                discount: 20,
                used: false
              }
            ]
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        alert(data.message);

        return;

      }

      alert(
        "Register successful 🎉 You received a 20% welcome voucher!"
      );

      navigate("/login");

    } catch (err) {

      console.log(err);

      alert("Server error");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="h-screen bg-[#f7f3ee] flex items-center justify-center overflow-hidden px-6">

      <div className="w-full max-w-6xl h-[92vh] bg-white rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden lg:flex overflow-hidden bg-[#3d2727] text-white">

          {/* BACKGROUND IMAGE */}
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop"
            alt="Coffee"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3d2727]/90 via-[#5a3f3f]/80 to-[#8b6b61]/70" />

          {/* GLOW */}
          <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] bg-white/10 rounded-full blur-3xl" />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col justify-between p-10 w-full">

            {/* TOP CONTENT */}
            <div>

              {/* LOGO */}
              <div className="w-24 h-24 rounded-[28px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl mb-10">

                <Coffee size={42} />

              </div>

              {/* SMALL TEXT */}
              <p className="uppercase tracking-[5px] text-white/60 text-sm mb-5">
                Premium Coffee Experience
              </p>

              {/* TITLE */}
              <h1 className="text-5xl font-black leading-tight mb-5">
                Brew
                <br />
                Haven
              </h1>

              {/* DESCRIPTION */}
              <p className="text-base text-white/75 leading-relaxed max-w-[440px]">
                Premium handcrafted coffee with
                smart recommendations and cozy café vibes.
              </p>

            </div>

            {/* FEATURE CARDS */}
            <div className="grid grid-cols-2 gap-5">

              {/* CARD 1 */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5">

                <div className="w-12 h-12 rounded-2xl bg-[#d6a77a]/20 flex items-center justify-center mb-4">

                  <Gift size={22} />

                </div>

                <h3 className="font-bold text-xl mb-2">
                  AI Coffee Assistant
                </h3>

                <p className="text-white/70 text-sm leading-relaxed">
                  Smart drink suggestions based on your mood,
                  preferences, and order history.
                </p>

              </div>

              {/* CARD 2 */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5">

                <div className="w-12 h-12 rounded-2xl bg-[#d6a77a]/20 flex items-center justify-center mb-4">

                  <Sparkles size={22} />

                </div>

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

            {/* TOP TEXT */}
            <div className="mb-6">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f3e7dc] text-[#6b4f4f] text-sm font-semibold mb-5">

                <Gift size={16} />

                New users get 20% OFF

              </div>

              <h2 className="text-4xl font-black text-[#2d1e1e] leading-tight">
                Create Account
              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Start your premium coffee journey today ☕
              </p>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* NAME */}
              <div>

                <label className="text-sm font-semibold text-[#2d1e1e] block mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                  }
                  className="w-full bg-white border border-[#e5ddd6] px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#6b4f4f] focus:border-transparent transition-all duration-300 text-[15px]"
                  required
                />

              </div>

              {/* PHONE */}
              <div>

                <label className="text-sm font-semibold text-[#2d1e1e] block mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value
                    })
                  }
                  className="w-full bg-white border border-[#e5ddd6] px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#6b4f4f] focus:border-transparent transition-all duration-300 text-[15px]"
                  required
                />

              </div>

              {/* EMAIL */}
              <div>

                <label className="text-sm font-semibold text-[#2d1e1e] block mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value
                    })
                  }
                  className="w-full bg-white border border-[#e5ddd6] px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#6b4f4f] focus:border-transparent transition-all duration-300 text-[15px]"
                  required
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label className="text-sm font-semibold text-[#2d1e1e] block mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value
                    })
                  }
                  className="w-full bg-white border border-[#e5ddd6] px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#6b4f4f] focus:border-transparent transition-all duration-300 text-[15px]"
                  required
                />

              </div>

              {/* BUTTON */}
              <button
                disabled={loading}
                className="w-full bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white py-3.5 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-xl mt-2"
              >

                {
                  loading
                    ? "Creating..."
                    : "Register"
                }

                <ArrowRight size={18} />

              </button>

            </form>

            {/* LOGIN */}
            <div className="mt-6 text-center">

              <p className="text-gray-500 text-sm">
                Already have an account?
              </p>

              <Link
                to="/login"
                className="inline-block mt-2 text-[#6b4f4f] font-bold hover:underline"
              >
                Login Here
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
