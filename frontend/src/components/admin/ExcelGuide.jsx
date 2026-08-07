import * as XLSX from "xlsx";

import {
  X,
  Download,
  Info,
  CircleAlert
} from "lucide-react";


// =====================================
// EXCEL IMPORT GUIDE
//
// Explains exactly which column headers the
// importer expects, and hands the admin a ready
// template so a demo import works first time.
//
// Header names must match the field names the API
// saves — the importer passes rows straight
// through to the model.
// =====================================

export const PRODUCT_COLUMNS = [
  {
    key: "name",
    required: true,
    type: "text",
    example: "Cà Phê Sữa Đá",
    note: "Must be filled — the drink's display name"
  },
  {
    key: "price",
    required: true,
    type: "number",
    example: "32000",
    note: "Plain number in dong. No dots, no ₫"
  },
  {
    key: "category",
    required: true,
    type: "text",
    example: "Coffee",
    note: "Coffee / Tea / Smoothie / Juice / Soda / Dessert Drink / Sweet / Bakery"
  },
  {
    key: "subcategory",
    required: false,
    type: "text",
    example: "Vietnamese Coffee",
    note: "Free text, shown under the name"
  },
  {
    key: "description",
    required: false,
    type: "text",
    example: "Phin-brewed robusta with condensed milk",
    note: "Shown to customers on the menu"
  },
  {
    key: "image",
    required: false,
    type: "text",
    example: "/images/ca-phe-sua-da.jpg",
    note: "Path under frontend/public, or a full URL"
  },
  {
    key: "taste",
    required: false,
    type: "text",
    example: "Sweet",
    note: "AI field — Sweet / Bitter / Fruity / Chocolate / Creamy / Refreshing / Savory"
  },
  {
    key: "temperature",
    required: false,
    type: "text",
    example: "Cold",
    note: "AI field — Hot / Warm / Cold"
  },
  {
    key: "milk",
    required: false,
    type: "TRUE / FALSE",
    example: "TRUE",
    note: "AI field — contains milk"
  },
  {
    key: "caffeine",
    required: false,
    type: "0–5",
    example: "4",
    note: "AI field — 0 none, 5 very strong"
  },
  {
    key: "intensity",
    required: false,
    type: "1–5",
    example: "3",
    note: "AI field — 1 delicate, 5 intense"
  },
  {
    key: "bestSeller",
    required: false,
    type: "TRUE / FALSE",
    example: "TRUE",
    note: "Shows in the Best Sellers rail"
  },
  {
    key: "signature",
    required: false,
    type: "TRUE / FALSE",
    example: "FALSE",
    note: "Marks it a house signature"
  },
  {
    key: "available",
    required: false,
    type: "TRUE / FALSE",
    example: "TRUE",
    note: "Leave TRUE unless it's off the menu"
  }
];


export const INVENTORY_COLUMNS = [
  {
    key: "name",
    required: true,
    type: "text",
    example: "Arabica Beans",
    note: "Must be filled — the ingredient name"
  },
  {
    key: "category",
    required: true,
    type: "text",
    example: "Coffee",
    note: "Coffee / Milk / Fruit / Tea / Powder / Bakery / Herb / Syrup"
  },
  {
    key: "unit",
    required: true,
    type: "text",
    example: "kg",
    note: "kg / g / L / ml / pcs / bundle / bottle"
  },
  {
    key: "stock",
    required: false,
    type: "number",
    example: "25",
    note: "How much you have now. Blank = 0"
  },
  {
    key: "minStock",
    required: false,
    type: "number",
    example: "5",
    note: "At or below this it flags Low Stock"
  },
  {
    key: "costPrice",
    required: false,
    type: "number",
    example: "250000",
    note: "Cost per unit, in dong"
  },
  {
    key: "supplier",
    required: false,
    type: "text",
    example: "Đắk Lắk Farm",
    note: "Who you buy it from"
  },
  {
    key: "location",
    required: false,
    type: "text",
    example: "Main Warehouse",
    note: "Main Warehouse / Cold Storage / Dry Storage / Kitchen / Bar Counter"
  }
];


const SAMPLES = {

  product: [
    {
      name: "Cà Phê Sữa Đá",
      price: 32000,
      category: "Coffee",
      subcategory: "Vietnamese Coffee",
      description: "Phin-brewed robusta with condensed milk",
      image: "/images/ca-phe-sua-da.jpg",
      taste: "Sweet",
      temperature: "Cold",
      milk: true,
      caffeine: 4,
      intensity: 4,
      bestSeller: true,
      signature: true,
      available: true
    },
    {
      name: "Peach Iced Tea",
      price: 42000,
      category: "Tea",
      subcategory: "Fruit Tea",
      description: "Black tea with fresh peach",
      image: "/images/peach-iced-tea.jpg",
      taste: "Fruity",
      temperature: "Cold",
      milk: false,
      caffeine: 1,
      intensity: 2,
      bestSeller: false,
      signature: false,
      available: true
    }
  ],

  inventory: [
    {
      name: "Arabica Beans",
      category: "Coffee",
      unit: "kg",
      stock: 25,
      minStock: 5,
      costPrice: 250000,
      supplier: "Đắk Lắk Farm",
      location: "Dry Storage"
    },
    {
      name: "Fresh Milk",
      category: "Milk",
      unit: "L",
      stock: 40,
      minStock: 10,
      costPrice: 28000,
      supplier: "Vinamilk",
      location: "Cold Storage"
    }
  ]

};


