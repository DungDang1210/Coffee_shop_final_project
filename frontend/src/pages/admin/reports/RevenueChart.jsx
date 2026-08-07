
const W = 760;

const H = 260;

const PAD = { top: 20, right: 16, bottom: 34, left: 62 };


function niceCeil(value) {

  if (value <= 0) return 1;

  const mag = Math.pow(
    10,
    Math.floor(Math.log10(value))
  );

  return Math.ceil(value / mag) * mag;

}


function shortMoney(v) {

  if (v >= 1_000_000) {
    return `${(v / 1_000_000).toFixed(1)}tr`;
  }

  if (v >= 1000) {
    return `${Math.round(v / 1000)}k`;
  }

  return String(Math.round(v));

}


export default function RevenueChart({
  series = []
}) {

  if (series.length < 2) {

    return (

      <div className="h-[260px] flex items-center justify-center text-gray-400 text-sm">
        Not enough data yet — revenue trend appears
        once you have orders on two or more days.
      </div>

    );

  }

  const plotW =
    W - PAD.left - PAD.right;

  const plotH =
    H - PAD.top - PAD.bottom;

  const maxRevenue = niceCeil(
    Math.max(...series.map(d => d.revenue), 1)
  );

  const maxOrders = Math.max(
    ...series.map(d => d.orders),
    1
  );

  const x = (i) =>
    PAD.left +
    (series.length === 1
      ? plotW / 2
      : (i / (series.length - 1)) * plotW);

  const y = (v) =>
    PAD.top + plotH - (v / maxRevenue) * plotH;

  const linePath = series
    .map((d, i) =>
      `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.revenue).toFixed(1)}`
    )
    .join(" ");

  const areaPath =
    `${linePath} L ${x(series.length - 1).toFixed(1)} ${PAD.top + plotH} L ${x(0).toFixed(1)} ${PAD.top + plotH} Z`;

  // 4 horizontal gridlines
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(
    f => f * maxRevenue
  );

  // don't crowd the axis on long ranges
  const labelEvery =
    Math.ceil(series.length / 8);

  const barW =
    Math.max(
      2,
      Math.min(18, (plotW / series.length) * 0.45)
    );

  return (

    <div className="overflow-x-auto">

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full min-w-[560px]"
        role="img"
        aria-label="Revenue and order count over time"
      >

        <defs>

          <linearGradient
            id="revFill"
            x1="0" y1="0" x2="0" y2="1"
          >

            <stop
              offset="0%"
              stopColor="#c08b5c"
              stopOpacity="0.35"
            />

            <stop
              offset="100%"
              stopColor="#c08b5c"
              stopOpacity="0.02"
            />

          </linearGradient>

        </defs>

        {/* GRID + Y LABELS */}
        {ticks.map((t, i) => (

          <g key={i}>

            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke="#ece3da"
              strokeWidth="1"
            />

            <text
              x={PAD.left - 10}
              y={y(t) + 4}
              textAnchor="end"
              fontSize="11"
              fill="#a8968a"
            >
              {shortMoney(t)}
            </text>

          </g>

        ))}

        {/* ORDER COUNT BARS (secondary) */}
        {series.map((d, i) => {

          const h =
            (d.orders / maxOrders) * plotH * 0.55;

          return (

            <rect
              key={`b${i}`}
              x={x(i) - barW / 2}
              y={PAD.top + plotH - h}
              width={barW}
              height={h}
              rx="2"
              fill="#e6d5c4"
            />

          );

        })}

        {/* REVENUE AREA + LINE */}
        <path d={areaPath} fill="url(#revFill)" />

        <path
          d={linePath}
          fill="none"
          stroke="#6b4f4f"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* POINTS */}
        {series.map((d, i) => (

          <g key={`p${i}`}>

            <circle
              cx={x(i)}
              cy={y(d.revenue)}
              r="3.5"
              fill="#fff"
              stroke="#6b4f4f"
              strokeWidth="2"
            />

            <title>
              {d.label}: {d.revenue.toLocaleString("vi-VN")}₫
              {" · "}{d.orders} order
              {d.orders === 1 ? "" : "s"}
            </title>

          </g>

        ))}

        {/* X LABELS */}
        {series.map((d, i) => (

          i % labelEvery === 0 ||
          i === series.length - 1
            ? (
              <text
                key={`x${i}`}
                x={x(i)}
                y={H - 12}
                textAnchor="middle"
                fontSize="11"
                fill="#a8968a"
              >
                {d.label}
              </text>
            )
            : null

        ))}

      </svg>

      {/* LEGEND */}
      <div className="flex gap-6 mt-2 text-xs text-gray-500 px-2">

        <span className="flex items-center gap-2">

          <span className="w-4 h-[3px] rounded bg-[#6b4f4f]" />

          Revenue (₫)

        </span>

        <span className="flex items-center gap-2">

          <span className="w-3 h-3 rounded-sm bg-[#e6d5c4]" />

          Orders

        </span>

      </div>

    </div>

  );

}
