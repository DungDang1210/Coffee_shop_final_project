import { useState } from "react";

export default function MenuManagement({
  products,
  setProducts
}) {

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "Coffee",
    subcategory: ""
  });

  const [editingId, setEditingId] =
    useState(null);


  // ======================
  // REFRESH PRODUCTS
  // ======================
  const fetchProducts = async () => {
    try {

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data =
        await response.json();

      setProducts(data);

    } catch (err) {
      console.log(err);
    }
  };


  // ======================
  // ADD / UPDATE
  // ======================
  const handleSubmit = async () => {

    if (!form.name || !form.price) {
      return;
    }

    try {

      // ======================
      // UPDATE
      // ======================
      if (editingId) {

        await fetch(
          `http://localhost:5000/api/products/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              ...form,
              price: Number(form.price)
            })
          }
        );

        setEditingId(null);

      } else {

        // ======================
        // CREATE
        // ======================
        await fetch(
          "http://localhost:5000/api/products",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              ...form,
              price: Number(form.price)
            })
          }
        );
      }

      // refresh DB products
      fetchProducts();

      // reset form
      setForm({
        name: "",
        price: "",
        image: "",
        description: "",
        category: "Coffee",
        subcategory: ""
      });

    } catch (err) {
      console.log(err);
    }
  };


  // ======================
  // EDIT
  // ======================
  const handleEdit = (product) => {

    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory
    });

    setEditingId(product._id);
  };


  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {

    try {

      await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE"
        }
      );

      fetchProducts();

    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Menu Management
      </h1>


      {/* ======================
          FORM
      ====================== */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">

        <h2 className="text-xl font-bold mb-4">
          {editingId
            ? "Edit Product"
            : "Add Product"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value
              })
            }
            className="border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Image"
            value={form.image}
            onChange={(e) =>
              setForm({
                ...form,
                image: e.target.value
              })
            }
            className="border p-3 rounded"
          />

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value
              })
            }
            className="border p-3 rounded"
          >
            <option>Coffee</option>
            <option>Tea</option>
            <option>Smoothie</option>
            <option>Juice</option>
            <option>Soda</option>
            <option>Chocolate</option>
            <option>Dessert Drink</option>
          </select>

          <input
            type="text"
            placeholder="Subcategory"
            value={form.subcategory}
            onChange={(e) =>
              setForm({
                ...form,
                subcategory: e.target.value
              })
            }
            className="border p-3 rounded"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value
              })
            }
            className="border p-3 rounded md:col-span-2"
          />

        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-[#6b4f4f] text-white px-6 py-2 rounded"
        >
          {editingId
            ? "Update Product"
            : "Add Product"}
        </button>

      </div>


      {/* ======================
          PRODUCT LIST
      ====================== */}
      <div className="space-y-4">

        {products.map((product) => (

          <div
            key={product._id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >

            <div className="flex items-center gap-4">

              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div>
                <h3 className="font-bold">
                  {product.name}
                </h3>

                <p>
                  ${product.price}
                </p>

                <p className="text-sm text-gray-500">
                  {product.category}
                </p>
              </div>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  handleEdit(product)
                }
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(product._id)
                }
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}