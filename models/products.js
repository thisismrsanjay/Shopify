const mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category'
    },
    name:String,
    price:Number,
    image:String
})


module.exports = mongoose.model('Product',productSchema);