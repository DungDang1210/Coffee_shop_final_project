import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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



                  console.log(
                      "Address:",
                      data
                  );



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

  const availableVouchers = promotions;

  const bestVoucher =
    availableVouchers.length
    ?
    availableVouchers.reduce((best,current)=>{

    if(
    !best ||
    current.discount>best.discount
    ){
    return current;
    }

    return best;

    })
    :
    null;

  const [showPaymentModal,
    setShowPaymentModal] =
    useState(false);

  useEffect(() => {

    if (
      bestVoucher &&
      !appliedVoucher
    ) {

      setAppliedVoucher(
        bestVoucher
      );

    }

  }, [bestVoucher]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " ₫";
  };

  const deliveryFee = 15000;

  const voucher = appliedVoucher;

  let discount = 0;

  if (
      voucher?.discount
  ) {

      discount =
        subtotal *
        voucher.discount /
        100;

  }
  
  const promotionDiscount =
  voucher?.type === "FREESHIP"
  ? deliveryFee
  : voucher?.type === "FLASHSALE"
  ? subtotal * 0.15
  : voucher?.type === "BUY5GET1"
  ? cart.length >= 6
    ? Math.min(...cart.map(i => i.price))
    : 0
  : voucher?.type === "ECO"
  ? 5000
  : 0;

  const discountedSubtotal =
  subtotal - discount;

  const shippingFee =
  voucher?.type === "FREESHIP"
  ? 0
  : deliveryFee;

  const totalAfterPromotion =
  discountedSubtotal - promotionDiscount;

  const tax =
  totalAfterPromotion * 0.1;

  const grandTotal =
  totalAfterPromotion +
  shippingFee +
  tax;
  
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

              <div className="flex justify-between items-center mb-5">

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

              <div className="space-y-4">

                <div>
                  <p className="text-gray-500 text-sm">
                    Full Name
                  </p>

                  <p className="font-semibold">
                    {user?.name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Email
                  </p>

                  <p className="font-semibold">
                    {user?.email}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Phone
                  </p>

                  <p className="font-semibold">
                    {user?.phone}
                  </p>
                </div>

                <div>

                  <p className="text-gray-500 text-sm">
                  Delivery Address
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

            {bestVoucher && !appliedVoucher && (

              <div className="
                bg-yellow-50
                border
                border-yellow-300
                p-3
                rounded-xl
                mb-4
              ">

                ⭐ Recommended:

                <strong>{bestVoucher.title}</strong>

                {" "}
                (
                {bestVoucher.type === "FREESHIP"
                  ? "Free Shipping"
                  : `${bestVoucher.discount}% OFF`}
)
                

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
                className="
                  w-full
                  border
                  rounded-xl
                  p-4
                  flex
                  justify-between
                  items-center
                  hover:bg-gray-50
                "
              >
                <span>
                  {appliedVoucher
                  ? `${appliedVoucher.title} ${
                      appliedVoucher.type === "FREESHIP"
                        ? "(Free Shipping)"
                        : `(${appliedVoucher.discount}% OFF)`
                    }`
                  : "Choose Available Voucher"}
                </span>

                <span>›</span>
              </button>

              {bestVoucher && (
                <p className="text-sm text-green-600 mt-2">

                  {bestVoucher.type==="FREESHIP"

                  ?
                  "Free Shipping Available"

                  :
                  `Save up to ${formatPrice(
                  subtotal*bestVoucher.discount/100
                  )}`
                  }

                </p>
              )}

              {voucher && (

              <button
              onClick={()=>{
              setAppliedVoucher(null);
              }}
              className="
              mt-2
              text-red-500
              text-sm
              hover:underline
              "
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

                Save{" "}{formatPrice( discount + promotionDiscount )}

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

                  {availableVouchers
                    .filter(v =>
                      v.title
                        .toLowerCase()
                        .includes(
                          searchVoucher.toLowerCase()
                        )
                    )
                    .map(voucher => (

                      <div
                        key={voucher._id}
                        onClick={() => {

                          setAppliedVoucher(
                            voucher
                          );

                          setShowVoucherModal(
                            false
                          );

                        }}
                        className="
                          border
                          rounded-xl
                          p-4
                          mb-3
                          cursor-pointer
                          hover:bg-[#f8f3ef]
                        "
                      >

                        <div className="flex justify-between">

                          <div>

                            <div className="font-bold text-orange-600">
                              {voucher.title}
                            </div>

                            <div className="text-sm text-gray-500">

                             {voucher.type==="FREESHIP"
                              ? "Free Shipping"

                              : voucher.type==="FLASHSALE"
                              ? "15% Flash Sale"

                              : voucher.type==="BUY5GET1"
                              ? "Buy 5 Get 1"

                              : voucher.type==="ECO"
                              ? "Eco Discount"

                              : `Save ${voucher.discount}%`
                              }
                            </div>

                          </div>

                          {voucher._id === bestVoucher?._id && (

                            <span
                              className="
                              bg-orange-500
                              text-white
                              text-xs
                              px-3
                              py-1
                              rounded-full
                              h-fit
                              "
                            >
                              RECOMMENDED
                            </span>

                          )}

                        </div>

                      </div>

                  ))}

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
