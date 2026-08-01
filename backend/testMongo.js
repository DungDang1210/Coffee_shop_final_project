const mongoose = require("mongoose");

mongoose
.connect(
"mongodb+srv://dungdang1210:dung1210@fgwwweb2.drxxklv.mongodb.net/CoffeeShopDB?retryWrites=true&w=majority&appName=FGWWweb2"
)
.then(()=>{
    console.log("Connected!");
    process.exit();
})
.catch(err=>{
    console.log(err);
});