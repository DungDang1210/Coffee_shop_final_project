import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  Coffee
} from "lucide-react";


export default function Reports({
  orders = []
}) {


  const formatPrice = (price)=>{

    return Number(price || 0)
    .toLocaleString("vi-VN")
    +" ₫";

  };


  // =====================
  // BASIC STATS
  // =====================

  const totalOrders =
    orders.length;


  const totalRevenue =
    orders.reduce(
      (sum,order)=>
        sum + Number(order.total || 0),
      0
    );


  const pendingOrders =
    orders.filter(
      order =>
      order.status==="Pending"
    ).length;


  const completedOrders =
    orders.filter(
      order =>
      order.status==="Completed"
    ).length;



  // =====================
  // TODAY SALES
  // =====================

  const today =
    new Date()
    .toISOString()
    .slice(0,10);



  const todayOrders =
    orders.filter(order=>{

      const date =
      new Date(order.createdAt)
      .toISOString()
      .slice(0,10);


      return date===today;

    });



  const todayRevenue =
    todayOrders.reduce(
      (sum,order)=>
      sum + Number(order.total || 0),
      0
    );



  // =====================
  // TOP PRODUCTS
  // =====================

  const productSales={};


  orders.forEach(order=>{

    order.items?.forEach(item=>{


      if(!productSales[item.name]){

        productSales[item.name]=0;

      }


      productSales[item.name]
      += item.quantity;


    });


  });



  const topProducts =
    Object.entries(productSales)
    .sort(
      (a,b)=>b[1]-a[1]
    )
    .slice(0,5);



  return (

<div className="space-y-10">


{/* HEADER */}

<div>

<h1 className="text-4xl font-bold text-[#2d1e1e]">

Reports Dashboard

</h1>


<p className="text-gray-500 mt-2">

Overview of coffee shop performance and sales analytics.

</p>

</div>



{/* KPI CARDS */}

<div className="
grid
md:grid-cols-2
xl:grid-cols-4
gap-6
">


<Card
icon={<ShoppingBag/>}
title="Total Orders"
value={totalOrders}
color="bg-blue-100 text-blue-600"
/>


<Card
icon={<DollarSign/>}
title="Total Revenue"
value={formatPrice(totalRevenue)}
color="bg-green-100 text-green-600"
/>


<Card
icon={<Clock/>}
title="Pending Orders"
value={pendingOrders}
color="bg-yellow-100 text-yellow-600"
/>


<Card
icon={<CheckCircle/>}
title="Completed Orders"
value={completedOrders}
color="bg-purple-100 text-purple-600"
/>


</div>




{/* TODAY ANALYTICS */}


<div className="
grid
md:grid-cols-2
gap-6
">


<div className="
bg-white
rounded-3xl
shadow-sm
border
p-8
">


<div className="flex items-center gap-3 mb-5">

<div className="
p-3
rounded-xl
bg-[#f5eee8]
text-[#6b4f4f]
">

<TrendingUp/>

</div>


<h2 className="text-xl font-bold">

Today's Performance

</h2>


</div>



<div className="space-y-4">


<div className="flex justify-between">

<span className="text-gray-500">

Orders Today

</span>


<strong>

{todayOrders.length}

</strong>


</div>



<div className="flex justify-between">

<span className="text-gray-500">

Revenue Today

</span>


<strong className="text-green-600">

{formatPrice(todayRevenue)}

</strong>


</div>


</div>


</div>





{/* TOP PRODUCT */}


<div className="
bg-white
rounded-3xl
shadow-sm
border
p-8
">


<div className="flex items-center gap-3 mb-5">

<div className="
p-3
rounded-xl
bg-[#f5eee8]
text-[#6b4f4f]
">

<Coffee/>

</div>


<h2 className="text-xl font-bold">

Top Selling Products

</h2>


</div>



<div className="space-y-4">


{
topProducts.length===0

?

<p className="text-gray-400">

No sales data

</p>

:

topProducts.map(
([name,count],index)=>(

<div
key={name}
className="
flex
justify-between
items-center
border-b
pb-3
"
>


<div className="flex gap-3">


<span className="
font-bold
text-[#6b4f4f]
">

#{index+1}

</span>


<span>

{name}

</span>


</div>


<span className="font-semibold">

{count} sold

</span>


</div>


))

}



</div>


</div>


</div>



</div>

  );

}




function Card({
icon,
title,
value,
color
}){


return (

<div className="
bg-white
rounded-3xl
shadow-sm
border
p-6
">


<div className="
flex
justify-between
items-center
">


<div
className={`
p-4
rounded-2xl
${color}
`}
>

{icon}

</div>


</div>


<p className="text-gray-500 mt-5">

{title}

</p>


<h2 className="
text-3xl
font-bold
mt-2
text-[#2d1e1e]
">

{value}

</h2>



</div>

);

}