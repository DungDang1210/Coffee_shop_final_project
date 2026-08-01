import { useState, useEffect } from "react";

import InventoryStats from "./inventory/components/InventoryStats";
import InventoryToolbar from "./inventory/components/InventoryToolbar";
import InventoryTable from "./inventory/components/InventoryTable";
import InventoryModal from "./inventory/components/InventoryModal";
import StockModal from "./inventory/components/StockModal";
import StockHistory from "./inventory/components/StockHistory";

export default function Supplies() {

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

    const [category,setCategory] = useState("All");

    const [modalOpen,setModalOpen] = useState(false);

    const [editingId,setEditingId] = useState(null);

    const [form,setForm] = useState(emptyForm);

    const [stockModal,setStockModal]=useState(false);

    const [stockItem,setStockItem]=useState(null);

    const [stockType,setStockType]=useState("");

    const [historyOpen,setHistoryOpen] = useState(false);
    
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

    const deleteInventory = async(id)=>{


        try{


            await fetch(

                `http://localhost:5000/api/inventory/${id}`,

                {
                    method:"DELETE"
                }

            );


            fetchInventory();


        }

        catch(err){

            console.log(err);

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

            <h1 className="text-3xl font-bold mb-8">

                Inventory Management

            </h1>

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

                onImport={()=>{

                    console.log("Import Excel");

                }}

                onHistory={()=>{

                    setHistoryOpen(true);

                }}

            />

            <InventoryTable

                ingredients={filteredInventory}

                onEdit={(item)=>{

                    setEditingId(item._id);

                    setForm(item);

                    setModalOpen(true);

                }}

                onDelete={(item)=>{

                    deleteInventory(item._id);

                }}

                onStock={(item,type)=>{

                    setStockItem(item);

                    setStockType(type);

                    setStockModal(true);

                }}
            />

            <StockHistory />

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

        </div>
        

    );
    {
    historyOpen && (

        <StockHistory/>

    )
    }
}