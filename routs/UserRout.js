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

//defaut raout
//method = Post
//access = pulic

router.post("/register", 
[
    check("username").not().isEmpty().withMessage("Please Enter Your Username").trim().escape(),
    check("password").not().isEmpty().withMessage("Please Enter Your Password").trim().escape(),
    check("password1").not().isEmpty().withMessage("Please Enter Your Password").trim().escape(),
    check("email").isEmail().normalizeEmail().withMessage("Please Enter Your email").trim().escape(),
]
,

(req , res) => {

//check validation erros

const errors = validationResult(req);

    if(!errors.isEmpty()){
       
        let error ={};
        for(index=0; index < errors.array().length; index++){
            error = {
                ...error,
                [errors.array()[index].param]:errors.array()[index].msg
            }
        } 
        return res.status(400).json({
            status:false,
            massage:"Form Validation Error..",
            error:error
    
        })
}
    //check password and password1 is match or not
    if(req.body.password != req.body.password1){
        return res.status(400).json({
            status:false,
            massage:"Form Validation Error..",
            error:{
                password1:"Retype password is not matched"
            }
    
        })

    }

    //check email is exist or not
    User.findOne({email: req.body.email}).then(user =>{

    //if user exists
    if(user){
        return res.status(400).json({
            status:true,
            massage:"User already exist",
            error: {
                email:"Email already exists"
            }
          })
         }else{

              //password hashed
         let salt = bcypt.genSaltSync(10);
         let hashedPassword = bcypt.hashSync(req.body.password, salt);

         return res.status(200).json({
            status:true,
            massage:"User Registration Sucessfully",
            password:hashedPassword
           })

         }
       

    }).catch(error => {
        return res.status(500).json({
            status:true,
            massage:"Database Error",
            error:{
                db_error:"some error in database"
            }
          
    
        })

    })

   
})

module.exports= router;