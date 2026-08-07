import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  Tag,
  Sparkles,
  ArrowRight
} from "lucide-react";

import { getPromoStyle } from "../../utils/promoTypes";

import useMemberRewards from "../../hooks/useMemberRewards";


export default function PromoBanner({
  user
}) {

  const [promotions, setPromotions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [current, setCurrent] =
    useState(0);

  const [paused, setPaused] =
    useState(false);

  const [brokenImages, setBrokenImages] =
    useState({});

  // the new-member 20% is a personal voucher,
  // so it only appears for members who own it
  const { welcomeVoucher } =
    useMemberRewards(user);

  // =========================
  // LIVE PROMOTIONS
  // =========================
  useEffect(() => {

    let cancelled = false;

    fetch("http://localhost:5000/api/promotions")

      .then(res => res.json())

      .then(data => {

        if (cancelled) return;

        setPromotions(
          Array.isArray(data)
            ? data.filter(p => p.active)
            : []
        );

      })

      .catch(err => console.log(err))

      .finally(() => {

        if (!cancelled) setLoading(false);

      });

    return () => {
      cancelled = true;
    };

  }, []);

  // =========================
  // SLIDES
  // the welcome offer leads, when eligible
  // =========================
  const slides = useMemo(() => {

    const list = promotions.map(promo => ({
      key: promo._id,
      title: promo.title,
      description: promo.description,
      code: promo.code,
      type: promo.type,
      banner: promo.banner,
      value:
        promo.type === "FREESHIP"
          ? "FREE SHIP"
          : promo.discount
            ? `${promo.discount}% OFF`
            : null,
      personal: false
    }));

    // The welcome offer leads the carousel for
    // people who can actually use it: brand new
    // members, and visitors who aren't signed in
    // yet. Existing customers never see it.
    const isGuest = !user;

    if (welcomeVoucher || isGuest) {

      list.unshift({
        key: "welcome",

        title:
          welcomeVoucher?.title ||
          "20% off your first order",

        description:
          welcomeVoucher?.description ||
          "Create an account and your first drink is 20% off",

        code: welcomeVoucher?.code,

        type: "WELCOME",

        value: `${welcomeVoucher?.discount || 20}% OFF`,

        personal: true,

        // guests get a sign-up CTA instead
        guest: isGuest
      });

    }

    return list;

  }, [promotions, welcomeVoucher, user]);

  const count = slides.length;

  // =========================
  // AUTOPLAY
  // =========================
  useEffect(() => {

    if (count <= 1 || paused) return;

    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reduceMotion) return;

    const timer = setInterval(() => {

      setCurrent(prev => (prev + 1) % count);

    }, 6000);

    return () => clearInterval(timer);

  }, [count, paused]);

  useEffect(() => {

    if (count && current >= count) {
      setCurrent(0);
    }

  }, [count, current]);

  const go = (next) => {

    if (!count) return;

    setCurrent((next + count) % count);

  };

  if (loading) {

    return (
      <div className="mb-16 h-[340px] rounded-[36px] bg-[#efe7de] animate-pulse" />
    );

  }

  if (!count) return null;

  const slide = slides[current];

  const style = getPromoStyle(slide.type);

  // Fallback 2 tầng.
  //
  // Trước đây viết `slide.banner || style.image` — nhưng
  // banner trong DB (/images/freeship.jpg…) là truthy dù
  // FILE KHÔNG TỒN TẠI, nên `||` ngắn mạch và ảnh theo
  // loại trong promoTypes.js không bao giờ được dùng.
  // Ảnh DB 404 → onError → ẩn luôn thẻ img.
  //
  // Giờ: thử banner DB trước, lỗi thì thử ảnh theo loại,
  // lỗi cả hai mới ẩn.
  const failed = brokenImages[slide.key];

  const image =
    failed === "all"
      ? null
      : failed === "banner" || !slide.banner
        ? style.image
        : slide.banner;

  const handleImageError = () => {

    setBrokenImages(prev => ({
      ...prev,

      // tầng 1 lỗi → xuống tầng 2
      // tầng 2 cũng lỗi → ẩn
      [slide.key]:
        prev[slide.key] === "banner" || !slide.banner
          ? "all"
          : "banner"
    }));

  };

  return (

    <section
      className="relative overflow-hidden rounded-[36px] bg-[#2d1e1e] mb-16 shadow-[0_24px_70px_rgba(45,30,30,0.28)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Current promotions"
    >

      {/* PHOTO */}
      {image && (

        <img
          key={`${slide.key}-${image}`}
          src={image}
          alt=""
          onError={handleImageError}
          className="absolute inset-0 w-full h-full object-cover"
        />

      )}

      {/* WASH — keeps the type readable
          over any photo */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${style.gradient} opacity-[0.88]`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

      {/* CONTENT
          Fixed heights on every text row. The type
          scale used to change between slides — a
          long value like "FREE SHIP" at 7xl stretched
          the banner while "15% OFF" shrank it, so the
          box jumped size on every rotation. */}
      <div className="relative px-8 py-12 md:px-14 md:py-14 h-[380px] md:h-[360px] flex flex-col justify-center text-white">

        <div className="max-w-2xl">

          {/* EYEBROW — one line, fixed height */}
          <div className="flex flex-wrap items-center gap-3 mb-5 h-8">

            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] whitespace-nowrap">

              <span aria-hidden="true">
                {slide.personal ? "🎁" : style.icon}
              </span>

              {
                slide.personal
                  ? "Just for you"
                  : style.label
              }

            </span>

            {slide.value && (

              <span className="inline-flex items-center bg-white text-[#2d1e1e] rounded-full px-3.5 py-1.5 text-xs font-black uppercase tracking-wider whitespace-nowrap">
                {slide.value}
              </span>

            )}

            {slide.personal && !slide.guest && (

              <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap">

                <Sparkles size={13} />

                New member

              </span>

            )}

          </div>

          {/* TITLE — single locked size, 2 lines max */}
          <h2 className="text-3xl md:text-[42px] font-black leading-[1.1] tracking-tight mb-4 line-clamp-2 min-h-[2.2em]">
            {slide.title}
          </h2>

          {/* COPY — 2 lines reserved */}
          <p className="text-base md:text-lg text-white/85 mb-8 max-w-xl line-clamp-2 min-h-[3.4rem]">
            {slide.description}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">

            <Link
              to={
                slide.guest
                  ? "/register"
                  : "/promotions"
              }
              className="group inline-flex items-center gap-2 bg-white text-[#2d1e1e] px-8 py-4 rounded-full font-bold hover:bg-[#f3e2d0] transition whitespace-nowrap"
            >

              {
                slide.guest
                  ? "Claim 20% Off"
                  : "View All Deals"
              }

              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />

            </Link>

            {slide.code && (

              <span className="inline-flex items-center gap-2 bg-black/25 backdrop-blur-md border border-white/25 rounded-full px-5 py-3 font-mono text-sm font-bold tracking-[0.15em] whitespace-nowrap">

                <Tag size={15} />

                {slide.code}

              </span>

            )}

          </div>

        </div>

      </div>

      {/* CONTROLS */}
      {count > 1 && (

        <div className="absolute bottom-6 right-6 md:right-14 flex items-center gap-2">

          <button
            onClick={() => go(current - 1)}
            aria-label="Previous promotion"
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="px-3 text-sm font-semibold text-white/80 tabular-nums">
            {current + 1} / {count}
          </span>

          <button
            onClick={() => go(current + 1)}
            aria-label="Next promotion"
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition"
          >
            <ChevronRight size={20} />
          </button>

        </div>

      )}

      {/* DOTS */}
      {count > 1 && (

        <div className="absolute bottom-8 left-8 md:left-14 flex gap-2">

          {slides.map((item, index) => (

            <button
              key={item.key}
              onClick={() => setCurrent(index)}
              aria-label={`Show ${item.title}`}
              aria-current={current === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "bg-white w-8"
                  : "bg-white/40 w-2 hover:bg-white/70"
              }`}
            />

          ))}

        </div>

      )}

    </section>

  );

}
