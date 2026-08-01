import { useState } from "react";


export default function useProductForm(
    setProducts,
    fetchProducts
) {


    const emptyForm = {

        name:"",
        price:"",
        image:"",
        description:"",
        category:"Coffee",
        subcategory:""

    };


    const [form,setForm]=useState(emptyForm);


    const [editingId,setEditingId]=useState(null);



    const saveProduct = async()=>{


        if(!form.name || !form.price)
            return false;



        const url = editingId

        ? `http://localhost:5000/api/products/${editingId}`

        : "http://localhost:5000/api/products";



        const method = editingId
        ? "PUT"
        : "POST";



        await fetch(url,{

            method,

            headers:{
                "Content-Type":"application/json"
            },


            body:JSON.stringify({

                ...form,

                price:Number(form.price)

            })

        });



        await fetchProducts();



        setForm(emptyForm);

        setEditingId(null);



        return true;


    };



    const editProduct=(product)=>{


        setEditingId(product._id);


        setForm({

            name:product.name,

            price:product.price,

            image:product.image,

            description:product.description,

            category:product.category,

            subcategory:product.subcategory

        });


    };



    return {

        form,

        setForm,

        editingId,

        setEditingId,

        saveProduct,

        editProduct,

        emptyForm

    };

}