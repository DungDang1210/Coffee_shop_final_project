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

const inputClass =
    "border rounded-xl p-3 w-full outline-none focus:ring-2 focus:ring-[#6b4f4f]";


// label + greyed hint, so a numeric box always
// says what it is even once it has a value in it
function Field({
    label,
    hint,
    required,
    children
}){

    return (

        <div>

            <label className="block text-sm font-semibold text-[#3a2c2a] mb-1">

                {label}

                {required && (
                    <span className="text-red-500"> *</span>
                )}

            </label>

            {children}

            {hint && (

                <p className="text-xs text-gray-400 mt-1">
                    {hint}
                </p>

            )}

        </div>

    );

}


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

{/* Every field now carries a permanent label.
    Placeholders alone disappeared the moment a
    value was typed, so a row of bare numbers gave
    the admin no idea what they meant. */}

<Field
label="Ingredient name"
hint="What you order from the supplier"
required
>

<input

className={inputClass}

placeholder="e.g. Arabica beans"

value={form.name}

onChange={(e)=>

setForm({

...form,

name:e.target.value

})

}

/>

</Field>

<Field
label="Category"
hint="Groups it in the inventory list"
>

<select

className={inputClass}

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

</Field>

<Field
label="Supplier"
hint="Optional — who you buy it from"
>

<input

className={inputClass}

placeholder="e.g. Đắk Lắk Farm"

value={form.supplier}

onChange={(e)=>

setForm({

...form,

supplier:e.target.value

})

}

/>

</Field>

<Field
label="Unit"
hint="How this ingredient is measured"
>

<select

className={inputClass}

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

</Field>

<Field
label={`Current stock${form.unit ? ` (${form.unit})` : ""}`}
hint="How much you have on hand right now"
>

<input

type="number"

min="0"

className={inputClass}

placeholder="0"

value={form.stock}

onChange={(e)=>

setForm({

...form,

stock:e.target.value

})

}

/>

</Field>

<Field
label={`Minimum stock${form.unit ? ` (${form.unit})` : ""}`}
hint="Drop to this level and it flags Low Stock"
>

<input

type="number"

min="0"

className={inputClass}

placeholder="5"

value={form.minStock}

onChange={(e)=>

setForm({

...form,

minStock:e.target.value

})

}

/>

</Field>

<Field
label={`Cost price per ${form.unit || "unit"}`}
hint="What you pay your supplier"
>

<div className="relative">

{/* was "$" — the shop prices in dong */}
<span className="absolute right-4 top-3 text-gray-400 pointer-events-none">

₫

</span>

<input

type="number"

min="0"

className={`${inputClass} pr-9`}

placeholder="0"

value={form.costPrice}

onChange={(e)=>

setForm({

...form,

costPrice:e.target.value

})

}

/>

</div>

{Number(form.costPrice) > 0 && (

<p className="text-xs text-gray-500 mt-1">
  = {Number(form.costPrice).toLocaleString("vi-VN")} ₫
  {" per "}{form.unit || "unit"}
</p>

)}

</Field>

<Field
label="Storage location"
hint="Where it is kept"
>

<select

className={inputClass}

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

</Field>

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