// include librerry

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const verifyToken = require('./../middlewear/VarifyToken');



//include user models

const User =  require('./../Models/UserModel');
const Team = require('./../Models/TeamModel');
const Chat = require('./../Models/ChatModel');


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

//message raout
//method = post
//access = private

router.post('/new',

verifyToken,
[
    check("message").not().isEmpty().withMessage("Please Enter message").trim().escape(),
    check("team").not().isEmpty().withMessage("Please Enter team id").trim().escape(),
    check("to").not().isEmpty().withMessage("Please Enter to id").trim().escape(),


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
 //save new team data in database
const newChat = new Chat({
    message:req.body.message,
    team:req.body.team,
    to: req.body.to,
    from:req.user.id
})

   newChat.save().then(chat => {
       
    return res.status(200).json({
        status:true,
        massage:"message save sucessfully......",
        chat:chat
       })


   }).catch(error => {

   console.log(error);
       
    return res.status(500).json({
        status:false,
        massage:"Database Error",
        error:{
            db_error:"some error in database last"
        }
      

    })

   })

    
})






module.exports= router;