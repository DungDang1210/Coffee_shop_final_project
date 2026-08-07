const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

userId:String,

items:Array,

subtotal:Number,

discount:Number,

voucherCode:String,

deliveryFee:Number,

tax:Number,

total:Number,

paymentMethod:String,

paymentStatus:String,

customer:Object,

status:{
type:String,
default:"Pending"
},

// set when the customer placed this from
// "Reorder" in their order history, so the
// kitchen can see it is a repeat
isReorder:{
type:Boolean,
default:false
},

// the order it was repeated from
reorderOf:{
type:String,
default:null
},

// who cancelled it: "customer" | "admin" | null.
// Without this the admin's own cancellation was
// still labelled "Cancelled by customer".
cancelledBy:{
type:String,
default:null
},

cancelledAt:{
type:Date,
default:null
}

},{
timestamps:true
});

module.exports = mongoose.model(
  "Order",
  orderSchema
);