import {
  Clock3,
  CheckCircle2,
  XCircle,
  Coffee,
  Truck,
  Bell,
  RefreshCw,
  RotateCcw,
  Ban
} from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { authHeaders }  from "../../utils/auth";

export default function OrderManagement({
  orders = [],
  setOrders
}) {

  // the dashboard shell polls /api/orders for all
  // admin pages, so this page no longer fetches
  // separately
  const {
    newOrders = [],
    newOrderCount = 0,
    cancelledOrders = [],
    refreshing,
    lastSyncedAt,
    refresh,
    markOrdersViewed
  } = useOutletContext() || {};

  const [dismissed, setDismissed] =
    useState(false);

  const [filter, setFilter] = useState("All");

  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] = useState("");

  // ids that arrived while this page was open
  const newIds = new Set(
    newOrders.map(o => o._id)
  );

  // a fresh batch resets the banner
  useEffect(() => {

    if (newOrderCount > 0) {
      setDismissed(false);
    }

  }, [newOrderCount]);

  const formatPrice = (price)=>{

    return Number(price || 0)
    .toLocaleString("vi-VN")
    +" ₫";

  };

  // staff already know about their own cancels
  const customerCancelled = cancelledOrders.filter(
    o => o.cancelledBy !== "admin"
  );

  // newest first, then filtered by status
  const visibleOrders = [...orders]
    .sort((a, b) =>
      new Date(b.createdAt || 0) -
      new Date(a.createdAt || 0)
    )
    .filter(order =>
      filter === "All" ||
      order.status === filter
    );

  // ======================
  // UPDATE STATUS
  // ======================
  const updateStatus = async (
    id,
    newStatus
  ) => {

    setError("");

    setUpdatingId(id);

    try {

      const response = await fetch(
        `http://localhost:5000/api/orders/${id}`,
        {
          method: "PUT",

          headers: {
              "Content-Type": "application/json",
              ...authHeaders()
          },

          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      const updatedOrder =
        await response.json().catch(() => null);

      if (!response.ok) {

        throw new Error(
          updatedOrder?.error ||
          "Failed to update order"
        );

      }

      setOrders(prev =>
        prev.map(order =>
          order._id === id
            ? (updatedOrder || order)
            : order
        )
      );

    } catch (err) {

      console.log(err);

      setError(err.message);

    } finally {

      setUpdatingId(null);

    }

  };

  // ======================
  // STATUS STYLE
  // ======================
  const getStatusStyle = (status) => {

      switch (status) {

        case "Completed":
          return "bg-green-100 text-green-700";


        case "Cancelled":
          return "bg-red-100 text-red-700";


        case "Preparing":
          return "bg-blue-100 text-blue-700";


        case "Delivering":
          return "bg-purple-100 text-purple-700";


        case "Pending":
          return "bg-yellow-100 text-yellow-700";


        default:
          return "bg-gray-100 text-gray-700";

      }

  };

  // ======================
  // STATUS ICON
  // ======================
  const getStatusIcon = (status) => {

      switch (status) {


        case "Completed":

          return <CheckCircle2 size={16} />;



        case "Cancelled":

          return <XCircle size={16} />;



        case "Preparing":

          return <Coffee size={16} />;



        case "Delivering":

          return <Truck size={16} />;



        case "Pending":

          return <Clock3 size={16} />;



        default:

          return <Clock3 size={16} />;

      }

  };

  return (

    <div className="min-h-screen bg-[#f8f5f2] p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">

          <div>

            <h1 className="text-4xl font-bold text-[#2d1e1e]">
              Order Management
            </h1>

            <p className="text-gray-500 mt-2">
              Live feed — cancellations and reorders
              from customers appear here automatically.
            </p>

          </div>

          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-2 border border-[#ddd] bg-white px-4 py-2.5 rounded-xl hover:bg-gray-50 disabled:opacity-60 transition"
          >

            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />

            {
              lastSyncedAt
                ? lastSyncedAt.toLocaleTimeString("vi-VN")
                : "Refresh"
            }

          </button>

        </div>

        {/* NEW ORDER ALERT */}
        {newOrderCount > 0 && !dismissed && (

          <div
            role="alert"
            className="mb-6 bg-[#fff8e6] border-2 border-amber-300 rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4"
          >

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-amber-400 text-white flex items-center justify-center animate-pulse shrink-0">

                <Bell size={22} />

              </div>

              <div>

                <p className="font-bold text-amber-900 text-lg">
                  {newOrderCount} new order
                  {newOrderCount === 1 ? "" : "s"} came in
                </p>

                <p className="text-sm text-amber-800">
                  {
                    newOrders
                      .slice(0, 3)
                      .map(o =>
                        `#${o._id?.slice(-6).toUpperCase()}`
                      )
                      .join(", ")
                  }
                  {newOrderCount > 3 && " and more"}
                  {" — start preparing them."}
                </p>

              </div>

            </div>

            <button
              onClick={() => {
                markOrdersViewed?.();
                setDismissed(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
            >
              Mark as seen
            </button>

          </div>

        )}

        {/* CUSTOMER CANCELLED ALERT
            only the ones the CUSTOMER cancelled are
            news to the kitchen — staff already know
            about their own cancellations */}
        {customerCancelled.length > 0 && (

          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl px-6 py-4 flex items-center gap-3">

            <Ban
              size={18}
              className="text-red-600 shrink-0"
            />

            <p className="text-sm text-red-800">

              <strong>
                {customerCancelled.length} order
                {customerCancelled.length === 1 ? "" : "s"}
              </strong>{" "}
              cancelled by customers — do not prepare{" "}
              {
                customerCancelled
                  .slice(0, 4)
                  .map(o =>
                    `#${o._id?.slice(-6).toUpperCase()}`
                  )
                  .join(", ")
              }
              {customerCancelled.length > 4 && " …"}

            </p>

          </div>

        )}

        {/* ERROR */}
        {error && (

          <div
            role="alert"
            className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start justify-between gap-4"
          >

            <span className="text-sm">{error}</span>

            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-800 shrink-0"
            >
              ✕
            </button>

          </div>

        )}

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-8">

          {[
            "All",
            "Pending",
            "Preparing",
            "Delivering",
            "Completed",
            "Cancelled"
          ].map(status => {

            const n =
              status === "All"
                ? orders.length
                : orders.filter(
                    o => o.status === status
                  ).length;

            return (

              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  filter === status
                    ? "bg-[#2d1e1e] text-white"
                    : "bg-white border border-[#ddd] text-gray-600 hover:border-[#6b4f4f]"
                }`}
              >
                {status} ({n})
              </button>

            );

          })}

        </div>

        {/* EMPTY */}
        {visibleOrders.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-sm border border-[#eee] p-16 text-center">

            <Coffee
              size={48}
              className="mx-auto text-gray-300 mb-4"
            />

            <h2 className="text-2xl font-bold mb-2">
              {
                filter === "All"
                  ? "No Orders Yet"
                  : `No ${filter} orders`
              }
            </h2>

            <p className="text-gray-500">
              {
                filter === "All"
                  ? "Incoming orders will appear here."
                  : "Try another status filter."
              }
            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {visibleOrders.map((order) => (

                <div
                  key={order._id}
                  className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition ${
                    order.status === "Cancelled"
                      ? "border-red-200"
                      : newIds.has(order._id)
                        ? "border-amber-400 ring-2 ring-amber-200"
                        : "border-[#eee]"
                  }`}
                >

                  {/* TOP */}
                  <div className="bg-[#f8f3ef] px-8 py-5 flex justify-between items-center flex-wrap gap-4">

                    <div>

                      <div className="flex items-center gap-2 flex-wrap">

                        <p className="text-sm text-gray-500">
                          Order ID
                        </p>

                        {newIds.has(order._id) && (

                          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            New
                          </span>

                        )}

                        {order.isReorder && (

                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">

                            <RotateCcw size={10} />

                            Reorder

                          </span>

                        )}

                      </div>

                      <h2 className="font-bold text-lg text-[#2d1e1e]">
                        #{order._id?.slice(-6).toUpperCase()}
                      </h2>

                      <p className="text-xs text-gray-400 mt-1">
                        {
                          order.createdAt
                            ? new Date(order.createdAt)
                                .toLocaleString("vi-VN")
                            : order.date
                        }
                      </p>

                    </div>

                    <div className="text-right">

                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(order.status)}`}
                      >

                        {getStatusIcon(order.status)}

                        {order.status}

                      </div>

                      {order.status === "Cancelled" && (

                        <p
                          className={`text-xs mt-2 font-semibold ${
                            order.cancelledBy === "admin"
                              ? "text-gray-500"
                              : "text-red-600"
                          }`}
                        >
                          {
                            order.cancelledBy === "admin"
                              ? "Cancelled by you (staff)"
                              : order.cancelledBy === "customer"
                                ? "Cancelled by customer"
                                : "Cancelled"
                          }
                        </p>

                      )}

                    </div>

                  </div>

                  {/* ITEMS */}
                  <div className="p-8 space-y-4">

                    {(order.items || []).map(
                      (item, i) => (

                        <div
                          key={i}
                          className="flex justify-between border-b border-[#f2f2f2] pb-4"
                        >

                          <div>

                            <h3 className="font-semibold text-[#2d1e1e]">
                              {item.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>

                          </div>

                          <span className="font-semibold text-[#6b4f4f]">

                            {formatPrice(
                              item.price * item.quantity
                            )}

                          </span>

                        </div>

                      )
                    )}

                  </div>

                  {/* FOOTER */}
                  <div className="px-8 py-5 bg-[#faf7f4] flex justify-between items-center flex-wrap gap-4">

                    <select
                      value={order.status}
                      disabled={
                        updatingId === order._id
                      }
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="border border-[#ddd] px-4 py-3 rounded-xl bg-white disabled:opacity-60"
                    >

                      <option>Pending</option>

                      <option>Preparing</option>

                      <option>Delivering</option>

                      <option>Completed</option>

                      <option>Cancelled</option>

                    </select>

                    <span className="text-xl font-bold text-[#6b4f4f]">

                      Total: {formatPrice(order.total)}

                    </span>

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>

  );

}
