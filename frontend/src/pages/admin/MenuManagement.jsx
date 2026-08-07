import { useState, useEffect } from "react";

import ProductTable from "./menu/components/ProductTable";
import ProductToolbar from "./menu/components/ProductToolbar";
import ProductStats from "./menu/components/ProductStats";
import ProductModal from "./menu/components/ProductModal";
import ExcelImport from "./menu/components/ExcelImport";
import DeleteModal from "./menu/components/DeleteModal";
import useProductForm from "./menu/hooks/useProductForm";
import ExcelGuide from "../../components/admin/ExcelGuide";

export default function MenuManagement({
  products,
  setProducts,
  fetchProducts
}) {

  const {

      form,

      setForm,

      editingId,

      setEditingId,

      saveProduct,

      editProduct,

      saving,

      error: formError,

      setError: setFormError,

      emptyForm

  } = useProductForm(setProducts, fetchProducts);

  useEffect(() => {
      fetchProducts();
  }, []);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteItem, setDeleteItem] = useState(null);

  const [excelOpen,setExcelOpen]=useState(false);

  const [guideOpen,setGuideOpen]=useState(false);

  const [modalOpen,setModalOpen]=useState(false);

  const [search,setSearch]=useState("");

  const handleSearch = (value)=>{

        setSearch(value);
        setCurrentPage(1);

    };

  const [category,setCategory]=useState("All");

  // real categories + how many products each holds,
  // so the filter can never offer an empty option
  const categories = [
    ...new Set(
      products
        .map(p => p.category)
        .filter(Boolean)
    )
  ].sort();

  const counts = products.reduce(
    (acc, p) => {

      acc.All = (acc.All || 0) + 1;

      if (p.category) {
        acc[p.category] =
          (acc[p.category] || 0) + 1;
      }

      return acc;

    },
    {}
  );

  const [currentPage,setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const filteredProducts = products.filter(product=>{

      const matchSearch=

          product.name
          .toLowerCase()
          .includes(
              search.toLowerCase()
          );

      const matchCategory=

          category==="All" ||

          product.category===category;

      return matchSearch && matchCategory;

  });
  const totalPages = Math.ceil(
    filteredProducts.length / itemsPerPage
    );


    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // deleting the last row on the last page used to
    // leave you stranded on an empty page
    useEffect(() => {

        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {
            setCurrentPage(totalPages);
        }

    }, [totalPages, currentPage]);

  const handleImport = async (rows) => {

      try{

          for(const product of rows){

              await fetch(

                  "http://localhost:5000/api/products",

                  {

                      method:"POST",

                      headers:{
                          "Content-Type":"application/json"
                      },

                      body:JSON.stringify(product)

                  }

              );

          }

          fetchProducts();

          setExcelOpen(false);

      }

      catch(err){

          console.log(err);

      }

  };

  // ======================
  // DELETE
  // ======================
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const confirmDelete = async (id) => {

      if (!id) {

          setError(
            "Cannot delete: this product has no id."
          );

          return;

      }

      setError("");

      setDeleting(true);

      try {

          const res = await fetch(

              `http://localhost:5000/api/products/${id}`,

              {

                  method: "DELETE"

              }

          );

          if (!res.ok) {

              const body =
                await res.json().catch(() => ({}));

              throw new Error(
                body.message ||
                `Delete failed (HTTP ${res.status})`
              );

          }

          await fetchProducts();

          setDeleteOpen(false);

          setDeleteItem(null);

      }

      catch (err) {

          console.log(err);

          setError(err.message);

      }

      finally {

          setDeleting(false);

      }

  };


  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Menu Management
      </h1>

      {error && (

        <div
          role="alert"
          className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start justify-between gap-4"
        >

          <span className="text-sm">{error}</span>

          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-800 shrink-0"
          >
            ✕
          </button>

        </div>

      )}

      <ProductStats

          products={products}

      />

      <ProductToolbar

            search={search}
            setSearch={handleSearch}

            category={category}
            setCategory={setCategory}

            categories={categories}
            counts={counts}

            onImport={()=>setExcelOpen(true)}

            onGuide={()=>setGuideOpen(true)}

            onAdd={()=>{

                setEditingId(null);

                setForm(emptyForm);

                setFormError("");

                setModalOpen(true);

            }}

        />

        <ProductTable

            products={paginatedProducts}

            onEdit={(product)=>{

                editProduct(product);

                setModalOpen(true);

            }}

            onDelete={(product)=>{

              setDeleteItem(product);

              setDeleteOpen(true); 

            }}

        />

        <div className="flex justify-center items-center mt-8 gap-2">


            <button

                onClick={()=>setCurrentPage(prev=>prev-1)}

                disabled={currentPage===1}

                className="
                w-10
                h-10
                rounded-xl
                border
                bg-white
                hover:bg-gray-100
                disabled:opacity-40
                "

            >

                ←

            </button>



            {
                Array.from(
                    {
                        length: totalPages
                    },
                    (_,index)=>index+1
                )
                .map(page=>(

                    <button

                        key={page}

                        onClick={()=>setCurrentPage(page)}

                        className={`
                        
                        w-10
                        h-10
                        rounded-xl
                        font-semibold
                        transition

                        ${
                            currentPage===page

                            ?

                            "bg-[#6b4f4f] text-white"

                            :

                            "bg-white border hover:bg-[#f5eee8]"

                        }

                        `}

                    >

                        {page}

                    </button>

                ))
            }



            <button

                onClick={()=>setCurrentPage(prev=>prev+1)}

                disabled={currentPage===totalPages}

                className="
                w-10
                h-10
                rounded-xl
                border
                bg-white
                hover:bg-gray-100
                disabled:opacity-40
                "

            >

                →

            </button>


        </div>

        <ProductModal

            open={modalOpen}

            form={form}

            setForm={setForm}

            editing={editingId}

            saving={saving}

            error={formError}

            onClose={()=>setModalOpen(false)}

            onSave={async () => {

                const success = await saveProduct();

                if(success){

                    setModalOpen(false);

                }

            }}

        />

        <ExcelImport

            open={excelOpen}

            onClose={()=>setExcelOpen(false)}

            onImport={handleImport}

        />

        <ExcelGuide

            open={guideOpen}

            mode="product"

            onClose={()=>setGuideOpen(false)}

        />

        <DeleteModal

            open={deleteOpen}

            product={deleteItem}

            deleting={deleting}

            onClose={() => {

                setDeleteOpen(false);

                setDeleteItem(null);

            }}

            onConfirm={confirmDelete}

        />

    </div>
  );
}