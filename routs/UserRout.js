// include librerry

const express = require('express');
const router = express.Router();
const bcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const token_key = process.env.TOKEN_KEY;



//include user models

const User =  require('./../Models/UserModel');


//middlewear setup

router.use(express.json());
router.use(express.urlencoded({extended:true}));

//defaut raout
//method = get
//access = pulic

router.get('/', (req , res) => {
    return res.status(200).json({
        status:true,
        massage:"User Raout workin Sucessfully",

    })
})

module.exports= router;