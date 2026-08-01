import {
    Pencil,
    Trash2,
    Plus,
    Minus
} from "lucide-react";

export default function InventoryTable({

    ingredients,

    onEdit,

    onDelete,

    onStock

}){

    const getStatusColor=(status)=>{

        switch(status){

            case "Available":
                return "bg-green-100 text-green-700";

            case "Low Stock":
                return "bg-yellow-100 text-yellow-700";

            case "Out of Stock":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";

        }

    };

    return(

        <div className="bg-white rounded-3xl shadow overflow-hidden">

            <table className="w-full table-fixed">

                <thead className="bg-[#faf7f4]">
                    <tr>
                        <th className="w-[34%] p-5 text-left font-semibold">
                            Ingredient
                        </th>

                        <th className="w-[15%] text-center font-semibold">
                            Category
                        </th>

                        <th className="w-[10%] text-center font-semibold">
                            Stock
                        </th>

                        <th className="w-[12%] text-center font-semibold">
                            Unit
                        </th>

                        <th className="w-[14%] text-center font-semibold">
                            Status
                        </th>

                        <th className="w-[15%] text-center font-semibold">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {ingredients.map((item) => (
                        <tr
                            key={item._id}
                            className="border-t hover:bg-[#fcfaf8] transition"
                        >

                            <td className="p-5">
                                <div>
                                    <p className="font-semibold text-[16px]">
                                        {item.name}
                                    </p>

                                    <p className="text-sm text-gray-400">
                                        {item.supplier}
                                    </p>
                                </div>
                            </td>

                            <td className="text-center">
                                {item.category}
                            </td>

                            <td className="text-center">
                                <span className="font-bold text-lg">
                                    {item.stock}
                                </span>
                            </td>

                            <td className="text-center capitalize">
                                {item.unit}
                            </td>

                            <td className="text-center">
                                <span
                                    className={`inline-flex px-4 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}
                                >
                                    {item.status}
                                </span>
                            </td>

                            <td>
                                <div className="flex justify-center items-center gap-3">

                                    <button
                                        onClick={() => onStock(item, "import")}
                                        className="
                                        h-10
                                        w-10
                                        rounded-lg
                                        border
                                        border-green-200
                                        bg-green-50
                                        text-green-600
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-green-100
                                        transition-all
                                        duration-200
                                        shadow-sm
                                        "
                                    >
                                        <Plus strokeWidth={2.5} size={18}/>
                                    </button>

                                    <button
                                        onClick={() => onStock(item, "export")}
                                        className="
                                        h-10
                                        w-10
                                        rounded-lg
                                        border
                                        border-yellow-200
                                        bg-yellow-50
                                        text-yellow-600
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-yellow-100
                                        transition-all
                                        duration-200
                                        shadow-sm
                                        "
                                    >
                                        <Minus strokeWidth={2.5} size={18}/>
                                    </button>

                                    <button
                                        onClick={() => onEdit(item)}
                                        className="
                                        h-10
                                        w-10
                                        rounded-lg
                                        border
                                        border-blue-200
                                        bg-blue-50
                                        text-blue-600
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-blue-100
                                        transition-all
                                        duration-200
                                        shadow-sm
                                        "
                                    >
                                        <Pencil strokeWidth={2.2} size={18}/>
                                    </button>

                                    <button
                                        onClick={() => onDelete(item)}
                                        className="
                                        h-10
                                        w-10
                                        rounded-lg
                                        border
                                        border-red-200
                                        bg-red-50
                                        text-red-600
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-red-100
                                        transition-all
                                        duration-200
                                        shadow-sm
                                        "
                                    >
                                        <Trash2 strokeWidth={2.2} size={18}/>
                                    </button>
                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}