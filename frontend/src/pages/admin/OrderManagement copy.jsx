import {
  Clock3,
  CheckCircle2,
  XCircle,
  Coffee,
  Truck
} from "lucide-react";
import { useEffect } from "react";
import { authHeaders }  from "../../utils/auth";

export default function OrderManagement({
  orders = [],
  setOrders
}) {
  useEffect(()=>{

    const loadOrders = async()=>{


      try{


        const res = await fetch(
          "http://localhost:5000/api/orders",
          { headers: authHeaders() }
        );


        const data = await res.json();


        setOrders(data);


      }
      catch(err){

        console.log(err);

      }


    };


    loadOrders();


  },[]);

  const formatPrice = (price)=>{

    return Number(price || 0)
    .toLocaleString("vi-VN")
    +" ₫";

  };

  // ======================
  // UPDATE STATUS
  // ======================
  const updateStatus = async (
    id,
    newStatus
  ) => {

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
        await response.json();

      setOrders(prev =>
        prev.map(order =>
          order._id === id
            ? updatedOrder
            : order
        )
      );

    } catch (err) {

      console.log(err);

      alert("Failed to update order");

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
        <div className="mb-10">

          <h1 className="text-4xl font-bold text-[#2d1e1e]">
            Order Management
          </h1>

          <p className="text-gray-500 mt-2">
            Track and manage customer orders.
          </p>

        </div>

        {/* EMPTY */}
        {orders.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-sm border border-[#eee] p-16 text-center">

            <Coffee
              size={48}
              className="mx-auto text-gray-300 mb-4"
            />

            <h2 className="text-2xl font-bold mb-2">
              No Orders Yet
            </h2>

            <p className="text-gray-500">
              Incoming orders will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {orders.map((order) => (

                <div
                  key={order._id}
                  className="bg-white rounded-3xl shadow-sm border border-[#eee] overflow-hidden"
                >

                  {/* TOP */}
                  <div className="bg-[#f8f3ef] px-8 py-5 flex justify-between items-center flex-wrap gap-4">

                    <div>

                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <h2 className="font-bold text-lg text-[#2d1e1e]">
                        #{order._id?.slice(-6).toUpperCase()}
                      </h2>

                    </div>

                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(order.status)}`}
                    >

                      {getStatusIcon(order.status)}

                      {order.status}

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
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="border border-[#ddd] px-4 py-3 rounded-xl bg-white"
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
