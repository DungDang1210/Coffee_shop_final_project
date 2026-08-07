import { useState, useEffect, useRef } from "react";

import { useNavigate, Link } from "react-router-dom";

import {
  Coffee,
  ShieldCheck,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CircleAlert,
  LoaderCircle
} from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";


export default function Login({
  setUser
}) {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  // =========================
  // GOOGLE BUTTON WIDTH
  // keeps the Google iframe from
  // overflowing on small screens
  // (Google caps the button at 400px)
  // =========================
  const googleBoxRef = useRef(null);

  const [googleWidth, setGoogleWidth] =
    useState(null);

  useEffect(() => {

    const box = googleBoxRef.current;

    if (!box) return;

    const update = () =>
      setGoogleWidth(
        String(
          Math.max(
            200,

            // -4px: Google renders the button
            // slightly wider than requested
            Math.min(
              400,
              Math.round(box.offsetWidth) - 4
            )
          )
        )
      );

    update();

    const observer =
      new ResizeObserver(update);

    observer.observe(box);

    return () => observer.disconnect();

  }, []);

  // =========================
  // SAVE SESSION
  // =========================
  const saveSession = (data) => {

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    setUser(data.user);

    navigate("/");

  };

  // =========================
  // LOGIN
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setError("");

    setLoading(true);

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

        setError(
          data.message ||
          "Login failed. Please try again."
        );

        return;

      }

      saveSession(data);

    } catch (err) {

      console.log(err);

      setError(
        "Cannot reach the server. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleSuccess = async (
    credentialResponse
  ) => {

    setError("");

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/google",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            credential:
              credentialResponse.credential
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.token) {

        setError(
          data.message ||
          "Google login failed. Please try again."
        );

        return;

      }

      saveSession(data);

    } catch (err) {

      console.log(err);

      setError(
        "Cannot reach the server. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

  const inputClass =
    "w-full bg-white border border-[#e5ddd6] pl-12 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#6b4f4f] focus:border-transparent transition-all duration-300 text-[15px] disabled:opacity-60";

  return (

    <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center px-4 sm:px-6 py-8">

      <div className="w-full max-w-6xl bg-white rounded-3xl sm:rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden grid lg:grid-cols-2">

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
          <div className="relative z-10 space-y-5 mt-14">

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
        <div className="min-w-0 bg-[#fcfaf8] flex items-center justify-center px-5 sm:px-10 py-10">

          <div className="w-full min-w-0 max-w-md">

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
            <div className="mb-6">

              <h2 className="text-4xl font-black text-[#2d1e1e] leading-tight">
                Welcome Back
              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Login to continue your premium coffee experience ☕
              </p>

            </div>

            {/* ERROR */}
            {error && (

              <div
                role="alert"
                className="mb-5 flex items-start gap-3 bg-[#fdf0ef] border border-[#f3c9c5] text-[#a03d34] px-4 py-3 rounded-xl text-sm"
              >

                <CircleAlert
                  size={18}
                  className="shrink-0 mt-0.5"
                />

                <span>{error}</span>

              </div>

            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              noValidate
            >

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="login-email"
                  className="text-sm font-semibold text-[#2d1e1e] block mb-2"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3948a] pointer-events-none"
                  />

                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    autoComplete="email"
                    autoFocus
                    required
                    disabled={loading}
                    className={inputClass}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value
                      })
                    }
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div>

                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-[#2d1e1e] block mb-2"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3948a] pointer-events-none"
                  />

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className={`${inputClass} pr-12`}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value
                      })
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#a3948a] hover:text-[#6b4f4f] hover:bg-[#f3ece6] transition"
                  >

                    {
                      showPassword
                        ? <EyeOff size={18} />
                        : <Eye size={18} />
                    }

                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6b4f4f] hover:bg-[#5a3f3f] disabled:bg-[#a3908c] disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-xl mt-2"
              >

                {
                  loading
                    ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        Logging in...
                      </>
                    )
                    : (
                      <>
                        Login
                        <ArrowRight size={18} />
                      </>
                    )
                }

              </button>

            </form>

            {/* DIVIDER */}
            <div className="my-5 flex items-center gap-3">

              <div className="flex-1 h-px bg-[#e8dfd8]" />

              <span className="text-gray-400 text-xs font-semibold tracking-wider">
                OR
              </span>

              <div className="flex-1 h-px bg-[#e8dfd8]" />

            </div>

            {/* GOOGLE LOGIN */}
            <div
              ref={googleBoxRef}
              className={`flex justify-center min-h-[40px] ${
                loading
                  ? "pointer-events-none opacity-60"
                  : ""
              }`}
            >

              {/* rendered only after the box is
                  measured, so the button never
                  overflows its column */}
              {googleWidth && (

                <GoogleLogin
                  theme="outline"
                  size="large"
                  shape="pill"
                  text="continue_with"
                  width={googleWidth}
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    setError(
                      "Google login failed. Please try again."
                    )
                  }
                />

              )}

            </div>

            {/* REGISTER */}
            <p className="mt-6 text-center text-gray-500 text-sm">

              Don’t have an account?{" "}

              <Link
                to="/register"
                className="text-[#6b4f4f] font-bold hover:underline"
              >
                Create Account
              </Link>

            </p>

            {/* STAFF ACCESS */}
            <div className="mt-8 pt-6 border-t border-[#e8dfd8]">

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/login")
                }
                className="w-full border border-[#d8ccc4] text-[#6b4f4f] py-3 rounded-xl text-sm font-semibold hover:bg-[#2d1e1e] hover:text-white hover:border-[#2d1e1e] transition-all duration-300 flex items-center justify-center gap-2"
              >

                <ShieldCheck size={16} />

                Admin / Staff Portal

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
