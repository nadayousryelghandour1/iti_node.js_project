const mongoose = require('mongoose');
const { type } = require('os');
const {Schema} = mongoose;

let productSchame = Schema({

    id : {
        type : Number,
        required : true
    },

    name:{
        type : String,
        required : true
    },

    price:{
        type : Number,
        required : true,
    }
});

module.exports=mongoose.model('Product',productSchame);