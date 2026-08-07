import {
    Trash2,
    X,
    TriangleAlert
} from "lucide-react";


export default function DeleteIngredientModal({

    open,

    item,

    deleting,

    onClose,

    onConfirm

}) {

    if (!open || !item?._id) return null;

    const stock = Number(item.stock) || 0;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[480px] p-8">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold text-[#6b4f4f]">
                        Delete Ingredient
                    </h2>

                    <button
                        onClick={onClose}
                        disabled={deleting}
                        className="text-gray-500 hover:text-black disabled:opacity-50"
                    >
                        <X />
                    </button>

                </div>

                <div className="flex items-start gap-5 mb-6">

                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shrink-0">

                        <Trash2
                            className="text-red-600"
                            size={28}
                        />

                    </div>

                    <div className="min-w-0">

                        <p className="font-semibold text-lg">

                            Delete{" "}

                            <span className="text-[#6b4f4f]">
                                {item.name}
                            </span>

                            ?

                        </p>

                        <p className="text-gray-500 mt-2 text-sm">
                            This removes the ingredient from
                            inventory. Its stock history is
                            kept, but the item itself cannot
                            be restored.
                        </p>

                    </div>

                </div>

                {/* WHAT IS BEING LOST */}
                <div className="bg-[#faf7f4] rounded-2xl p-4 mb-6 space-y-2 text-sm">

                    <Row
                        label="Category"
                        value={item.category}
                    />

                    <Row
                        label="Current stock"
                        value={`${stock} ${item.unit || ""}`}
                    />

                    <Row
                        label="Supplier"
                        value={item.supplier || "Unknown"}
                    />

                    <Row
                        label="Location"
                        value={item.location || "—"}
                    />

                </div>

                {/* STOCK STILL ON HAND */}
                {stock > 0 && (

                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl px-4 py-3 mb-6 text-sm">

                        <TriangleAlert
                            size={18}
                            className="shrink-0 mt-0.5"
                        />

                        <span>
                            There are still{" "}
                            <strong>
                                {stock} {item.unit}
                            </strong>{" "}
                            on hand. Consider exporting the
                            stock first so your history stays
                            accurate.
                        </span>

                    </div>

                )}

                <div className="flex justify-end gap-4">

                    <button
                        onClick={onClose}
                        disabled={deleting}
                        className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onConfirm(item._id)}
                        disabled={deleting}
                        className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>

        </div>

    );

}


function Row({ label, value }) {

    return (

        <div className="flex justify-between gap-4">

            <span className="text-gray-500">
                {label}
            </span>

            <span className="font-medium text-[#2d1e1e] truncate">
                {value}
            </span>

        </div>

    );

}
