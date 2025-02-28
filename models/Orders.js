 const mangoose = require('mongoose');
 const { Schema } = mangoose;

const OrdersSchema  = new Schema({
  email : {
    type:String,
    required : true,
    unique :true
  },
  order_data :{
    type:Array,
    required:true,
  },
});

module.exports =  mangoose.model('orders', OrdersSchema);