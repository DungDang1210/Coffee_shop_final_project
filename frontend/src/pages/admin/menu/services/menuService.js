import { authHeaders } from "../../../../utils/auth";

const API_URL = "http://localhost:5000/api/products";

export async function fetchProducts() {

    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message || "Cannot load products"
        );

    }

    return data;

}

export async function deleteProduct(id) {

    const response = await fetch(

        `${API_URL}/${id}`,

        {

            method: "DELETE",
            headers: authHeaders()

        }

    );

    if (!response.ok) {

        throw new Error("Delete failed");

    }

}

export async function saveProduct(payload, editingId) {

    const response = await fetch(

        editingId

            ? `${API_URL}/${editingId}`

            : API_URL,

        {

            method: editingId ? "PUT" : "POST",

            headers: {

                "Content-Type": "application/json",
                ...authHeaders()

            },

            body: JSON.stringify(payload)

        }

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message);

    }

    return data;

}

export async function uploadImage(file) {

    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(

        "http://localhost:5000/api/upload",

        {

            method: "POST",

            headers: authHeaders(),

            body: formData

        }

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error("Upload failed");

    }

    return data.imageUrl;

}

export async function importMenu(menu) {

    for (const item of menu) {

        await fetch(

            API_URL,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",
                    ...authHeaders()

                },

                body: JSON.stringify({

                    name: item.name,

                    price: Number(item.price),

                    image: item.image,

                    description: item.description,

                    category: item.category,

                    subcategory: item.subcategory,

                    bestSeller:

                        item.bestSeller || false,

                    signature:

                        item.signature || false,

                    seasonal:

                        item.seasonal || false,

                    available:

                        item.available ?? true

                })

            }

        );

    }

}
