import {
    Search,
    Plus,
    Upload,
    History
} from "lucide-react";

const categories = [

    "All",
    "Coffee",
    "Milk",
    "Fruit",
    "Syrup",
    "Powder",
    "Bakery",
    "Tea",
    "Herb"

];

export default function InventoryToolbar({

    search,
    setSearch,

    category,
    setCategory,

    onAdd,
    onImport,
    onHistory

}) {

    return (

        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-5 mb-8">

            <div className="flex flex-wrap gap-4 items-center justify-between">

                {/* LEFT */}

                <div className="flex flex-wrap gap-4 items-center">

                    {/* SEARCH */}

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input

                            type="text"

                            placeholder="Search ingredient..."

                            value={search}

                            onChange={(e)=>setSearch(e.target.value)}

                            className="
                            pl-11
                            pr-4
                            py-3
                            w-72
                            rounded-xl
                            border
                            border-gray-200
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#6b4f4f]
                            "

                        />

                    </div>

                    {/* CATEGORY */}

                    <select

                        value={category}

                        onChange={(e)=>setCategory(e.target.value)}

                        className="
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-gray-200
                        focus:ring-2
                        focus:ring-[#6b4f4f]
                        "

                    >

                        {

                            categories.map(item=>(

                                <option
                                    key={item}
                                    value={item}
                                >

                                    {item}

                                </option>

                            ))

                        }

                    </select>

                </div>

                {/* RIGHT */}

                <div className="flex gap-3">

                    <button

                        onClick={onHistory}

                        className="
                        flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        border
                        hover:bg-gray-50
                        transition
                        "

                    >

                        <History size={18}/>

                        History

                    </button>

                    <button

                        onClick={onImport}

                        className="
                        flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        bg-emerald-600
                        hover:bg-emerald-700
                        text-white
                        transition
                        "

                    >

                        <Upload size={18}/>

                        Import Excel

                    </button>

                    <button

                        onClick={onAdd}

                        className="
                        flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        bg-[#6b4f4f]
                        hover:bg-[#553d3d]
                        text-white
                        transition
                        "

                    >

                        <Plus size={18}/>

                        Add Ingredient

                    </button>

                </div>

            </div>

        </div>

    );

}