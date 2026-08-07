import { useState, useEffect, useRef } from "react";

import InventoryStats from "./inventory/components/InventoryStats";
import InventoryToolbar from "./inventory/components/InventoryToolbar";
import InventoryTable from "./inventory/components/InventoryTable";
import InventoryModal from "./inventory/components/InventoryModal";
import StockModal from "./inventory/components/StockModal";
import StockHistory from "./inventory/components/StockHistory";
import DeleteIngredientModal from "./inventory/components/DeleteIngredientModal";
import ExcelGuide from "../../components/admin/ExcelGuide";

export default function Inventory() {

    const emptyForm = {

        name:"",
        category:"Coffee",
        supplier:"Unknown",
        stock:0,
        unit:"kg",
        minStock:5,
        costPrice:0,
        location:"Main Warehouse",
        status:"Available"

    };

    const [inventory,setInventory] = useState([]);

    const [search,setSearch] = useState("");

    const fileInputRef = useRef(null);

    const [category,setCategory] = useState("All");

    const [modalOpen,setModalOpen] = useState(false);

    const [editingId,setEditingId] = useState(null);

    const [form,setForm] = useState(emptyForm);

    const [stockModal,setStockModal]=useState(false);

    const [stockItem,setStockItem]=useState(null);

    const [stockType,setStockType]=useState("");

    const [historyOpen,setHistoryOpen] = useState(false);

    const [guideOpen,setGuideOpen] = useState(false);
    
    // Fetch inventory

    const fetchInventory = async ()=>{

        try{

            const response = await fetch(
                "http://localhost:5000/api/inventory"
            );

            const data = await response.json();

            setInventory(data);

        }

        catch(err){

            console.log(err);

        }

    };

    const saveInventory = async()=>{

        try{

            const url = editingId

            ? `http://localhost:5000/api/inventory/${editingId}`

            : "http://localhost:5000/api/inventory";


            const method = editingId
            ? "PUT"
            : "POST";


            await fetch(url,{

                method,

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(form)

            });


            await fetchInventory();


            setModalOpen(false);

            setEditingId(null);

            setForm(emptyForm);


        }

        catch(err){

            console.log(err);

        }

    };

    // delete now goes through a confirmation step
    const [deleteItem,setDeleteItem] = useState(null);

    const [deleting,setDeleting] = useState(false);

    const [error,setError] = useState("");

    const deleteInventory = async(id)=>{

        if(!id){

            setError("Cannot delete: missing id.");

            return;

        }

        setError("");

        setDeleting(true);

        try{

            const res = await fetch(

                `http://localhost:5000/api/inventory/${id}`,

                {
                    method:"DELETE"
                }

            );

            if(!res.ok){

                const body =
                    await res.json().catch(()=>({}));

                throw new Error(
                    body.message ||
                    `Delete failed (HTTP ${res.status})`
                );

            }

            await fetchInventory();

            setDeleteItem(null);

        }

        catch(err){

            console.log(err);

            setError(err.message);

        }

        finally{

            setDeleting(false);

        }

    };

    useEffect(()=>{

        fetchInventory();

    },[]);

    const filteredInventory = inventory.filter(item=>{

        const matchSearch =
            item.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchCategory =
            category==="All" ||
            item.category===category;

        return matchSearch && matchCategory;

    });

    return(

        <div>

            <h1 className="text-3xl font-bold mb-2">

                Inventory Management

            </h1>

            <p className="text-gray-500 mb-8">
                Stock status updates itself: at or below
                the minimum shows <strong>Low Stock</strong>,
                zero shows <strong>Out of Stock</strong>.
            </p>

            {error && (

                <div
                    role="alert"
                    className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start justify-between gap-4"
                >

                    <span className="text-sm">{error}</span>

                    <button
                        onClick={()=>setError("")}
                        className="text-red-500 hover:text-red-800 shrink-0"
                    >
                        ✕
                    </button>

                </div>

            )}

            <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                hidden
                onChange={async (e) => {

                    const file = e.target.files[0];

                    if (!file) return;

                    const formData = new FormData();

                    formData.append("file", file);

                    await fetch(

                        "http://localhost:5000/api/inventory/import-excel",

                        {

                            method: "POST",

                            body: formData

                        }

                    );

                    fetchInventory();

                }}
            />

            <InventoryStats

                inventory={inventory}

            />

            <InventoryToolbar

                search={search}
                setSearch={setSearch}

                category={category}
                setCategory={setCategory}

                onAdd={()=>{

                    setEditingId(null);

                    setForm(emptyForm);

                    setModalOpen(true);

                }}

                onImport={() => {

                    fileInputRef.current.click();

                }}

                onHistory={()=>{

                    setHistoryOpen(true);

                }}

                onGuide={()=>{

                    setGuideOpen(true);

                }}

            />

            <ExcelGuide

                open={guideOpen}

                mode="inventory"

                onClose={()=>setGuideOpen(false)}

            />

            <InventoryTable

                ingredients={filteredInventory}

                onEdit={(item)=>{

                    setEditingId(item._id);

                    setForm(item);

                    setModalOpen(true);

                }}

                onDelete={(item)=>{

                    // open the confirm dialog instead of
                    // deleting on the first click
                    setDeleteItem(item);

                }}

                onStock={(item,type)=>{

                    setStockItem(item);

                    setStockType(type);

                    setStockModal(true);

                }}
            />

            <InventoryModal

                open={modalOpen}

                form={form}

                setForm={setForm}

                editing={editingId}

                onClose={()=>setModalOpen(false)}

                onSave={saveInventory}

            />

            <StockModal

                open={stockModal}

                item={stockItem}

                type={stockType}

                onClose={()=>setStockModal(false)}

                onSubmit={async(quantity)=>{


                await fetch(

                `http://localhost:5000/api/inventory/${stockType}/${stockItem._id}`,

                {

                method:"PUT",

                headers:{
                "Content-Type":"application/json"
                },

                body:JSON.stringify({

                stock:Number(quantity)

                })

                }

                );


                await fetchInventory();


                setStockModal(false);


                }}

            />
            <DeleteIngredientModal

                open={Boolean(deleteItem)}

                item={deleteItem}

                deleting={deleting}

                onClose={()=>{

                    setDeleteItem(null);

                    setError("");

                }}

                onConfirm={deleteInventory}

            />

            {
            historyOpen && (

                <StockHistory
                    open={historyOpen}
                    onClose={() => setHistoryOpen(false)}
                />

            )
            }

        </div>
        

    );
}