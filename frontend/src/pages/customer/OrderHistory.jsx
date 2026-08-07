import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Clock3,
  CheckCircle2,
  XCircle,
  Receipt,
  RotateCcw,
  Coffee,
  ChevronDown,
  ChevronUp,
  Truck
} from "lucide-react";

export default function OrderHistory({
  orders,
  setOrders,
  cart,
  setCart,
  showToast,
  user
}) {
  const navigate = useNavigate();

  const [expandedOrder, setExpandedOrder] =
    useState(null);

  // id of the order currently being cancelled
  const [cancellingId, setCancellingId] =
    useState(null);

  const [actionError, setActionError] =
    useState("");

  const userOrders = orders.filter(order =>
    String(order.userId) === String(user?._id)
  );

  // =========================
  // WHAT THE CUSTOMER MAY DO
  //
  // Once the shop starts making the drinks
  // the order is locked: no cancelling, and
  // no reordering (it would double up).
  // =========================
  const IN_PROGRESS = [
    "Preparing",
    "Delivering"
  ];

  const canCancel = (status) =>
    status === "Pending";

  const canReorder = (status) =>
    !IN_PROGRESS.includes(status);

  const lockReason = (status) =>
    IN_PROGRESS.includes(status)
      ? `Your order is already ${status.toLowerCase()} — it can no longer be changed.`
      : "";

  const formatPrice = (price) => {

    return Number(price || 0).toLocaleString("vi-VN") + " ₫";

  };

  const orderStages = [
    "Pending",
    "Preparing",
    "Delivering",
    "Completed"
  ];

  const getStatusStyle = (status) => {

    switch(status){

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Preparing":
        return "bg-blue-100 text-blue-700";

      case "Delivering":
        return "bg-purple-100 text-purple-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";

    }

  };

  const getStatusIcon = status => {

    switch(status){

      case "Completed":
        return <CheckCircle2 size={16}/>;

      case "Preparing":
        return <Coffee size={16}/>;

      case "Delivering":
        return <Truck size={16}/>;

      case "Cancelled":
        return <XCircle size={16}/>;

      default:
        return <Clock3 size={16}/>;

    }

  };

  const handleReorder = order => {

    let updatedCart = [...cart];

    order.items.forEach(item => {

      const index =
        updatedCart.findIndex(

          cartItem =>

            cartItem._id === item.productId &&

            cartItem.customization?.size === item.customization?.size &&

            cartItem.customization?.sugar === item.customization?.sugar &&

            cartItem.customization?.ice === item.customization?.ice &&

            cartItem.customization?.milk === item.customization?.milk

        );

      if(index !== -1){

        updatedCart[index].qty += item.quantity || 1;

      }else{

          updatedCart.push({

              _id: item.productId,

              name: item.name,

              image: item.image,

              category: item.category,

              price: item.price,

              qty:item.quantity || 1,

              customization: item.customization

          });

      }

    });

    setCart(updatedCart);

    // remember this is a repeat, so checkout can
    // flag the new order and the admin sees
    // "Reorder" next to it
    localStorage.setItem(
      "reorderOf",
      order._id
    );

    showToast?.("Items added to cart — reorder ready");

    navigate("/cart");

  };

  const handleCancelOrder = async(orderId)=>{

    const confirmCancel =
      window.confirm(
        "Cancel this order?"
      );

    if(!confirmCancel) return;

    setActionError("");

    setCancellingId(orderId);

    try{

      const token =
        localStorage.getItem("token");

      const res = await fetch(

        `http://localhost:5000/api/orders/${orderId}/cancel`,

        {

          method:"PUT",

          headers:{
              "Content-Type":"application/json",

              ...(
                token
                  ? { Authorization: `Bearer ${token}` }
                  : {}
              )
          }

        }

      );

      const updatedOrder =
        await res.json().catch(() => null);

      if(!res.ok){

          throw new Error(
            updatedOrder?.error ||
            "Could not cancel this order."
          );

      }

      // trust the server's copy of the order
      setOrders(
        orders.map(order =>
          order._id === orderId
            ? (updatedOrder || {
                ...order,
                status: "Cancelled"
              })
            : order
        )
      );

      showToast?.("Order cancelled");

    }

    catch(err){

      console.log(err);

      setActionError(err.message);

    }

    finally{

      setCancellingId(null);

    }

  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Back to the menu, not navigate(-1):
            you usually arrive here from Success or the
            navbar, and going "back" to a payment
            screen is not useful. */}
        <button
          onClick={() => navigate("/menu")}
          className="mb-8 text-[#6b4f4f] font-semibold hover:underline"
        >
          ← Back to Menu
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#2d1e1e] mb-2">
            Your Orders
          </h1>

          <p className="text-gray-500">
            Review your recent coffee purchases and track order progress.
          </p>
        </div>

        {/* ACTION ERROR */}
        {actionError && (

          <div
            role="alert"
            className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl"
          >

            <XCircle
              size={18}
              className="shrink-0 mt-0.5"
            />

            <span className="text-sm">
              {actionError}
            </span>

          </div>

        )}

        {userOrders.length===0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-[#eee] p-16 text-center">
            <Receipt
              className="mx-auto mb-4 text-gray-300"
              size={52}
            />

            <h2 className="text-2xl font-bold mb-2">
              No Orders Yet
            </h2>

            <p className="text-gray-500">
              Once you place an order, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {userOrders
              .map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl shadow-sm border border-[#eee] overflow-hidden hover:shadow-md transition"
                >
                  {/* HEADER */}
                  <div className="bg-[#f8f3ef] px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <h2 className="font-bold text-lg text-[#2d1e1e]">
                          #{order._id?.slice(-6).toUpperCase()}
                      </h2>
                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Date
                        </p>

                        <p className="font-medium">
                            {
                                order.createdAt
                                    ? new Date(order.createdAt).toLocaleString("vi-VN")
                                    : order.date
                            }
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                            {order.paymentMethod}
                        </p>

                    </div>

                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  {/* CANCELLED NOTICE */}
                  {order.status === "Cancelled" && (

                    <div className="mx-8 mt-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">

                      <XCircle
                        size={18}
                        className="shrink-0"
                      />

                      <span className="text-sm">
                        {
                          order.cancelledBy === "admin"
                            ? "The shop cancelled this order. Please contact us if you were charged."
                            : "You cancelled this order. Nothing was prepared and you were not charged."
                        }
                      </span>

                    </div>

                  )}

                  <div className="px-8 pt-6">

                    <div
                      className={`flex items-center justify-between gap-2 ${
                        order.status === "Cancelled"
                          ? "opacity-40"
                          : ""
                      }`}
                    >
                      {orderStages.map((stage, index) => {
                        const currentIndex =
                          order.status === "Cancelled"
                              ? -1
                              : orderStages.indexOf(order.status);

                        const active = index <= currentIndex;

                        return (
                          <div
                            key={stage}
                            className="flex-1 flex items-center"
                          >
                            <div className="flex flex-col items-center w-full">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition ${
                                  active
                                    ? "bg-[#6b4f4f] text-white"
                                    : "bg-[#eee] text-gray-400"
                                }`}
                              >
                                {index + 1}
                              </div>

                              <span
                                className={`text-xs mt-2 font-medium ${
                                  active
                                    ? "text-[#6b4f4f]"
                                    : "text-gray-400"
                                }`}
                              >
                                {stage}
                              </span>
                            </div>

                            {index !== orderStages.length - 1 && (
                              <div
                                className={`h-1 flex-1 mx-2 rounded ${
                                  index < currentIndex
                                    ? "bg-[#6b4f4f]"
                                    : "bg-[#eee]"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="px-8 py-5">
                        <button
                            onClick={()=>

                                setExpandedOrder(

                                    expandedOrder===order._id

                                        ? null

                                        : order._id

                                )

                            }

                            className="flex items-center gap-2 text-[#6b4f4f] font-semibold"

                        >

                            {

                                expandedOrder===order._id

                                ?

                                <ChevronUp size={18}/>

                                :

                                <ChevronDown size={18}/>

                            }

                            View Details

                        </button>

                    </div>

                  {/* ITEMS */}
                  {expandedOrder===order._id && (
                    <div className="p-8 space-y-4">
                      {order.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start border-b border-[#f2f2f2] pb-4"
                        >
                          <div>
                            <h3 className="font-semibold text-[#2d1e1e]">
                              {item.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>

                            {item.customization && (
                              <p className="text-xs text-gray-400 mt-1">
                                {item.customization.size} •{" "}
                                {item.customization.sugar} Sugar •{" "}
                                {item.customization.ice} Ice •{" "}
                                {item.customization.milk}
                              </p>
                            )}
                          </div>

                          <span className="font-semibold text-[#6b4f4f]">
                            {formatPrice(
                                (item.price || 0) * (item.quantity || 1)
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="bg-[#faf7f4] rounded-2xl p-5 space-y-3">

                    <div className="flex justify-between">

                        <span>Subtotal</span>

                        <span>

                            {formatPrice(order.subtotal)}

                        </span>

                    </div>

                    {order.discount > 0 && (
                        <div className="flex justify-between">
                            <span>Discount</span>

                            <span className="text-green-600">
                                -{formatPrice(order.discount)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span>Delivery</span>

                        <span className={
                            order.deliveryFee === 0
                                ? "text-green-600 font-semibold"
                                : ""
                        }>
                            {order.deliveryFee === 0
                                ? "FREE"
                                : formatPrice(order.deliveryFee)}
                        </span>
                    </div>

                    <div className="flex justify-between">

                        <span>Tax</span>

                        <span>

                            {formatPrice(order.tax || 0)}

                        </span>

                    </div>

                    {order.promotionTitle && (
                        <div className="flex justify-between">
                            <span>Promotion</span>
                            <span className="text-orange-600 font-medium">
                                {order.promotionTitle}
                            </span>
                        </div>
                    )}

                    </div>

                  {/* FOOTER */}
                  <div className="px-8 py-5 bg-[#faf7f4] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <span className="text-gray-500 font-medium">
                      {order.items?.length || 0} item(s)
                    </span>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xl font-bold text-[#6b4f4f]">
                        Total: {formatPrice(order.total || 0)}
                      </span>

                      <button
                        onClick={() => handleReorder(order)}
                        disabled={!canReorder(order.status)}
                        title={lockReason(order.status)}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl transition ${
                          canReorder(order.status)
                            ? "bg-[#6b4f4f] text-white hover:bg-[#5a3f3f]"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <RotateCcw size={16} />
                        Reorder
                      </button>

                      {canCancel(order.status) && (

                        <button
                          onClick={() =>
                            handleCancelOrder(order._id)
                          }
                          disabled={
                            cancellingId === order._id
                          }
                          className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl transition"
                        >

                          {
                            cancellingId === order._id
                              ? "Cancelling..."
                              : "Cancel"
                          }

                        </button>

                      )}

                      {IN_PROGRESS.includes(order.status) && (

                        <span className="text-sm text-gray-500">
                          {lockReason(order.status)}
                        </span>

                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}


      </div>
    </div>
    
  );
}
