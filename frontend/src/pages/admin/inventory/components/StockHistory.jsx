import {
    ArrowDownCircle,
    ArrowUpCircle,
    Trash2
} from "lucide-react";

import { useEffect, useState } from "react";


export default function StockHistory(){

    const [history,setHistory] = useState([]);

    const [filter,setFilter] = useState("All");


    const fetchHistory = async()=>{

        try{

            const res = await fetch(
                "http://localhost:5000/api/inventory/history/all"
            );


            const data = await res.json();


            setHistory(data);


        }
        catch(err){

            console.log(err);

        }

    };


    useEffect(()=>{

        fetchHistory();

    },[]);



    const filteredHistory = history.filter(item=>{

        if(filter==="All")
            return true;


        return item.action === filter;

    });



    const formatDate=(date)=>{

        return new Date(date)
        .toLocaleDateString("vi-VN");

    };



    const actionStyle=(action)=>{

        if(action==="IMPORT"){

            return {
                color:"text-green-700",
                bg:"bg-green-100",
                icon:<ArrowDownCircle size={18}/>
            };

        }


        return {

            color:"text-red-700",
            bg:"bg-red-100",
            icon:<ArrowUpCircle size={18}/>

        };

    };



    return (

<div>


    <div className="
        flex
        justify-between
        items-center
        mb-6
    ">


        <h2 className="
            text-2xl
            font-bold
        ">
            Stock History
        </h2>



        <select

            value={filter}

            onChange={(e)=>
                setFilter(e.target.value)
            }

            className="
            border
            rounded-xl
            px-4
            py-2
            "

        >

            <option value="All">
                All
            </option>

            <option value="IMPORT">
                Import
            </option>

            <option value="EXPORT">
                Export
            </option>


        </select>


    </div>




    <div className="
        bg-white
        rounded-3xl
        shadow
        overflow-hidden
    ">


<table className="w-full">


<thead className="bg-[#faf7f4]">


<tr>


<th className="p-5 text-left">
Ingredient
</th>


<th>
Action
</th>


<th>
Quantity
</th>


<th>
Unit
</th>


<th>
Date
</th>


<th>
Note
</th>


</tr>


</thead>



<tbody>


{
filteredHistory.map(item=>{


const style = actionStyle(item.action);



return (

<tr

key={item._id}

className="
border-t
hover:bg-[#fcfaf8]
"

>


<td className="p-5 font-semibold">

{item.ingredient}

</td>



<td>


<span

className={`
inline-flex
items-center
gap-2
px-4
py-1
rounded-full
text-sm
font-semibold
${style.bg}
${style.color}
`}

>

{style.icon}

{item.action}

</span>


</td>



<td className="text-center font-bold">

{item.quantity}

</td>



<td className="text-center">

{item.unit}

</td>



<td className="text-center">

{formatDate(item.createdAt)}

</td>



<td className="text-center text-gray-500">

{item.note}

</td>



</tr>


)


})

}


</tbody>



</table>


</div>


</div>


    );


}