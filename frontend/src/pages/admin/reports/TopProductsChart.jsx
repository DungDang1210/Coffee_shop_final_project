

export default function TopProductsChart({
  data = [],
  formatPrice
}) {

  if (!data.length) {

    return (
      <p className="text-gray-400">
        No sales data yet.
      </p>
    );

  }

  const max = Math.max(
    ...data.map(d => d.quantity),
    1
  );

  return (

    <div className="space-y-4">

      {data.map((row, index) => (

        <div key={row.name}>

          <div className="flex justify-between items-baseline mb-1.5 gap-3">

            <span className="text-sm font-medium text-[#2d1e1e] truncate">

              <span className="text-[#c08b5c] font-bold mr-2">
                #{index + 1}
              </span>

              {row.name}

            </span>

            <span className="text-sm text-gray-500 whitespace-nowrap">

              {row.quantity} sold

              {row.revenue > 0 && (
                <span className="text-gray-400">
                  {" · "}{formatPrice(row.revenue)}
                </span>
              )}

            </span>

          </div>

          <div className="h-2.5 rounded-full bg-[#f3ece5] overflow-hidden">

            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8a5f34] to-[#c08b5c] transition-all duration-700"
              style={{
                width: `${(row.quantity / max) * 100}%`
              }}
            />

          </div>

        </div>

      ))}

    </div>

  );

}
