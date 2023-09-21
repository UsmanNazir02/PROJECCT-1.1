const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },

    email : {
        type:String,
        required:true,
        unique:true
    },

    location: {
        type: String, 
        required: false
    },
    
    password: {
        type:String,
        required:true
    },
    confirmpassword : {
        type:String,
        required:true
    }

})

const Register = new mongoose.model("Register",Schema);

module.exports=Register;