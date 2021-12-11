const mongoose = require('mongoose');

const db_url = process.env.DB_URL;
const assert = require('assert');

//mongoose connect

mongoose.connect(
    db_url,
   (error , link) =>{
       // check error
       assert.strictEqual(error, null, "Data Connection Sucessfull");
       //database connection sucessfull

       console.log("Database Sucessfull......... ");

    }
)