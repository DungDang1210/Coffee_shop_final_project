import {
    Plus,
    Search,
    Upload,
    Download
} from "lucide-react";

export default function ProductToolbar({

    search,
    setSearch,

    category,
    setCategory,

    onAdd,

    onImport

}) {

    return (

        <div className="bg-white rounded-3xl shadow p-6 mb-8 flex flex-wrap items-center justify-between gap-5">

            {/* LEFT */}

            <div className="flex flex-wrap gap-4 items-center">

                {/* SEARCH */}

                <div className="relative">

                    <Search
                        className="absolute left-4 top-3.5 text-gray-400"
                        size={18}
                    />

                    <input

                        value={search}

                        onChange={(e)=>
                            setSearch(e.target.value)
                        }

                        placeholder="Search product..."

                        className="pl-11 pr-4 py-3 w-72 border rounded-xl outline-none focus:ring-2 focus:ring-[#6b4f4f]"

                    />

                </div>

                {/* CATEGORY */}

                <select

                    value={category}

                    onChange={(e)=>
                        setCategory(e.target.value)
                    }

                    className="border rounded-xl px-4 py-3"

                >

                    <option>All</option>

                    <option>Coffee</option>

                    <option>Tea</option>

                    <option>Juice</option>

                    <option>Smoothie</option>

                    <option>Soda</option>

                    <option>Food</option>

                    <option>Dessert Drink</option>

                </select>

            </div>

            {/* RIGHT */}

            <div className="flex gap-3">

                <button

                    onClick={onImport}

                    className="flex items-center gap-2 border px-5 py-3 rounded-xl hover:bg-gray-50"

                >

                    <Upload size={18}/>

                    Import Excel

                </button>

                <button

                    className="flex items-center gap-2 border px-5 py-3 rounded-xl hover:bg-gray-50"

                >

                    <Download size={18}/>

                    Export

                </button>

                <button

                    onClick={onAdd}

                    className="flex items-center gap-2 bg-[#6b4f4f] text-white px-5 py-3 rounded-xl hover:bg-[#5a3f3f]"

                >

                    <Plus size={18}/>

                    Add Product

                </button>

            </div>

        </div>

    )

}