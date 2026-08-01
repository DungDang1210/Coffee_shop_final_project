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
}

},{
timestamps:true
});

module.exports = mongoose.model(
  "Order",
  orderSchema
);