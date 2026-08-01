import { 
    X,
    Upload,
    Image as ImageIcon
} from "lucide-react";

import { useState } from "react";


const subCategories = {

    Coffee:[
        "Espresso",
        "Americano",
        "Latte",
        "Cappuccino",
        "Mocha",
        "Macchiato",
        "Cold Brew"
    ],

    Tea:[
        "Green Tea",
        "Black Tea",
        "Fruit Tea",
        "Milk Tea"
    ],

    Smoothie:[
        "Mango",
        "Berry",
        "Avocado",
        "Banana"
    ],

    Juice:[
        "Orange Juice",
        "Apple Juice",
        "Passion Fruit"
    ],

    Soda:[
        "Italian Soda",
        "Sparkling Soda"
    ],

    Chocolate:[
        "Hot Chocolate",
        "Chocolate Drink"
    ],

    "Dessert Drink":[
        "Frappé",
        "Milkshake",
        "Chocolate"
    ],

    Food:[
        "Cake",
        "Pastry",
        "Bread",
        "Vietnamese Bread"
    ]

};


export default function ProductModal({

    open,

    form,

    setForm,

    editing,

    onClose,

    onSave

}){


    const [drag,setDrag]=useState(false);


    if(!open) return null;



    const handleImage=(file)=>{


        if(!file) return;


        const reader =
            new FileReader();


        reader.onloadend=()=>{


            setForm({

                ...form,

                image:reader.result

            });


        };


        reader.readAsDataURL(file);


    };



    const handleDrop=(e)=>{


        e.preventDefault();

        setDrag(false);


        handleImage(
            e.dataTransfer.files[0]
        );


    };



    const updateCategory=(value)=>{


        setForm({

            ...form,

            category:value,

            subcategory:
                subCategories[value][0]

        });


    };



return (

<div
className="
fixed inset-0 
bg-black/50
flex items-center justify-center
z-50
px-4
"
>


<div
className="
bg-white
rounded-3xl
shadow-2xl
w-full
max-w-5xl
max-h-[90vh]
overflow-y-auto
p-8
"
>


{/* HEADER */}

<div
className="
flex
justify-between
items-center
mb-8
"
>


<h2
className="
text-3xl
font-bold
text-[#3a2c2a]
"
>

{
editing
?
"Edit Product"
:
"Add Product"
}

</h2>


<button
onClick={onClose}
>

<X size={28}/>

</button>


</div>





<div
className="
grid
grid-cols-1
md:grid-cols-5
gap-8
"
>



{/* IMAGE */}
<div className="col-span-2 mt-2">

  <h3 className="text-sm font-semibold text-gray-600 mb-3">
    Product Image
  </h3>

    <div
        className={`
        border-2 border-dashed
        rounded-2xl
        p-6
        flex
        flex-col
        items-center
        transition

        ${
            drag
            ? "border-[#6b4f4f] bg-[#fdf7f2]"
            : "border-gray-300"
        }
        `}

        onDragOver={(e)=>{

            e.preventDefault();

            setDrag(true);

        }}

        onDragLeave={()=>{

            setDrag(false);

        }}

        onDrop={handleDrop}
    >

    <img
        src={
            form.image ||
            "https://placehold.co/300x220?text=Preview"
        }
        alt="preview"
        className="w-72 h-52 object-cover rounded-xl shadow mb-5"
    />

    <label className="cursor-pointer bg-[#6b4f4f] text-white px-5 py-3 rounded-xl hover:bg-[#5a4040] transition">

      Choose Image

        <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e)=>
                handleImage(e.target.files[0])
            }
        />

    </label>

    <p className="text-xs text-gray-400 mt-3">
      JPG • PNG • WEBP
    </p>

  </div>

</div>





{/* FORM */}

<div
className="
md:col-span-2
grid
grid-cols-2
gap-5
"
>



<input

className="
border
rounded-xl
p-3
"

placeholder="Product Name"

value={form.name}

onChange={(e)=>

setForm({

...form,

name:e.target.value

})

}

/>



<input

type="number"

className="
border
rounded-xl
p-3
"

placeholder="Price"

value={form.price}

onChange={(e)=>

setForm({

...form,

price:e.target.value

})

}

/>





<select

className="
border
rounded-xl
p-3
"

value={form.category}

onChange={(e)=>
updateCategory(e.target.value)
}

>

{

Object.keys(subCategories)
.map(item=>(

<option key={item}>

{item}

</option>

))

}


</select>





<select

className="
border
rounded-xl
p-3
"

value={form.subcategory}

onChange={(e)=>

setForm({

...form,

subcategory:e.target.value

})

}

>

{

subCategories[form.category]
?.map(item=>(

<option key={item}>

{item}

</option>

))

}


</select>




<textarea

className="
border
rounded-xl
p-3
col-span-2
"

rows="4"

placeholder="Description"

value={form.description}

onChange={(e)=>

setForm({

...form,

description:e.target.value

})

}

/>



{/* AI */}

<div
className="
col-span-2
bg-[#faf5f0]
rounded-2xl
p-5
"
>


<h3
className="
font-bold
mb-4
"
>

AI Recommendation Data

</h3>



<div
className="
grid
grid-cols-2
gap-4
"
>


<select

className="
border
rounded-xl
p-3
"

value={form.taste || ""}

onChange={(e)=>

setForm({

...form,

taste:e.target.value

})

}

>

<option value="">
Taste
</option>

<option>
Sweet
</option>

<option>
Bitter
</option>

<option>
Fruity
</option>

<option>
Chocolate
</option>


</select>




<select

className="
border
rounded-xl
p-3
"

value={form.temperature || "Cold"}

onChange={(e)=>

setForm({

...form,

temperature:e.target.value

})

}

>

<option value="Hot">
🔥 Hot
</option>

<option value="Warm">
☕ Warm
</option>

<option value="Cold">
🧊 Cold
</option>


</select>



</div>


</div>


</div>


</div>





{/* BUTTON */}

<div
className="
flex
justify-end
gap-4
mt-8
"
>


<button

onClick={onClose}

className="
px-6
py-3
rounded-xl
border
"

>

Cancel

</button>


<button

onClick={onSave}

className="
px-8
py-3
rounded-xl
bg-[#6b4f4f]
text-white
font-semibold
hover:bg-[#553838]
"

>

{

editing
?
"Update Product"
:
"Create Product"

}


</button>



</div>


</div>


</div>


);


}