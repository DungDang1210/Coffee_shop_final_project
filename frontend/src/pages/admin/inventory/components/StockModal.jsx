import {X} from "lucide-react";
import { useState, useEffect } from "react";


export default function StockModal({

open,
item,
type,
onClose,
onSubmit

}){


const [quantity,setQuantity]=useState(0);

useEffect(()=>{

    if(open){

        setQuantity(0);

    }

},[open]);


if(!open) return null;


return (

<div className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
flex
items-center
justify-center
z-50
">


<div className="
bg-white
rounded-3xl
p-8
w-[400px]
shadow-2xl
">


<div className="flex justify-between mb-6">


<h2 className="text-2xl font-bold">

{
type==="import"
?
"Import Stock"
:
"Export Stock"
}

</h2>


<button onClick={onClose}>

<X/>

</button>


</div>


<p className="mb-4">

{item.name}

</p>


<input

type="number"

min="1"

className="
border
rounded-xl
p-3
w-full
outline-none
focus:ring-2
focus:ring-[#6b4f4f]
"

placeholder="Quantity"

value={quantity}

onChange={(e)=>{

    const value = Number(e.target.value);

    if(value >= 0){

        setQuantity(value);

    }

}}

/>


<button

onClick={()=>{

    if(quantity <= 0){

        alert("Quantity must be greater than 0");

        return;

    }


    onSubmit(quantity);

}}

className={`
    mt-6
    w-full
    py-3
    rounded-xl
    font-semibold
    text-white
    transition
    shadow-md
    ${
        type==="import"
        ?
        "bg-green-600 hover:bg-green-700"
        :
        "bg-red-600 hover:bg-red-700"
    }
`}

>
Confirm
</button>


</div>

</div>

)

}