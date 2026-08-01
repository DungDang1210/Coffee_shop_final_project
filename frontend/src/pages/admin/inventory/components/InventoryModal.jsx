import { X } from "lucide-react";

const locations = [

"Main Warehouse",

"Cold Storage",

"Dry Storage",

"Kitchen",

"Bar Counter"

];

const categories = [
    "Coffee",
    "Milk",
    "Fruit",
    "Tea",
    "Powder",
    "Bakery",
    "Herb",
    "Syrup"
];

const units = [
    "kg",
    "g",
    "L",
    "ml",
    "pcs",
    "bundle",
    "bottle"
];

export default function InventoryModal({

    open,
    form,
    setForm,
    editing,
    onClose,
    onSave

}){

    if(!open) return null;

        const currentStatus = () => {

        const stock = Number(form.stock || 0);
        const min = Number(form.minStock || 0);

        if(stock <= 0)
            return "Out of Stock";

        if(stock <= min)
            return "Low Stock";

        return "Available";

    };

    const statusColor = () => {

        switch(currentStatus()){

            case "Available":
                return "bg-green-100 text-green-700";

            case "Low Stock":
                return "bg-yellow-100 text-yellow-700";

            case "Out of Stock":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100";

        }

    };

    return(

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl p-8">

<div className="flex justify-between items-center mb-8">

<h2 className="text-3xl font-bold">

{
editing
?
"Edit Ingredient"
:
"Add Ingredient"
}

</h2>

<button onClick={onClose}>

<X size={28}/>

</button>

</div>

<div className="grid grid-cols-2 gap-5">

<input

className="border rounded-xl p-3"

placeholder="Ingredient Name"

value={form.name}

onChange={(e)=>

setForm({

...form,

name:e.target.value

})

}

/>

<select

className="border rounded-xl p-3"

value={form.category}

onChange={(e)=>

setForm({

...form,

category:e.target.value

})

}

>

{

categories.map(item=>(

<option key={item}>

{item}

</option>

))

}

</select>

<input

className="border rounded-xl p-3"

placeholder="Supplier (optional)"

value={form.supplier}

onChange={(e)=>

setForm({

...form,

supplier:e.target.value

})

}

/>

<select

className="border rounded-xl p-3"

value={form.unit}

onChange={(e)=>

setForm({

...form,

unit:e.target.value

})

}

>

{

units.map(item=>(

<option key={item}>

{item}

</option>

))

}

</select>

<input

type="number"

className="border rounded-xl p-3"

placeholder="Initial Stock"

value={form.stock}

onChange={(e)=>

setForm({

...form,

stock:e.target.value

})

}

/>

<input

type="number"

className="border rounded-xl p-3"

placeholder="Minimum Stock"

value={form.minStock}

onChange={(e)=>

setForm({

...form,

minStock:e.target.value

})

}

/>

<div className="relative">

<span className="absolute left-4 top-3 text-gray-400">

$

</span>

<input

type="number"

className="border rounded-xl p-3 pl-8 w-full"

placeholder="Cost Price"

value={form.costPrice}

onChange={(e)=>

setForm({

...form,

costPrice:e.target.value

})

}

/>
</div>

<select

className="border rounded-xl p-3"

value={form.location}

onChange={(e)=>

setForm({

...form,

location:e.target.value

})

}

>

{

locations.map(item=>(

<option key={item}>

{item}

</option>

))

}

</select>

    <div className="col-span-2">

        <label className="text-sm text-gray-500">

            Current Status

        </label>

        <div className="mt-2">

            <span
                className={`
                inline-flex
                items-center
                px-4
                py-2
                rounded-full
                font-semibold
                text-sm
                shadow-sm
                ${statusColor()}
                `}

            >

                {currentStatus()}

            </span>

        </div>

    </div>

</div>

<div className="flex justify-end gap-4 mt-8">

<button

onClick={onClose}

className="px-6 py-3 rounded-xl border"

>

Cancel

</button>

<button

onClick={onSave}

className="bg-[#6b4f4f] text-white px-8 py-3 rounded-xl"

>

{

editing
?
"Update Ingredient"
:
"Create Ingredient"

}

</button>

</div>

</div>

</div>

    );

}