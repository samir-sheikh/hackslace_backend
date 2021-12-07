//include librerry
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT;


//middlewear setup

app.use(cors());

//defaut raout
//method = get
//access = pulic

app.get('/', (req , res) => {
    return res.status(200).json({
        status:true,
        massage:"Raout workin Sucessfully",

    })
})

app.listen(port, ()=> {
    console.log("Server run on Port No:"+port);
})