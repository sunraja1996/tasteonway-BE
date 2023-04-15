const mongoose = require('mongoose');
const validator = require('validator');

const OrderSchema = new mongoose.Schema({
    firstName : {type:String, require:true},
    email:{
        type:String,
        lowercase:true,
        require:true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    userid : {  type:String  },
    orderItems : [],
    shippingAddress : { type : Object  },
    orderAmount: {type:Number, require:true},
    isDelivered: {type: Boolean, require:true, default: false},
    transactionId : {type : String, require:true}
},{
    timestamps : true
})

const Order = mongoose.model('orders', OrderSchema)

module.exports= {Order}