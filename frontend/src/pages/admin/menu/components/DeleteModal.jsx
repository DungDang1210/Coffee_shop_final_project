import { Trash2, X } from "lucide-react";

export default function DeleteModal({

    open,

    product,

    deleting,

    onClose,

    onConfirm

}) {

    // guard: without an id there is nothing to
    // delete, and calling the API with `undefined`
    // silently fails
    if (!open || !product?._id) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl shadow-2xl w-[450px] p-8">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold text-[#6b4f4f]">

                        Delete Product

                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        <X />
                    </button>

                </div>

                <div className="flex items-center gap-5 mb-8">

                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">

                        <Trash2
                            className="text-red-600"
                            size={30}
                        />

                    </div>

                    <div>

                        <p className="font-semibold text-lg">

                            Delete

                            {" "}

                            <span className="text-[#6b4f4f]">

                                {product?.name}

                            </span>

                            ?

                        </p>

                        <p className="text-gray-500 mt-2">

                            This action cannot be undone.

                        </p>

                    </div>

                </div>

                <div className="flex justify-end gap-4">

                    <button

                        onClick={onClose}

                        disabled={deleting}

                        className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 disabled:opacity-50"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={() => onConfirm(product._id)}

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