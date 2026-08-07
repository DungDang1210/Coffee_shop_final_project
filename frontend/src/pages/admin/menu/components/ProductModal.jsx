import {
    X,
    Sparkles,
    CircleAlert
} from "lucide-react";

import { useState } from "react";

import {
    CATEGORIES,
    subcategoryMap,
    TASTE_OPTIONS,
    TEMPERATURE_OPTIONS,
    CAFFEINE_LABELS,
    INTENSITY_LABELS
} from "../utils/menuConstants";


export default function ProductModal({

    open,

    form,

    setForm,

    editing,

    saving,

    error,

    onClose,

    onSave

}) {

    const [drag, setDrag] = useState(false);

    const [uploading, setUploading] =
        useState(false);

    const [imageError, setImageError] =
        useState("");

    if (!open) return null;


    const set = (patch) =>
        setForm({ ...form, ...patch });


    // Uploads as multipart and stores a URL.
    // Base64 in the product record bloats every
    // /api/products response for customers.
    const handleImage = async (file) => {

        if (!file) return;

        setImageError("");

        if (!file.type?.startsWith("image/")) {

            setImageError(
                "Please choose an image file."
            );

            return;

        }

        if (file.size > 5 * 1024 * 1024) {

            setImageError(
                "Image must be smaller than 5MB."
            );

            return;

        }

        setUploading(true);

        try {

            const body = new FormData();

            body.append("image", file);

            const res = await fetch(
                "http://localhost:5000/api/upload",
                {
                    method: "POST",
                    body
                }
            );

            const data =
                await res.json().catch(() => ({}));

            if (!res.ok || !data.imageUrl) {

                throw new Error(
                    data.message ||
                    "Upload failed"
                );

            }

            set({ image: data.imageUrl });

        }

        catch (err) {

            setImageError(err.message);

        }

        finally {

            setUploading(false);

        }

    };


    const handleDrop = (e) => {

        e.preventDefault();

        setDrag(false);

        handleImage(e.dataTransfer.files?.[0]);

    };


    const updateCategory = (value) => {

        const subs =
            subcategoryMap[value] || [];

        set({
            category: value,
            subcategory: subs[0] || ""
        });

    };


    const inputClass =
        "border rounded-xl p-3 w-full outline-none focus:ring-2 focus:ring-[#6b4f4f]";

    const labelClass =
        "block text-sm font-semibold text-gray-600 mb-1.5";


    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-8">

                    <div>

                        <h2 className="text-3xl font-bold text-[#3a2c2a]">
                            {editing ? "Edit Product" : "Add Product"}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Fields under “AI Recommendation
                            Profile” drive what customers
                            get suggested.
                        </p>

                    </div>

                    <button onClick={onClose}>
                        <X size={28} />
                    </button>

                </div>

                {/* ERROR */}
                {(error || imageError) && (

                    <div
                        role="alert"
                        className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm"
                    >

                        <CircleAlert
                            size={18}
                            className="shrink-0 mt-0.5"
                        />

                        <span>{error || imageError}</span>

                    </div>

                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* IMAGE */}
                    <div className="lg:col-span-2">

                        <h3 className={labelClass}>
                            Product Image
                        </h3>

                        <div
                            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center transition ${
                                drag
                                    ? "border-[#6b4f4f] bg-[#fdf7f2]"
                                    : "border-gray-300"
                            }`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDrag(true);
                            }}
                            onDragLeave={() => setDrag(false)}
                            onDrop={handleDrop}
                        >

                            <img
                                src={
                                    form.image ||
                                    "https://placehold.co/300x220?text=Preview"
                                }
                                alt="preview"
                                onError={(e) => {
                                    e.target.src =
                                        "https://placehold.co/300x220?text=No+Image";
                                }}
                                className={`w-full max-w-[288px] h-52 object-cover rounded-xl shadow mb-5 ${
                                    uploading ? "opacity-50" : ""
                                }`}
                            />

                            <label
                                className={`bg-[#6b4f4f] text-white px-5 py-3 rounded-xl hover:bg-[#5a4040] transition ${
                                    uploading
                                        ? "opacity-60 cursor-wait"
                                        : "cursor-pointer"
                                }`}
                            >

                                {
                                    uploading
                                        ? "Uploading..."
                                        : "Choose Image"
                                }

                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    disabled={uploading}
                                    onChange={(e) =>
                                        handleImage(
                                            e.target.files?.[0]
                                        )
                                    }
                                />

                            </label>

                            <p className="text-xs text-gray-400 mt-3">
                                JPG • PNG • WEBP — max 5MB
                            </p>

                        </div>

                    </div>

                    {/* FORM */}
                    <div className="lg:col-span-3 space-y-5">

                        <div className="grid sm:grid-cols-2 gap-5">

                            <div>

                                <label className={labelClass}>
                                    Product Name *
                                </label>

                                <input
                                    className={inputClass}
                                    placeholder="e.g. Cà Phê Sữa Đá"
                                    value={form.name}
                                    onChange={(e) =>
                                        set({ name: e.target.value })
                                    }
                                />

                            </div>

                            <div>

                                <label className={labelClass}>
                                    Price (₫) *
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    className={inputClass}
                                    placeholder="32000"
                                    value={form.price}
                                    onChange={(e) =>
                                        set({ price: e.target.value })
                                    }
                                />

                            </div>

                            <div>

                                <label className={labelClass}>
                                    Category
                                </label>

                                <select
                                    className={inputClass}
                                    value={form.category}
                                    onChange={(e) =>
                                        updateCategory(e.target.value)
                                    }
                                >

                                    {CATEGORIES.map(item => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            <div>

                                <label className={labelClass}>
                                    Subcategory
                                </label>

                                <select
                                    className={inputClass}
                                    value={form.subcategory || ""}
                                    onChange={(e) =>
                                        set({
                                            subcategory: e.target.value
                                        })
                                    }
                                >

                                    {(subcategoryMap[form.category] || [])
                                        .map(item => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}

                                </select>

                            </div>

                        </div>

                        <div>

                            <label className={labelClass}>
                                Description
                            </label>

                            <textarea
                                className={inputClass}
                                rows="3"
                                placeholder="Shown to customers on the menu"
                                value={form.description}
                                onChange={(e) =>
                                    set({
                                        description: e.target.value
                                    })
                                }
                            />

                        </div>

                        {/* MERCHANDISING */}
                        <div className="flex flex-wrap gap-5 bg-[#f7f3ee] rounded-2xl p-4">

                            {[
                                ["available", "Available to order"],
                                ["bestSeller", "Best seller"],
                                ["signature", "House signature"],
                                ["seasonal", "Seasonal"]
                            ].map(([key, label]) => (

                                <label
                                    key={key}
                                    className="flex items-center gap-2 text-sm cursor-pointer"
                                >

                                    <input
                                        type="checkbox"
                                        checked={Boolean(form[key])}
                                        onChange={(e) =>
                                            set({
                                                [key]: e.target.checked
                                            })
                                        }
                                        className="w-4 h-4 accent-[#6b4f4f]"
                                    />

                                    {label}

                                </label>

                            ))}

                        </div>

                        {/* AI PROFILE */}
                        <div className="bg-[#faf5f0] rounded-2xl p-5">

                            <h3 className="font-bold mb-1 flex items-center gap-2">

                                <Sparkles
                                    size={18}
                                    className="text-[#c08b5c]"
                                />

                                AI Recommendation Profile

                            </h3>

                            <p className="text-xs text-gray-500 mb-4">
                                The customer recommendation engine
                                compares these against a shopper’s
                                order history. Fill them in and the
                                drink becomes suggestable.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">

                                <div>

                                    <label className={labelClass}>
                                        Taste
                                    </label>

                                    <select
                                        className={inputClass}
                                        value={form.taste || ""}
                                        onChange={(e) =>
                                            set({ taste: e.target.value })
                                        }
                                    >

                                        <option value="">
                                            — not set —
                                        </option>

                                        {TASTE_OPTIONS.map(t => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}

                                    </select>

                                </div>

                                <div>

                                    <label className={labelClass}>
                                        Temperature
                                    </label>

                                    <select
                                        className={inputClass}
                                        value={form.temperature || "Cold"}
                                        onChange={(e) =>
                                            set({
                                                temperature: e.target.value
                                            })
                                        }
                                    >

                                        {TEMPERATURE_OPTIONS.map(t => (
                                            <option
                                                key={t.value}
                                                value={t.value}
                                            >
                                                {t.label}
                                            </option>
                                        ))}

                                    </select>

                                </div>

                                <div>

                                    <label className={labelClass}>
                                        Caffeine level
                                    </label>

                                    <select
                                        className={inputClass}
                                        value={form.caffeine ?? 0}
                                        onChange={(e) =>
                                            set({
                                                caffeine: Number(e.target.value)
                                            })
                                        }
                                    >

                                        {CAFFEINE_LABELS.map((label, i) => (
                                            <option key={i} value={i}>
                                                {label}
                                            </option>
                                        ))}

                                    </select>

                                </div>

                                <div>

                                    <label className={labelClass}>
                                        Intensity
                                    </label>

                                    <select
                                        className={inputClass}
                                        value={form.intensity ?? 1}
                                        onChange={(e) =>
                                            set({
                                                intensity: Number(e.target.value)
                                            })
                                        }
                                    >

                                        {INTENSITY_LABELS.map((label, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {label}
                                            </option>
                                        ))}

                                    </select>

                                </div>

                            </div>

                            <label className="flex items-center gap-2 text-sm cursor-pointer mt-4">

                                <input
                                    type="checkbox"
                                    checked={Boolean(form.milk)}
                                    onChange={(e) =>
                                        set({ milk: e.target.checked })
                                    }
                                    className="w-4 h-4 accent-[#6b4f4f]"
                                />

                                Contains milk

                            </label>

                        </div>

                    </div>

                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-4 mt-8">

                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-6 py-3 rounded-xl border disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSave}
                        disabled={saving || uploading}
                        className="px-8 py-3 rounded-xl bg-[#6b4f4f] text-white font-semibold hover:bg-[#553838] disabled:bg-[#a3908c] disabled:cursor-not-allowed"
                    >

                        {
                            saving
                                ? "Saving..."
                                : editing
                                    ? "Update Product"
                                    : "Create Product"
                        }

                    </button>

                </div>

            </div>

        </div>

    );

}
