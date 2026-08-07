import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import useMemberRewards from "../../hooks/useMemberRewards";

import {
  rankVouchers,
  voucherSavings,
  voucherLabel,
  priceCart,
  voucherKey,
  sameVoucher
} from "../../utils/voucherValue";

export default function Checkout({
  cart,
  setCart,
  orders,
  setOrders,
  user
}) {
  const navigate = useNavigate();

  useEffect(() => {

    if (!user) {

      alert(
        "Please login first."
      );

      navigate("/login");
    }

  }, [user, navigate]);

  const [customer, setCustomer] = useState({
    paymentMethod: "MoMo",
    address:""
  });

  const [locationLoading, setLocationLoading] = useState(false);

  const [locationError, setLocationError] = useState("");

  const [coordinates,setCoordinates] =
  useState({
      latitude:null,
      longitude:null
  });

  const getLocation = () => {


      if(!navigator.geolocation){

          setLocationError(
              "Your browser does not support location."
          );

          return;

      }



      setLocationLoading(true);

      setLocationError("");



      navigator.geolocation.getCurrentPosition(

          async(position)=>{

              const {
                  latitude,
                  longitude
              } = position.coords;

              console.log(
                  "Current GPS:",
                  latitude,
                  longitude
              );

              try{

                  const response = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                      {
                          headers:{
                              "Accept-Language":"en",
                              "User-Agent":
                              "CoffeeShop-MERN-App"
                          }
                      }
                  );
                  const data =
                  await response.json();

                  setCustomer(prev=>({

                      ...prev,

                      address:
                      data.display_name || ""

                  }));

              }

              catch(err){

                  console.log(
                      "Reverse geocode error:",
                      err
                  );

                  setLocationError(
                      "Cannot convert GPS to address."
                  );

              }

              setLocationLoading(false);

          },



          (error)=>{


              console.log(
                  "GPS Error:",
                  error
              );



              setLocationLoading(false);



              if(error.code===1){

                  setLocationError(
                      "Please allow location permission."
                  );

              }

              else if(error.code===2){

                  setLocationError(
                      "Cannot find your location."
                  );

              }

              else if(error.code===3){

                  setLocationError(
                      "Location timeout."
                  );

              }

              else{

                  setLocationError(
                      "Unknown location error."
                  );

              }


          },

          {

              enableHighAccuracy:true,

              timeout:20000,

              maximumAge:0

          }


      );


  };

  useEffect(() => {

    if(user){

      setCustomer(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));

    }

  }, [user]);

  const [appliedVoucher, setAppliedVoucher] =
    useState(null);

  const [promotions,setPromotions]=useState([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/promotions")

      .then(res => res.json())

      .then(data => {

        setPromotions(

          data.filter(p =>

            p.active &&

            (
              !p.expireDate ||
              new Date(p.expireDate) > new Date()
            )

          )

        );

      });

  }, []);

  const [showVoucherModal, setShowVoucherModal] =
    useState(false);

  const [searchVoucher, setSearchVoucher] =
    useState("");
  
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  // =========================
  // WHAT THIS CUSTOMER MAY USE
  //
  // public promotions + the personal vouchers
  // on their own account (new-member 20%, tier
  // rewards). Another customer's vouchers are
  // never in this list.
  // =========================
  const { usableVouchers } =
    useMemberRewards(user);

  const availableVouchers = useMemo(
    () => [
      ...usableVouchers,
      ...promotions
    ],
    [usableVouchers, promotions]
  );

  // ranked by real dong saved on THIS cart
  const ranked = useMemo(
    () => rankVouchers(cart, availableVouchers),
    [cart, availableVouchers]
  );

  const bestOption =
    ranked.find(r => r.usable && r.savings > 0) || null;

  const bestVoucher =
    bestOption?.voucher || null;

  const [showPaymentModal,
    setShowPaymentModal] =
    useState(false);

  // auto-apply the genuinely best voucher once
  const [autoApplied, setAutoApplied] =
    useState(false);

  useEffect(() => {

    if (
      bestVoucher &&
      !appliedVoucher &&
      !autoApplied
    ) {

      setAppliedVoucher(bestVoucher);

      setAutoApplied(true);

    }

  }, [bestVoucher, appliedVoucher, autoApplied]);

  // if the cart changed so the applied voucher no
  // longer qualifies, drop it rather than quietly
  // charging the wrong total
  useEffect(() => {

    if (!appliedVoucher) return;

    const stillOk =
      ranked.find(
        r => sameVoucher(r.voucher, appliedVoucher)
      );

    if (stillOk && !stillOk.usable) {

      setAppliedVoucher(null);

    }

  }, [ranked, appliedVoucher]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " ₫";
  };

  const voucher = appliedVoucher;

  // single source of truth for the maths, shared
  // with the voucher ranking so the "you save X"
  // figure always matches the total below
  const pricing = useMemo(
    () => priceCart(cart, voucher),
    [cart, voucher]
  );

  const discount = pricing.percentOff;

  const promotionDiscount = pricing.perkOff;

  const shippingFee = pricing.shippingFee;

  const tax = pricing.tax;

  const grandTotal = pricing.total;

  const totalSaved =
    voucherSavings(cart, voucher);
  
    const paymentQRs = {
      MoMo: "/images/momo-qr.png",
      ZaloPay: "/images/zalopay-qr.png",
    };

  /* =========================
     PLACE ORDER
  ========================= */
  const handlePlaceOrder = async () => {

    if(!customer.address){

      alert(
        "Please enter delivery address"
      );

      return;

    }

    const newOrder = {
        
        id: Date.now(),

        userId: user?._id || "guest",

        items: cart.map(item=>({

        productId:item._id,

        name:item.name,

        image:item.image,

        category:item.category,

        subcategory:item.subcategory,

        // AI DATA

        taste:item.taste,

        temperature:item.temperature,

        milk:item.milk,

        caffeine:item.caffeine,

        intensity:item.intensity,

        quantity:item.qty,

        price:item.price,

        customization:item.customization

        })),

        subtotal,

        discount: discount + promotionDiscount,

        promotionDiscount,

        voucherTitle: voucher?.title || null,  

        deliveryFee: shippingFee,

        promotionCode: voucher?.code || null,

        promotionType: voucher?.type || null,

        promotionTitle: voucher?.title || null,

        tax,

        total: grandTotal,

        status: "Pending",

        // set by "Reorder" in order history, so the
        // admin can tell a repeat from a fresh order
        isReorder: Boolean(
          localStorage.getItem("reorderOf")
        ),

        reorderOf:
          localStorage.getItem("reorderOf") || null,

        paymentStatus: "Paid",

        paymentMethod: customer.paymentMethod,

        customer,

        date: new Date().toLocaleString()

    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
              "Content-Type": "application/json",
          },

          body: JSON.stringify(newOrder)
        }
      );

      const savedOrder = await response.json();


      if(!response.ok){

        console.log(
          "ORDER ERROR:",
          savedOrder
        );

        alert(
          savedOrder.error ||
          "Cannot create order"
        );

        return;

      }


      setOrders((prev)=>[
        ...prev,
        savedOrder
      ]);

      setCart([]);

      // the reorder flag is single-use
      localStorage.removeItem("reorderOf");

      navigate("/success");

    } catch (err) {
      alert("Failed to place order.");
    }
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-10 text-sm font-medium">
          <span className="text-gray-400">
            Cart
          </span>

          <span>→</span>

          <span className="text-[#c08b5c] font-bold">
            Checkout
          </span>

          <span>→</span>

          <span className="text-gray-400">
            Success
          </span>
        </div>

        <button
          onClick={() => navigate("/cart")}
          className="mb-8 text-[#6b4f4f] font-semibold hover:underline"
        >
          ← Back to Cart
        </button>

        <h1 className="text-4xl font-bold mb-10">
          Secure Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT FORM */}
          <div className="lg:col-span-2 space-y-8">

            {/* Customer Info */}
            <div className="bg-[#f8f3ef] rounded-2xl p-6">

              <div className="flex justify-between items-center mb-2">

                <h3 className="font-bold text-lg">
                  Account Information
                </h3>

                <span className="
                  bg-green-100
                  text-green-700
                  px-3 py-1
                  rounded-full
                  text-xs
                ">
                  Verified
                </span>

              </div>

              {/* only the address is editable here —
                  the rest comes from the profile */}
              <p className="text-sm text-gray-500 mb-5">
                From your profile.{" "}
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="text-[#6b4f4f] font-semibold hover:underline"
                >
                  Edit profile
                </button>{" "}
                to change your name or phone.
              </p>

              <div className="space-y-4">

                <div className="grid sm:grid-cols-3 gap-4">

                  <div className="bg-white/60 rounded-xl px-4 py-3">

                    <p className="text-gray-500 text-xs">
                      Full Name
                    </p>

                    <p className="font-semibold truncate">
                      {user?.name || "—"}
                    </p>

                  </div>

                  <div className="bg-white/60 rounded-xl px-4 py-3">

                    <p className="text-gray-500 text-xs">
                      Email
                    </p>

                    <p className="font-semibold truncate">
                      {user?.email || "—"}
                    </p>

                  </div>

                  <div className="bg-white/60 rounded-xl px-4 py-3">

                    <p className="text-gray-500 text-xs">
                      Phone
                    </p>

                    {
                      user?.phone
                        ? (
                          <p className="font-semibold truncate">
                            {user.phone}
                          </p>
                        )
                        : (
                          <button
                            type="button"
                            onClick={() =>
                              navigate("/profile")
                            }
                            className="text-sm text-red-600 font-semibold hover:underline"
                          >
                            Add a phone number
                          </button>
                        )
                    }

                  </div>

                </div>

                <div>

                  <p className="text-gray-500 text-sm font-semibold">
                  Delivery Address *
                  </p>


                  <div className="flex gap-3 mt-2">

                  <input

                  type="text"

                  placeholder="Enter address manually or detect location"

                  value={customer.address}

                  onChange={(e)=>
                  setCustomer({
                  ...customer,
                  address:e.target.value
                  })
                  }

                  className="
                  flex-1
                  border
                  rounded-xl
                  p-3
                  "

                  />


                  <button

                  onClick={getLocation}

                  disabled={locationLoading}

                  className="
                  bg-[#6b4f4f]
                  text-white
                  px-4
                  rounded-xl
                  hover:bg-[#5a3f3f]
                  disabled:opacity-50
                  "

                  >

                  {
                  locationLoading
                  ?
                  "Detecting... ⏳"
                  :
                  "📍 Detect Location"
                  }

                  </button>


                  </div>

                  </div>

              </div>

            </div>

            {bestOption && !appliedVoucher && (

              <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">

                <div>

                  <p className="font-bold text-amber-900">
                    ⭐ Best for this cart: {bestOption.voucher.title}
                  </p>

                  <p className="text-sm text-amber-800 mt-0.5">
                    {voucherLabel(bestOption.voucher)} — saves{" "}
                    {formatPrice(bestOption.savings)}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setAppliedVoucher(
                      bestOption.voucher
                    )
                  }
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
                >
                  Apply
                </button>

              </div>

            )}

            {/* Payment */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                Payment Method
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                {[
                  {
                    name: "MoMo",
                    icon: "💗"
                  },
                  {
                    name: "ZaloPay",
                    icon: "💙"
                  },
                ].map(method => (
                  <button
                    key={method.name}
                    onClick={() =>
                      setCustomer({
                        ...customer,
                        paymentMethod: method.name
                      })
                    }
                    className={`p-4 rounded-2xl border font-medium transition ${
                      customer.paymentMethod === method.name
                        ? "border-[#6b4f4f] bg-[#f8f3ef]"
                        : "border-gray-200 hover:border-[#c08b5c]"
                    }`}
                  >
                    <div className="text-2xl">
                      {method.icon}
                    </div>

                    <div>
                      {method.name}
                    </div>
                  </button>
                ))}

              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-white rounded-3xl shadow-sm p-8 h-fit sticky top-24">

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            {/* Voucher */}
            <div className="mb-6">

              <label className="block mb-2 font-semibold">
                Available Vouchers
              </label>

              <button
                onClick={() =>
                  setShowVoucherModal(true)
                }
                className="w-full border rounded-xl p-4 flex justify-between items-center gap-3 hover:bg-gray-50 text-left transition"
              >

                <span className="min-w-0">

                  {appliedVoucher
                    ? (
                      <>
                        <span className="block font-semibold truncate">
                          {appliedVoucher.title}
                        </span>

                        <span className="block text-sm text-green-600">
                          {voucherLabel(appliedVoucher)} — saves{" "}
                          {formatPrice(totalSaved)}
                        </span>
                      </>
                    )
                    : (
                      <>
                        <span className="block font-semibold">
                          Choose a voucher
                        </span>

                        <span className="block text-sm text-gray-500">
                          {ranked.length} available
                        </span>
                      </>
                    )}

                </span>

                <span className="shrink-0">›</span>

              </button>

              {voucher && (

                <button
                  onClick={() => {
                    setAppliedVoucher(null);
                  }}
                  className="mt-2 text-red-500 text-sm hover:underline"
                >
                  Remove Voucher
                </button>

              )}

            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">

              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>

                  <span>
                    {formatPrice(
                      item.price * item.qty
                    )}
                  </span>
                </div>
              ))}

            </div>
            

            <hr className="my-4" />

            <div className="space-y-3 text-sm mb-6">

              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>
                  {formatPrice(subtotal)}
                </span>
              </div>

              {voucher && (

                <div
                className="
                bg-green-50
                border
                border-green-200
                rounded-xl
                p-3
                "
                >

                <div className="font-bold">
                🎉 {voucher.title}
                </div>

                <div className="text-sm mt-1">

                Save{" "}{formatPrice(totalSaved)}

                </div>

                </div>

              )}

              <div className="flex justify-between">
                <span>Delivery Fee</span>

                <span>
                  {formatPrice(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>

                <span>
                  {formatPrice(tax)}
                </span>
              </div>

            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-xl mb-6">

              <span>Total</span>

              <span className="text-[#6b4f4f]">
                {formatPrice(grandTotal)}
              </span>

            </div>

            <button
              onClick={() =>
                setShowPaymentModal(true)
              }
              className="
                w-full
                bg-[#6b4f4f]
                hover:bg-[#5a3f3f]
                text-white
                py-4
                rounded-2xl
                font-semibold
                text-lg
              "
            >
              Place Order
            </button>

            <p className="text-xs text-gray-400 mt-4 text-center">
              By placing order you agree to our Terms.
            </p>

          </div>
          
          {
            showVoucherModal && (

              <div
                className="
                fixed inset-0
                bg-black/40
                flex items-center
                justify-center
                z-50
                "
              >

                <div
                  className="
                  bg-white
                  w-[500px]
                  max-h-[600px]
                  rounded-3xl
                  p-6
                  overflow-y-auto
                  "
                >

                  <div className="flex justify-between mb-4">

                    <h2 className="text-xl font-bold">
                      Available Vouchers
                    </h2>

                    <button
                      onClick={() =>
                        setShowVoucherModal(false)
                      }
                    >
                      ✕
                    </button>

                  </div>

                  <input
                    type="text"
                    placeholder="Search voucher..."
                    value={searchVoucher}
                    onChange={(e) =>
                      setSearchVoucher(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      rounded-xl
                      p-3
                      mb-4
                    "
                  />

                  <p className="text-sm text-gray-500 mb-3">
                    Sorted by how much each one saves on
                    your current cart.
                  </p>

                  {ranked
                    .filter(({ voucher }) =>
                      (voucher.title || "")
                        .toLowerCase()
                        .includes(
                          searchVoucher.toLowerCase()
                        )
                    )
                    .map(({ voucher, savings, blocker, usable }) => {

                      // compare by identity, not by
                      // `code`: DB promos have no code,
                      // so every row used to match
                      const isBest =
                        sameVoucher(
                          voucher,
                          bestOption?.voucher
                        );

                      const isApplied =
                        sameVoucher(
                          voucher,
                          appliedVoucher
                        );

                      return (

                        <button
                          key={voucherKey(voucher)}
                          disabled={!usable}
                          onClick={() => {

                            setAppliedVoucher(voucher);

                            setShowVoucherModal(false);

                          }}
                          className={`w-full text-left border rounded-xl p-4 mb-3 transition ${
                            !usable
                              ? "opacity-60 cursor-not-allowed bg-gray-50"
                              : isApplied
                                ? "border-[#6b4f4f] bg-[#f8f3ef]"
                                : "cursor-pointer hover:bg-[#f8f3ef]"
                          }`}
                        >

                          <div className="flex justify-between gap-3">

                            <div className="min-w-0">

                              <div className="font-bold text-[#6b4f4f] flex items-center gap-2 flex-wrap">

                                {voucher.title}

                                {voucher.source && (

                                  <span className="bg-[#f3e2d0] text-[#8a5f34] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    {
                                      voucher.source === "WELCOME"
                                        ? "New member"
                                        : "Member reward"
                                    }
                                  </span>

                                )}

                              </div>

                              <div className="text-sm text-gray-500">
                                {voucherLabel(voucher)}
                              </div>

                              {
                                blocker
                                  ? (
                                    <div className="text-sm text-amber-700 mt-1">
                                      {blocker}
                                    </div>
                                  )
                                  : (
                                    <div className="text-sm font-semibold text-green-600 mt-1">
                                      {
                                        savings > 0
                                          ? `You save ${formatPrice(savings)}`
                                          : "No saving on this cart"
                                      }
                                    </div>
                                  )
                              }

                              {voucher.code && (

                                <div className="text-xs font-mono text-gray-400 mt-1">
                                  {voucher.code}
                                </div>

                              )}

                            </div>

                            <div className="shrink-0 flex flex-col items-end gap-2">

                              {isBest && usable && (

                                <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                                  BEST VALUE
                                </span>

                              )}

                              {isApplied && (

                                <span className="bg-[#6b4f4f] text-white text-xs px-3 py-1 rounded-full">
                                  APPLIED
                                </span>

                              )}

                            </div>

                          </div>

                        </button>

                      );

                    })}

                  {!ranked.length && (

                    <p className="text-center text-gray-500 py-6">
                      No vouchers available right now.
                    </p>

                  )}

                </div>

              </div>

            )
          }
          {
            showPaymentModal && (

              <div
                className="
                fixed inset-0
                bg-black/50
                flex items-center
                justify-center
                z-50
                "
              >

                <div
                className="
                bg-white
                rounded-3xl
                p-8
                pt-12
                w-[420px]
                text-center
                relative
                "
                >
                  <button

                  onClick={() =>
                  setShowPaymentModal(false)
                  }

                  className="
                  absolute
                  right-5
                  top-5
                  text-xl
                  font-bold
                  text-gray-500
                  hover:text-red-500
                  "

                  >
                  ✕
                  </button>

                  <h2 className="text-2xl font-bold mb-4">
                    Scan To Pay
                  </h2>

                  <h3 className="text-xl font-bold text-center mb-4">
                    {customer.paymentMethod}
                  </h3>

                 <img
                  src={
                    paymentQRs[
                      customer.paymentMethod
                    ]
                  }
                  alt="QR Payment"
                  className="w-52 mx-auto"
                />

                  <p className="mb-2">
                    Payment Method:
                    <strong>
                      {" "}
                      {customer.paymentMethod}
                    </strong>
                  </p>

                  <p className="mb-6">
                    Amount:
                    <strong>
                      {" "}
                      {formatPrice(grandTotal)}
                    </strong>
                  </p>

                  <div className="mb-6 text-left">

                  <p className="text-sm text-gray-500">
                  Delivery Address
                  </p>


                  <div className="
                  flex
                  justify-between
                  items-center
                  bg-gray-100
                  rounded-xl
                  p-3
                  mt-2
                  max-w-full
                  ">

                  <span className="text-sm truncate">
                  {customer.address}
                  </span>

                  </div>

                  </div>
                  
                  <button
                    onClick={() => {

                      setShowPaymentModal(false);

                      handlePlaceOrder();

                    }}
                    className="
                    w-full
                    bg-green-600
                    text-white
                    py-3
                    rounded-xl
                    "
                  >
                    I Have Paid
                  </button>

                </div>

              </div>

            )
          }
          </div>
        </div>
      </div>
  );
}
