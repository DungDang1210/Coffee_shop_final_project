import { useState, useEffect } from "react";

import ProductTable from "./menu/components/ProductTable";
import ProductToolbar from "./menu/components/ProductToolbar";
import ProductStats from "./menu/components/ProductStats";
import ProductModal from "./menu/components/ProductModal";
import ExcelImport from "./menu/components/ExcelImport";
import DeleteModal from "./menu/components/DeleteModal";
import useProductForm from "./menu/hooks/useProductForm";

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

      emptyForm

  } = useProductForm(setProducts, fetchProducts);

  useEffect(() => {
      fetchProducts();
  }, []);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteItem, setDeleteItem] = useState(null);

  const [excelOpen,setExcelOpen]=useState(false);

  const [modalOpen,setModalOpen]=useState(false);

  const [search,setSearch]=useState("");

  const handleSearch = (value)=>{

        setSearch(value);
        setCurrentPage(1);

    };

  const [category,setCategory]=useState("All");

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
  const confirmDelete = async (id) => {

      try {

          await fetch(

              `http://localhost:5000/api/products/${id}`,

              {

                  method: "DELETE"

              }

          );

          fetchProducts();

          setDeleteOpen(false);

          setDeleteItem(null);

      }

      catch (err) {

          console.log(err);

      }

  };


  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Menu Management
      </h1>

      <ProductStats

          products={products}

      />

      <ProductToolbar

            search={search}
            setSearch={handleSearch}

            category={category}
            setCategory={setCategory}

            onImport={()=>setExcelOpen(true)}

            onAdd={()=>{

                setEditingId(null);

                setForm(emptyForm);

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

        <DeleteModal

            open={deleteOpen}

            product={deleteItem}

            onClose={() => {

                setDeleteOpen(false);

                setDeleteItem(null);

            }}

            onConfirm={confirmDelete}

        />

    </div>
  );
}