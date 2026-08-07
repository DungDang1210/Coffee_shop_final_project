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


        // Built from the parts that actually exist.
        // The old template glued taste and category
        // together and produced "Fruity Coffee",
        // which reads like a product name.
        reason:
            buildReason({
                taste: favoriteTaste,
                category: favoriteCategory,
                temperature: favoriteTemperature,
                product: result.product
            }),


        // The taste profile is already computed, so the
        // next best matches come free. PersonalizedAI
        // shows the top pick; the home page "related"
        // row shows these instead of a generic
        // products.slice(0, 3).
        related:
            scoredProducts
                .slice(1, 7)
                .map(row => ({
                    product: row.product,
                    score: row.score
                })),


        // what the profile actually looks like, so the
        // UI can explain itself
        profile: {
            taste: favoriteTaste,
            category: favoriteCategory,
            temperature: favoriteTemperature,
            avgIntensity,
            avgCaffeine
        }

    };


}





// =====================================
// HELPER
// =====================================


// Reads the profile as a sentence a customer would
// actually understand. Each clause is only added
// when we really know that fact.
function buildReason({
    taste,
    category,
    temperature,
    product
}){

    const known = [];

    if(taste){
        known.push(`${taste.toLowerCase()} flavours`);
    }

    if(category){
        known.push(`${category.toLowerCase()} drinks`);
    }

    if(temperature){
        known.push(
            `${temperature.toLowerCase()} drinks`
        );
    }

    if(!known.length){

        return "Picked from what other customers order most.";

    }

    // "fruity flavours and coffee drinks"
    const profile =
        known.length === 1
            ? known[0]
            : `${known.slice(0, -1).join(", ")} and ${known[known.length - 1]}`;

    const matches = [];

    if(taste && product?.taste === taste){
        matches.push("the same taste profile");
    }

    if(category && product?.category === category){
        matches.push("your usual category");
    }

    if(
        temperature &&
        product?.temperature === temperature
    ){
        matches.push("the temperature you prefer");
    }

    const because =
        matches.length
            ? ` It shares ${
                matches.length === 1
                    ? matches[0]
                    : `${matches.slice(0, -1).join(", ")} and ${matches[matches.length - 1]}`
              }.`
            : " It sits close to your usual picks.";

    return `From your past orders you lean towards ${profile}.${because}`;

}


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