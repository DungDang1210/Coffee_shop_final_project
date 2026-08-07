import {
    Plus,
    Search,
    Upload,
    HelpCircle
} from "lucide-react";

export default function ProductToolbar({

    search,
    setSearch,

    category,
    setCategory,

    // real categories, derived from the products
    // themselves. The old hard-coded list had
    // "Food" and "Dessert Drink", which match no
    // product, while the real "Sweet" and
    // "Bakery" were missing.
    categories = [],

    counts = {},

    onAdd,

    onImport,

    onGuide

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

                    title="Filter by the category saved on each product"

                    className="border rounded-xl px-4 py-3"

                >

                    <option value="All">
                        All categories ({counts.All || 0})
                    </option>

                    {categories.map(cat => (

                        <option key={cat} value={cat}>
                            {cat} ({counts[cat] || 0})
                        </option>

                    ))}

                </select>

            </div>

            {/* RIGHT */}

            <div className="flex gap-3">

                {/* how to build the file */}
                <button

                    onClick={onGuide}

                    title="Excel format guide + template"

                    className="flex items-center gap-2 border border-green-300 text-green-700 px-4 py-3 rounded-xl hover:bg-green-50 transition"

                >

                    <HelpCircle size={18}/>

                    Format guide

                </button>

                <button

                    onClick={onImport}

                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition"

                >

                    <Upload size={18}/>

                    Import Excel

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