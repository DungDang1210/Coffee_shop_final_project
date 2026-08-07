import { useEffect, useRef, useState } from "react";

// =====================================
// LIVE ORDER FEED FOR ADMIN
//
// Customers cancel and reorder from their own
// page. Without polling the admin only sees
// those changes after a manual refresh, so a
// cancelled order still looks Pending in the
// kitchen.
//
// Also reports which orders are new since the
// admin last looked, using createdAt. The old
// code compared `order.id`, a field the Order
// schema does not have — mongoose strips it, so
// the counter was always 0.
// =====================================

const POLL_MS = 15000;

const SEEN_KEY = "adminOrdersSeenAt";


export default function useLiveOrders(
  orders = [],
  setOrders
) {

  const [lastSeenAt, setLastSeenAt] = useState(
    () => localStorage.getItem(SEEN_KEY) || null
  );

  const [refreshing, setRefreshing] =
    useState(false);

  const [lastSyncedAt, setLastSyncedAt] =
    useState(null);

  // keep the newest order id we have announced
  const announcedRef = useRef(new Set());

  const load = async () => {

    try {

      setRefreshing(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/orders",
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      if (Array.isArray(data)) {

        setOrders(data);

        setLastSyncedAt(new Date());

      }

    } catch (err) {

      console.log("Order sync failed:", err);

    } finally {

      setRefreshing(false);

    }

  };

  // poll, and refresh immediately when the admin
  // comes back to the tab
  useEffect(() => {

    load();

    const timer = setInterval(load, POLL_MS);

    const onVisible = () => {

      if (document.visibilityState === "visible") {
        load();
      }

    };

    document.addEventListener(
      "visibilitychange",
      onVisible
    );

    return () => {

      clearInterval(timer);

      document.removeEventListener(
        "visibilitychange",
        onVisible
      );

    };

  }, []);

  const seenTime =
    lastSeenAt ? new Date(lastSeenAt).getTime() : 0;

  const newOrders = orders.filter(order => {

    const created =
      new Date(order.createdAt || 0).getTime();

    return created > seenTime;

  });

  // orders the customer cancelled that the kitchen
  // may still be holding
  const cancelledOrders = orders.filter(
    order => order.status === "Cancelled"
  );

  const pendingOrders = orders.filter(
    order => order.status === "Pending"
  );

  const markSeen = () => {

    const now = new Date().toISOString();

    localStorage.setItem(SEEN_KEY, now);

    setLastSeenAt(now);

  };

  return {
    newOrders,
    newOrderCount: newOrders.length,
    cancelledOrders,
    pendingOrders,
    refreshing,
    lastSyncedAt,
    refresh: load,
    markSeen,
    announcedRef
  };

}
