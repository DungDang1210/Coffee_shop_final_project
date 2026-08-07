import { useState } from "react";

export const emptyForm = {

    name: "",
    price: "",
    image: "",
    description: "",
    category: "Coffee",
    subcategory: "Espresso Based",

    // merchandising
    bestSeller: false,
    signature: false,
    seasonal: false,
    available: true,

    // AI recommendation profile
    taste: "",
    temperature: "Cold",
    milk: false,
    caffeine: 0,
    intensity: 1

};


export default function useProductForm(
    setProducts,
    fetchProducts
) {

    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");


    const saveProduct = async () => {

        if (!form.name?.trim()) {

            setError("Product name is required.");

            return false;

        }

        if (
            form.price === "" ||
            Number.isNaN(Number(form.price)) ||
            Number(form.price) < 0
        ) {

            setError("Enter a valid price.");

            return false;

        }

        setError("");

        setSaving(true);

        const url = editingId
            ? `http://localhost:5000/api/products/${editingId}`
            : "http://localhost:5000/api/products";

        const method = editingId ? "PUT" : "POST";

        try {

            const res = await fetch(url, {

                method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    ...form,

                    name: form.name.trim(),

                    price: Number(form.price),

                    // numbers, not strings from <select>
                    caffeine: Number(form.caffeine) || 0,

                    intensity: Number(form.intensity) || 1,

                    milk: Boolean(form.milk),

                    bestSeller: Boolean(form.bestSeller),

                    signature: Boolean(form.signature),

                    seasonal: Boolean(form.seasonal),

                    available: Boolean(form.available)

                })

            });

            if (!res.ok) {

                const body =
                    await res.json().catch(() => ({}));

                throw new Error(
                    body.message ||
                    `Save failed (HTTP ${res.status})`
                );

            }

            await fetchProducts();

            setForm(emptyForm);

            setEditingId(null);

            return true;

        }

        catch (err) {

            console.log(err);

            setError(err.message);

            return false;

        }

        finally {

            setSaving(false);

        }

    };


    const editProduct = (product) => {

        setEditingId(product._id);

        setError("");

        // start from emptyForm so a product saved
        // before these fields existed still gets
        // sensible defaults instead of undefined
        setForm({
            ...emptyForm,
            ...product,
            price: product.price ?? "",
            taste: product.taste || "",
            temperature: product.temperature || "Cold",
            caffeine: product.caffeine ?? 0,
            intensity: product.intensity ?? 1
        });

    };


    return {

        form,
        setForm,

        editingId,
        setEditingId,

        saveProduct,
        editProduct,

        saving,
        error,
        setError,

        emptyForm

    };

}
