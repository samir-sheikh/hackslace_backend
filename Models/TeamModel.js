const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');


const Team = new Schema({
    name: {
        type: String,
        required:true
    },
    dsc:{
        type:String,
        required:true,
     },

     user: {
         type: Schema.Types.ObjectId,
         ref: "users"
     },
   
     createdAt: {
         type:String,
         default: moment().format("DD/MM/YYYY")+ ";" + moment().format("hh:mm:ss") 
     },
});

module.exports= mongoose.model("Teams",Team)


