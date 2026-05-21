export default function Supplies({
  products,
  setProducts
}) {
  const updateSupplyStatus = (id, status) => {
    setProducts(
      products.map(product =>
        product._id === id
          ? {
              ...product,
              supplyStatus: status
            }
          : product
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";

      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";

      case "Out of Stock":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Supplies Management
      </h1>

      <div className="space-y-4">
        {products.map(product => (
          <div
            key={product._id}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold text-lg">
                {product.name}
              </h2>
            </div>

            <select
              value={product.supplyStatus}
              onChange={(e) =>
                updateSupplyStatus(
                  product._id,
                  e.target.value
                )
              }
              className={`px-3 py-2 rounded-lg font-semibold ${getStatusColor(product.supplyStatus)}`}
            >
              <option>Available</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}