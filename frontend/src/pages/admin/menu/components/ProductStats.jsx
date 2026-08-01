import {
    Coffee,
    Package,
    CheckCircle2,
    XCircle
} from "lucide-react";

export default function ProductStats({ products }) {

    const total = products.length;

    const available = products.filter(
        p => p.available
    ).length;

    const unavailable = total - available;

    const categories = new Set(
        products.map(
            p => p.category
        )
    ).size;

    const cards = [

        {
            title: "Total Products",
            value: total,
            icon: Coffee,
            color: "bg-[#6b4f4f]"
        },

        {
            title: "Available",
            value: available,
            icon: CheckCircle2,
            color: "bg-green-500"
        },

        {
            title: "Out of Stock",
            value: unavailable,
            icon: XCircle,
            color: "bg-red-500"
        },

        {
            title: "Categories",
            value: categories,
            icon: Package,
            color: "bg-blue-500"
        }

    ];

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            {

                cards.map((card,index)=>{

                    const Icon=card.icon;

                    return(

                        <div

                            key={index}

                            className="bg-white rounded-3xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition"

                        >

                            <div>

                                <p className="text-gray-500 text-sm">

                                    {card.title}

                                </p>

                                <h2 className="text-4xl font-black mt-2">

                                    {card.value}

                                </h2>

                            </div>

                            <div

                                className={`${card.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white`}

                            >

                                <Icon size={32}/>

                            </div>

                        </div>

                    );

                })

            }

        </div>

    );

}