const mongoose = require("mongoose");
const conn = require("../db/conn");

const otpSchema = new mongoose.Schema({
    name : {
        type:String,
    },

    email : {
        type:String,   

    },

    code : {
        type:String,
    },
    expireIn : {
        type:Number,
    },
    
    
     //   timestamps:true
    
})

let otp = new mongoose.model('otp',otpSchema,'OTP');

module.exports = otp;