import { Link } from "react-router-dom";

import {
  Crown,
  Coffee,
  Check,
  Lock,
  Sparkles,
  Ticket,
  Gift
} from "lucide-react";

import useMemberRewards from "../../hooks/useMemberRewards";


export default function MemberAward({
  user
}) {

  const {
    rewards: data,
    usableVouchers,
    loading,
    error
  } = useMemberRewards(user);


  const shell =
    "bg-[#efe7de] rounded-[32px] p-8 sm:p-10";

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <div className={`${shell} h-64 animate-pulse`} />
    );

  }

  // =========================
  // GUEST
  // =========================
  if (!user) {

    return (

      <div className={`${shell} flex flex-col lg:flex-row justify-between items-center gap-8`}>

        <div>

          <p className="uppercase tracking-[4px] text-[#c08b5c] text-sm mb-3">
            MEMBER REWARDS
          </p>

          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1e1e] mb-4">
            Earn Free Drinks Faster
          </h2>

          <p className="text-gray-600 max-w-2xl">
            Collect a point for every 1.000₫ you spend,
            climb from Bronze to Platinum, and unlock
            bigger perks on every order.
          </p>

        </div>

        <Link
          to="/login"
          className="shrink-0 bg-[#2d1e1e] hover:bg-[#4b332f] text-white px-8 py-4 rounded-full font-semibold transition hover:scale-105"
        >
          Login to Join
        </Link>

      </div>

    );

  }

  // =========================
  // ERROR
  // =========================
  if (error || !data) {

    return (

      <div className={shell}>

        <p className="uppercase tracking-[4px] text-[#c08b5c] text-sm mb-3">
          MEMBER REWARDS
        </p>

        <p className="text-gray-600">
          {error || "Rewards are unavailable right now."}
        </p>

      </div>

    );

  }

  const {
    points,
    tier,
    nextTier,
    pointsToNext,
    progress,
    tiers,
    orderCount,
    newlyGranted = []
  } = data;

  return (

    <div className={shell}>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">

        <div>

          <p className="uppercase tracking-[4px] text-[#c08b5c] text-sm mb-3">
            MEMBER REWARDS
          </p>

          <h2 className="text-3xl sm:text-4xl font-black text-[#2d1e1e]">
            {
              nextTier
                ? "Earn Free Drinks Faster"
                : "You've Reached the Top ☕"
            }
          </h2>

        </div>

        {/* TIER BADGE */}
        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-white font-bold shadow-lg self-start"
          style={{ backgroundColor: tier.color }}
        >

          <Crown size={20} />

          {tier.name} Member

        </div>

      </div>

      {/* STATS + PROGRESS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 mb-8">

        <div className="flex flex-wrap gap-8 mb-7">

          <div>

            <p className="text-sm text-gray-500 mb-1">
              Your points
            </p>

            <p className="text-4xl font-black text-[#2d1e1e]">
              {points.toLocaleString("vi-VN")}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500 mb-1">
              Orders placed
            </p>

            <p className="text-4xl font-black text-[#2d1e1e]">
              {orderCount}
            </p>

          </div>

          {nextTier && (

            <div>

              <p className="text-sm text-gray-500 mb-1">
                To {nextTier.name}
              </p>

              <p className="text-4xl font-black text-[#c08b5c]">
                {pointsToNext.toLocaleString("vi-VN")}
              </p>

            </div>

          )}

        </div>

        {/* PROGRESS BAR */}
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={
            nextTier
              ? `Progress to ${nextTier.name}`
              : "Highest tier reached"
          }
          className="h-3 w-full rounded-full bg-[#efe7de] overflow-hidden"
        >

          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              backgroundColor: tier.color
            }}
          />

        </div>

        <div className="flex justify-between mt-3 text-sm">

          <span className="font-semibold text-[#2d1e1e]">
            {tier.name}
          </span>

          {
            nextTier
              ? (
                <span className="text-gray-500">
                  {pointsToNext.toLocaleString("vi-VN")} points
                  to {nextTier.name}
                </span>
              )
              : (
                <span className="text-gray-500 flex items-center gap-1">
                  <Sparkles size={14} />
                  Top tier unlocked
                </span>
              )
          }

        </div>

      </div>

      {/* JUST UNLOCKED */}
      {newlyGranted.length > 0 && (

        <div className="mb-8 bg-white border-2 border-caramel rounded-3xl p-6 border-[#c08b5c]">

          <p className="font-bold text-[#2d1e1e] flex items-center gap-2 mb-2">

            <Sparkles
              size={18}
              className="text-[#c08b5c]"
            />

            You reached {tier.name}!

          </p>

          <p className="text-sm text-gray-600">
            {
              newlyGranted
                .map(v => v.title)
                .join(" and ")
            }{" "}
            {
              newlyGranted.length === 1
                ? "was"
                : "were"
            }{" "}
            added to your account. Use it at checkout.
          </p>

        </div>

      )}

      {/* MY VOUCHERS — the rewards they can spend */}
      <div className="mb-8">

        <h3 className="font-bold text-[#2d1e1e] mb-4 flex items-center gap-2">

          <Ticket size={18} />

          Your vouchers

          <span className="text-sm font-normal text-gray-500">
            ({usableVouchers.length} ready to use)
          </span>

        </h3>

        {
          usableVouchers.length
            ? (

              <div className="grid sm:grid-cols-2 gap-4">

                {usableVouchers.map(v => (

                  <div
                    key={v.code}
                    className="bg-white rounded-2xl p-5 flex items-start gap-4"
                  >

                    <div className="w-11 h-11 rounded-xl bg-[#f3e2d0] text-[#8a5f34] flex items-center justify-center shrink-0">

                      {
                        v.source === "WELCOME"
                          ? <Gift size={20} />
                          : <Crown size={20} />
                      }

                    </div>

                    <div className="min-w-0">

                      <p className="font-bold text-[#2d1e1e]">
                        {v.title}
                      </p>

                      <p className="text-sm text-gray-500 mt-0.5">
                        {v.description}
                      </p>

                      <p className="mt-2 inline-block font-mono text-xs font-bold text-[#8a5f34] bg-[#f3e2d0] px-2.5 py-1 rounded">
                        {v.code}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )
            : (

              <p className="text-gray-600 text-sm">
                No vouchers yet — reach {nextTier?.name || "the next tier"}{" "}
                to earn one.
              </p>

            )
        }

        {usableVouchers.length > 0 && (

          <p className="text-xs text-gray-500 mt-4">
            These are yours alone. They appear
            automatically in the voucher list at
            checkout.
          </p>

        )}

      </div>

      {/* PERKS OF CURRENT TIER */}
      <div className="mb-8">

        <h3 className="font-bold text-[#2d1e1e] mb-4 flex items-center gap-2">

          <Coffee size={18} />

          Your {tier.name} perks

        </h3>

        <div className="flex flex-wrap gap-3">

          {tier.perks.map(perk => (

            <span
              key={perk}
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm text-[#2d1e1e]"
            >

              <Check
                size={15}
                className="text-green-600"
              />

              {perk}

            </span>

          ))}

        </div>

      </div>

      {/* TIER LADDER */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {tiers.map(step => {

          const unlocked =
            points >= step.minPoints;

          const isCurrent =
            step.key === tier.key;

          return (

            <div
              key={step.key}
              className={`rounded-2xl p-5 border-2 transition ${
                isCurrent
                  ? "bg-white border-[#c08b5c] shadow-md"
                  : unlocked
                    ? "bg-white/70 border-transparent"
                    : "bg-white/40 border-transparent"
              }`}
            >

              <div className="flex items-center justify-between mb-3">

                <span
                  className="font-bold"
                  style={{
                    color: unlocked
                      ? step.color
                      : "#a3948a"
                  }}
                >
                  {step.name}
                </span>

                {
                  unlocked
                    ? (
                      <Check
                        size={16}
                        className="text-green-600"
                      />
                    )
                    : (
                      <Lock
                        size={16}
                        className="text-gray-400"
                      />
                    )
                }

              </div>

              <p className="text-xs text-gray-500 mb-3">
                {
                  step.minPoints === 0
                    ? "From your first order"
                    : `${step.minPoints.toLocaleString("vi-VN")} points`
                }
              </p>

              <ul className="space-y-1.5">

                {step.perks.map(perk => (

                  <li
                    key={perk}
                    className={`text-xs leading-relaxed ${
                      unlocked
                        ? "text-[#2d1e1e]"
                        : "text-gray-400"
                    }`}
                  >
                    • {perk}
                  </li>

                ))}

              </ul>

            </div>

          );

        })}

      </div>

      <p className="text-xs text-gray-500 mt-6">
        You earn 1 point for every 1.000₫ spent.
        Points are added automatically when an order is placed.
      </p>

    </div>

  );

}