export default function ExcelGuide({
  open,
  mode = "product",
  onClose
}) {

  if (!open) return null;

  const isProduct = mode === "product";

  const columns =
    isProduct
      ? PRODUCT_COLUMNS
      : INVENTORY_COLUMNS;

  const title =
    isProduct
      ? "Import products from Excel"
      : "Import ingredients from Excel";

  const downloadTemplate = () => {

    const rows = SAMPLES[
      isProduct ? "product" : "inventory"
    ];

    const sheet =
      XLSX.utils.json_to_sheet(rows);

    // widen the columns so the file is readable
    sheet["!cols"] = Object.keys(rows[0])
      .map(k => ({
        wch: Math.max(14, k.length + 4)
      }));

    const book = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      book,
      sheet,
      isProduct ? "Products" : "Ingredients"
    );

    XLSX.writeFile(
      book,
      isProduct
        ? "brew-haven-products-template.xlsx"
        : "brew-haven-inventory-template.xlsx"
    );

  };

  return (

    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >

      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >

        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-start gap-4">

          <div>

            <h2 className="text-2xl font-bold text-[#2d1e1e]">
              {title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Row 1 must be the column headers, spelled
              exactly as below. Extra columns are ignored.
            </p>

          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-black shrink-0"
          >
            <X size={26} />
          </button>

        </div>

        <div className="p-8 space-y-6">

          {/* TEMPLATE */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-start gap-3">

              <Info
                size={18}
                className="text-green-700 shrink-0 mt-0.5"
              />

              <div>

                <p className="font-semibold text-green-900">
                  Start from the template
                </p>

                <p className="text-sm text-green-800">
                  Two filled-in example rows with every
                  column already named correctly. Replace
                  the rows with your own and import.
                </p>

              </div>

            </div>

            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition whitespace-nowrap"
            >

              <Download size={17} />

              Download template

            </button>

          </div>

          {/* COLUMNS */}
          <div>

            <h3 className="font-bold text-[#2d1e1e] mb-3">
              Columns
            </h3>

            <div className="border rounded-2xl overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full text-sm min-w-[640px]">

                  <thead className="bg-[#f7f3ee] text-left text-gray-600">

                    <tr>

                      <th className="px-4 py-3">Header</th>

                      <th className="px-4 py-3">Type</th>

                      <th className="px-4 py-3">Example</th>

                      <th className="px-4 py-3">Notes</th>

                    </tr>

                  </thead>

                  <tbody>

                    {columns.map(col => (

                      <tr
                        key={col.key}
                        className="border-t"
                      >

                        <td className="px-4 py-3">

                          <code className="font-mono font-semibold text-[#6b4f4f]">
                            {col.key}
                          </code>

                          {col.required && (

                            <span className="ml-2 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                              REQUIRED
                            </span>

                          )}

                        </td>

                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {col.type}
                        </td>

                        <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                          {col.example}
                        </td>

                        <td className="px-4 py-3 text-gray-500">
                          {col.note}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

          {/* GOTCHAS */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">

            <p className="font-semibold text-amber-900 flex items-center gap-2 mb-3">

              <CircleAlert size={17} />

              Common mistakes

            </p>

            <ul className="space-y-2 text-sm text-amber-900">

              <li>
                • Prices must be plain numbers —{" "}
                <code className="font-mono">32000</code>, not{" "}
                <code className="font-mono">32.000 ₫</code>.
                Excel currency formatting breaks the import.
              </li>

              <li>
                • Header spelling is case-sensitive:{" "}
                <code className="font-mono">minStock</code>,
                not <code className="font-mono">MinStock</code>{" "}
                or <code className="font-mono">min stock</code>.
              </li>

              <li>
                • Only the <strong>first sheet</strong> is
                read. Delete or move any extra sheets.
              </li>

              <li>
                • Don't leave blank rows between entries —
                the import stops making sense after one.
              </li>

              {isProduct && (

                <li>
                  • Every import <strong>creates a new
                  product</strong>. Importing the same file
                  twice gives you duplicates — edit
                  existing items in the table instead.
                </li>

              )}

            </ul>

          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#6b4f4f] hover:bg-[#5a3f3f] text-white py-3.5 rounded-xl font-semibold transition"
          >
            Got it
          </button>

        </div>

      </div>

    </div>

  );

}
