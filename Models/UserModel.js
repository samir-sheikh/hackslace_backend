const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');


const User = new Schema({
    username: {
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
     },
     createdAt: {
         type:String,
         default: moment().format("DD/MM/YYYY")+ ";" + moment().format("hh:mm:ss") 
     },
});

module.exports= mongoose.model("users",Users)


