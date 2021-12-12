// include librerry

const express = require('express');
const router = express.Router();
const bcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const token_key = process.env.TOKEN_KEY;



//include user models

const User =  require('./../Models/UserModel');
const bcrypt = require('bcryptjs/dist/bcrypt');


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

//Register raout
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
            status:false,
            massage:"User already exist",
            error: {
                email:"Email already exists"
            }
          })
         }else{

              //password hashed
         let salt = bcypt.genSaltSync(10);
         let hashedPassword = bcypt.hashSync(req.body.password, salt);

         //Save user in data base
         const newUser = new User({
             username:req.body.username,
             email:req.body.email,
             password:hashedPassword
         })

         //save users
         newUser.save().then(user => {
             console.log(user)

            return res.status(200).json({
                status:true,
                massage:"User Registration Sucessfully",
                user:{
                    id:user._id,
                    username:user.username,
                    email:user.email,


                }
               })
    

         }).catch(error => {
        
            return res.status(500).json({
                status:false,
                massage:"Database Error",
                error:{
                    db_error:"some error in database"
                }
              
        
            })

         }) }
       

    }).catch(error => {
        return res.status(500).json({
            status:false,
            massage:"Database Error",
            error:{
                db_error:"some error in database"
            }
          
    
        })

    })

   
});

//Login raout
//method = Post
//access = pulic

router.post("/login",
[
    check("email").isEmail().normalizeEmail().withMessage("Please Enter Your email").trim().escape(),
    check("password").not().isEmpty().withMessage("Please Enter Your Password").trim().escape(),
],
 (req , res) => {
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
      //check email is exist or not
      User.findOne({email: req.body.email}).then(user =>{

        //if user is not exists
        if(!user){
            return res.status(400).json({
                status:false,
                massage:"User not exist",
                error: {
                    email:"Email not exists"
                }
              })
             }else{
    
                  //password matched or not

                let isPasswordMatch = bcypt.compareSync(req.body.password,user.password)
                if(!isPasswordMatch){

                    return res.status(400).json({
                        status:false,
                        massage:"Password not Matched ",
                        error: {
                            email:"Password not Matched"
                        }
                      })

                }
                //Genret Json web Token

                const authToken= jwt.sign(
                    {
                        id:user._id,
                        username:user.username,
                        email:user.email
                    },
                    token_key,
                    {
                        expiresIn:3600
                    }
                )

                return res.status(200).json({
                    status:true,
                    massage:"User Login Sucessfully",
                    user:{
                        id:user._id,
                        username:user.username,
                        email:user.email,
                         },
                        token: authToken
    })
             
     }
     }).catch(error => {
            return res.status(500).json({
                status:false,
                massage:"Database Error",
                error:{
                    db_error:"some error in database"
                }
              
        
            })
    
        })
    


   
})




module.exports= router;