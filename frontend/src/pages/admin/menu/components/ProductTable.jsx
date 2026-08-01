import {
  Pencil,
  Trash2
} from "lucide-react";

export default function ProductTable({
  products,
  onEdit,
  onDelete
}) {

  // Format tiền Việt Nam
  const formatPrice = (price) =>
    Number(price || 0)
      .toLocaleString("vi-VN") + " ₫";


  return (

    <div className="bg-white rounded-3xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-[#f7f3ee]">

          <tr className="text-left text-gray-600">

            <th className="px-6 py-4">
              Product
            </th>

            <th className="px-6 py-4">
              Category
            </th>

            <th className="px-6 py-4">
              Price
            </th>

            <th className="px-6 py-4">
              Status
            </th>

            <th className="px-6 py-4 text-center">
              Action
            </th>

          </tr>

        </thead>


        <tbody>

          {products.map(product => (

            <tr
              key={product._id}
              className="border-t hover:bg-[#faf8f6] transition"
            >

              <td className="px-6 py-4">

                <div className="flex items-center gap-4">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />

                  <div>

                    <h3 className="font-semibold">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-400">
                      {product.subcategory}
                    </p>

                  </div>

                </div>

              </td>


              <td className="px-6">
                {product.category}
              </td>


              <td className="px-6 font-semibold text-[#6b4f4f]">

                {formatPrice(product.price)}

              </td>


              <td className="px-6">

                {product.available ? (

                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">

                    Available

                  </span>

                ) : (

                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs">

                    Out of Stock

                  </span>

                )}

              </td>


              <td>

                <div className="flex justify-center gap-3">

                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:text-blue-800"
                  >

                    <Pencil size={18}/>

                  </button>


                  <button
                    onClick={() => onDelete(product._id)}
                    className="text-red-600 hover:text-red-800"
                  >

                    <Trash2 size={18}/>

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