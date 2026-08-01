const Product = require("../models/Product");


// =====================================
// PERSONALIZED AI RECOMMENDATION ENGINE
// =====================================


async function generateRecommendation(
    orders
) {


    if(!orders.length){

        return null;

    }



    /*
        ==============================
        STEP 1
        ANALYZE USER PREFERENCE
        ==============================
    */


    const preference = {


        category:{},

        subcategory:{},

        taste:{},

        temperature:{},

        milk:0,

        caffeine:0,

        intensity:0


    };

    let totalItems = 0;

    const orderedProductIds = [];

    orders.forEach(order=>{

        order.items.forEach(item=>{

            const qty =
                item.quantity || 1;

            orderedProductIds.push(
                item.productId
            );

            totalItems += qty;

            // CATEGORY

            preference.category[item.category] = (preference.category[item.category] || 0) + qty;

            // SUBCATEGORY

            preference.subcategory[item.subcategory] =
                (preference.subcategory[item.subcategory] || 0) + qty;

            // TASTE

            if(item.taste){preference.taste[item.taste] = (preference.taste[item.taste] || 0) + qty;}

            // TEMPERATURE

            if(item.temperature){preference.temperature[item.temperature] = 
                (preference.temperature[item.temperature] || 0) + qty;
            
            }

            // MILK

            if(item.milk) 
                {preference.milk += qty;}

            // CAFFEINE

            if(item.caffeine)
                {preference.caffeine += item.caffeine * qty;}

            // INTENSITY

            if(item.intensity){preference.intensity += item.intensity * qty;}

        });

    });

    /*
        ==============================
        STEP 2
        FIND FAVORITE PROFILE
        ==============================
    */

    const favoriteCategory =
        getHighest(preference.category);

    const favoriteSubcategory =
        getHighest(preference.subcategory);

    const favoriteTaste =
        getHighest(preference.taste);

    const favoriteTemperature =
        getHighest(preference.temperature);

    const avgIntensity =
        totalItems?Math.round(preference.intensity / totalItems):3;

    const avgCaffeine =
        Math.round(preference.caffeine / totalItems);

    /*
        ==============================
        STEP 3
        GET PRODUCTS
        ==============================
    */

    const products =
        await Product.find({

            available:true,

            _id:{
                $nin: orderedProductIds
            }

        });

    /*
        ==============================
        STEP 4
        AI SCORING
        ==============================
    */

    const scoredProducts =
        products.map(product=>{

            let score = 0;

            // Category match

            if(
                product.category ===
                favoriteCategory
            ){

                score += 30;

            }




            // Subcategory match

            if(
                product.subcategory ===
                favoriteSubcategory
            ){

                score += 25;

            }




            // Taste match

            if(
                product.taste ===
                favoriteTaste
            ){

                score += 20;

            }




            // Temperature

            if(
                product.temperature ===
                favoriteTemperature
            ){

                score += 10;

            }




            // Intensity similarity

            if(
                Math.abs(
                    product.intensity -
                    avgIntensity
                )
                <=1
            ){

                score += 10;

            }




            // Caffeine similarity

            if(
                Math.abs(
                    product.caffeine -
                    avgCaffeine
                )
                <=1
            ){

                score +=5;

            }




            // Business priority

            if(product.signature){

                score +=5;

            }


            if(product.bestSeller){

                score +=3;

            }




            return {

                product,

                score

            };


        });






    /*
        ==============================
        STEP 5
        REMOVE LOW SCORE
        ==============================
    */


    scoredProducts.sort(
        (a,b)=>
            b.score-a.score
    );




    const result =
        scoredProducts[0];




    if(!result){

        return null;

    }





    return {


        product:
            result.product,


        score:
            result.score,


        reason:

            `
            AI analyzed your previous orders.
            You often choose ${favoriteTaste || "popular"}
            ${favoriteCategory || "drinks"}.
            This drink has a similar flavor profile
            and matches your personal preference.
            `

    };


}





// =====================================
// HELPER
// =====================================


function getHighest(obj){

    const keys = Object.keys(obj);


    if(!keys.length){
        return null;
    }


    return keys.reduce(
        (a,b) => obj[a] > obj[b] ? a:b);
}




module.exports =
{

    generateRecommendation

};