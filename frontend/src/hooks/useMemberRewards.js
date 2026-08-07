import { useEffect, useState, useCallback } from "react";

// =====================================
// MEMBER REWARDS + PERSONAL VOUCHERS
//
// One source of truth for the promo banner,
// the promotions page and checkout.
//
// "Personal" vouchers (WELCOME20, tier rewards)
// belong to a single member — a customer who
// does not own one cannot use it.
// =====================================

export default function useMemberRewards(user) {

  const [rewards, setRewards] =
    useState(null);

  const [loading, setLoading] =
    useState(Boolean(user));

  const [error, setError] =
    useState("");

  const load = useCallback(async () => {

    const token =
      localStorage.getItem("token");

    if (!user || !token) {

      setRewards(null);

      setLoading(false);

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/rewards/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const body =
        await response.json().catch(() => ({}));

      if (!response.ok) {

        throw new Error(
          body.message ||
          "Could not load your rewards"
        );

      }

      setRewards(body);

      setError("");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  }, [user?._id]);

  useEffect(() => {

    let cancelled = false;

    if (!cancelled) load();

    return () => {
      cancelled = true;
    };

  }, [load]);

  const vouchers =
    rewards?.vouchers || [];

  // only unused ones can be spent
  const usableVouchers =
    vouchers.filter(v => !v.used);

  const welcomeVoucher =
    usableVouchers.find(
      v => v.source === "WELCOME"
    ) || null;

  const tierVouchers =
    usableVouchers.filter(
      v => v.source === "TIER"
    );

  return {
    rewards,
    vouchers,
    usableVouchers,
    welcomeVoucher,
    tierVouchers,
    loading,
    error,
    refetch: load
  };

}
