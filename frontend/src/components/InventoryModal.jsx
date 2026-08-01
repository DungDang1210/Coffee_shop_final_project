import { useState } from "react";

export default function InventoryModal({

    open,

    title,

    onClose,

    onConfirm

}) {

    const [quantity, setQuantity] = useState("");

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6">

                <h2 className="text-2xl font-bold mb-5">

                    {title}

                </h2>

                <input

                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e)=>{

                    const value = Number(e.target.value);

                    if(value < 1){

                        setQuantity("");

                        return;

                    }

                    setQuantity(value);

                }}

                    placeholder="Enter quantity"

                    className="w-full border rounded-xl px-4 py-3 mb-6"

                />

                <div className="flex justify-end gap-3">

                    <button

                        onClick={onClose}

                        className="px-5 py-2 rounded-xl border"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={() => {

                            onConfirm(Number(quantity));

                            setQuantity("");

                        }}

                        className="bg-[#6F4E37] text-white px-5 py-2 rounded-xl"

                    >

                        Confirm

                    </button>

                </div>

            </div>

        </div>

    );

}