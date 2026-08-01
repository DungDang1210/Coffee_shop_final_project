import {
    Boxes,
    AlertTriangle,
    PackageCheck,
    PackageX
} from "lucide-react";

export default function InventoryStats({ inventory }) {

    const totalItems = inventory.length;

    const available = inventory.filter(
        item => item.status === "Available"
    ).length;

    const lowStock = inventory.filter(
        item => item.status === "Low Stock"
    ).length;

    const outStock = inventory.filter(
        item => item.status === "Out of Stock"
    ).length;

    const totalStock = inventory.reduce(
        (sum, item) => sum + item.stock,
        0
    );

    const cards = [

        {
            title: "Ingredients",
            value: totalItems,
            icon: Boxes,
            color: "bg-blue-100 text-blue-600"
        },

        {
            title: "Total Stock",
            value: totalStock,
            icon: PackageCheck,
            color: "bg-green-100 text-green-600"
        },

        {
            title: "Low Stock",
            value: lowStock,
            icon: AlertTriangle,
            color: "bg-yellow-100 text-yellow-600"
        },

        {
            title: "Out Of Stock",
            value: outStock,
            icon: PackageX,
            color: "bg-red-100 text-red-600"
        }

    ];

    return (

        <div className="grid grid-cols-4 gap-6 mb-8">

            {

                cards.map((card, index) => {

                    const Icon = card.icon;

                    return (

                        <div
                            key={index}
                            className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition"
                        >

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-gray-500 text-sm">

                                        {card.title}

                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">

                                        {card.value}

                                    </h2>

                                </div>

                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color}`}
                                >

                                    <Icon size={28} />

                                </div>

                            </div>

                        </div>

                    );

                })

            }

        </div>

    );

}