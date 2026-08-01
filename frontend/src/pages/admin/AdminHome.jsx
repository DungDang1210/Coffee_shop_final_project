import {
  ShoppingBag,
  DollarSign,
  Coffee,
  Clock3,
  TrendingUp,
  Star,
  CheckCircle
} from "lucide-react";


export default function AdminHome({
  orders = []
}) {


  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );


  const pendingOrders =
    orders.filter(
      o => o.status === "Pending"
    ).length;


  const preparingOrders =
    orders.filter(
      o => o.status === "Preparing"
    ).length;


  const completedOrders =
    orders.filter(
      o => o.status === "Completed"
    ).length;



  const todayRevenue =
    orders
    .filter(order => {

      if(!order.date)
        return false;


      return (
        new Date(order.date)
        .toLocaleDateString()
        ===
        new Date()
        .toLocaleDateString()
      );

    })
    .reduce(
      (sum,order)=>
        sum + Number(order.total || 0),
      0
    );



  const allItems =
    orders.flatMap(
      order => order.items || []
    );


  const productCount = {};


  allItems.forEach(item=>{

    productCount[item.name] =
      (productCount[item.name] || 0)
      +
      Number(
        item.qty ||
        item.quantity ||
        0
      );

  });


  const topProduct =
    Object.entries(productCount)
    .sort(
      (a,b)=>b[1]-a[1]
    )[0];



  return (

    <div>


      {/* HEADER */}

      <div className="mb-8 flex justify-between items-center">

        <div>

          <h1 className="
          text-4xl
          font-bold
          text-[#2d1e1e]
          ">
            Welcome back, Admin ☕
          </h1>


          <p className="
          text-gray-500
          mt-2
          ">
            Coffee shop performance overview
          </p>

        </div>


        <div className="
        bg-[#f8f3ef]
        px-5
        py-3
        rounded-2xl
        text-[#6b4f4f]
        font-semibold
        ">
          Today
        </div>


      </div>




      {/* STAT CARDS */}

      <div className="
      grid
      md:grid-cols-4
      gap-5
      mb-8
      ">


        <DashboardCard
          title="Revenue"
          value={
            `${totalRevenue.toLocaleString("vi-VN")} ₫`
          }
          icon={<DollarSign/>}
          color="green"
        />



        <DashboardCard
          title="Orders"
          value={orders.length}
          icon={<ShoppingBag/>}
          color="blue"
        />



        <DashboardCard
          title="Pending"
          value={pendingOrders}
          icon={<Clock3/>}
          color="yellow"
        />



        <DashboardCard
          title="Completed"
          value={completedOrders}
          icon={<CheckCircle/>}
          color="purple"
        />


      </div>

      {/* INSIGHTS */}

      <div className="
      grid
      lg:grid-cols-2
      gap-8
      ">



        {/* BEST PRODUCT */}

        <div className="
        bg-[#6b4f4f]
        text-white
        rounded-3xl
        p-8
        shadow-lg
        ">


          <div className="
          flex
          gap-3
          items-center
          mb-4
          ">

            <Star className="text-yellow-300"/>


            <h2 className="text-xl font-bold">
              Best Selling Product
            </h2>

          </div>



          {
            topProduct
            ?

            <>

            <h3 className="
            text-3xl
            font-bold
            ">
              {topProduct[0]}
            </h3>


            <p className="text-gray-200 mt-2">
              Sold {topProduct[1]} items
            </p>

            </>

            :

            <p>
              No sales data yet
            </p>

          }


        </div>






        {/* SUMMARY */}

        <div className="
        bg-white
        rounded-3xl
        p-8
        border
        shadow-sm
        ">


          <h2 className="
          text-xl
          font-bold
          mb-6
          ">
            Performance Summary
          </h2>


          <SummaryRow
            label="Total Orders"
            value={orders.length}
          />


          <SummaryRow
            label="Preparing"
            value={preparingOrders}
          />


          <SummaryRow
            label="Completion Rate"
            value={
              orders.length
              ?
              `${Math.round(
                completedOrders/orders.length*100
              )}%`
              :
              "0%"
            }
          />


        </div>


      </div>







      {/* RECENT ORDERS */}

      <div className="
      mt-10
      bg-white
      rounded-3xl
      p-8
      border
      ">


        <h2 className="
        text-2xl
        font-bold
        mb-6
        ">
          Recent Orders
        </h2>



        {
          orders.length === 0

          ?

          <p className="text-gray-500">
            No recent orders available
          </p>


          :

          <div className="space-y-4">

          {
            orders
            .slice()
            .reverse()
            .slice(0,5)
            .map(order=>(


              <div
              key={order._id}
              className="
              flex
              justify-between
              bg-[#faf7f3]
              rounded-xl
              p-4
              "
              >


                <div>

                  <p className="font-semibold">
                    Order #{order._id?.slice(-6).toUpperCase()}
                  </p>


                  <p className="text-sm text-gray-500">
                    {order.status}
                  </p>

                </div>



                <p className="
                font-bold
                text-[#6b4f4f]
                ">

                {
                  Number(order.total || 0)
                  .toLocaleString("vi-VN")
                } ₫


                </p>


              </div>


            ))
          }

          </div>

        }


      </div>


    </div>

  );

}





function DashboardCard({
  title,
  value,
  icon,
  color
}) {


const colors={

green:
"bg-green-100 text-green-600",

blue:
"bg-blue-100 text-blue-600",

yellow:
"bg-yellow-100 text-yellow-600",

purple:
"bg-purple-100 text-purple-600"

};


return (

<div className="
bg-white
rounded-3xl
p-6
shadow-sm
border
hover:shadow-lg
transition
">


<div className={`
p-3
rounded-xl
w-fit
${colors[color]}
`}>

{icon}

</div>


<p className="
text-gray-500
mt-4
">

{title}

</p>


<h2 className="
text-3xl
font-bold
mt-2
">

{value}

</h2>


</div>

);

}




function SummaryRow({
label,
value
}){

return (

<div className="
flex
justify-between
py-3
border-b
">

<span className="text-gray-500">
{label}
</span>


<span className="font-bold">
{value}
</span>


</div>

);

}