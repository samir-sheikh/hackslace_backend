//include librerry
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT;

const database = require('./database');


//include routes

const userRaout = require('./routs/UserRout');
const teamRaout = require('./routs/Team')
const chatRaout = require('./routs/Chatraout')



//middlewear setup
app.use(cors());

app.use("/api/user" , userRaout);
app.use("/api/team" , teamRaout);
app.use("/api/chat" , chatRaout);

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