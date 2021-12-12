// include librerry

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const verifyToken = require('./../middlewear/VarifyToken');



//include user models

const User =  require('./../Models/UserModel');
const Team = require('./../Models/TeamModel');


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

router.post("/newteam", 
verifyToken
,
[
    check("name").not().isEmpty().withMessage("Please Enter Team Name").trim().escape(),
    check("dsc").not().isEmpty().withMessage("Please Enter Your Team Description").trim().escape(),
    
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

//save new team data in database
const newTeam = new Team( {
    name:req.body.name,
    dsc:req.body.dsc,
    user: req.user.id
})

   newTeam.save().then(team => {
       
    return res.status(200).json({
        status:true,
        massage:"New Team Created Sucessfully...",
        team:{
            id: team._id,
           name:team.name,
           dsc:team.dsc,
           user_id:team.user
        }
       })


   }).catch(error => {
       console.log(error);
    return res.status(500).json({
        status:false,
        massage:"Database Error",
        error:{
            db_error:"some error in database"
        }
      

    })

   })

   });

//all team raouts

//all team raout
//method = get
//access = pulic

router.get("/allTeam", (req , res) => {

    Team.find({}, {_id:0, __v:0,createdAt:0}).populate("user",["username"]).then(teams => {

        return res.status(200).json({
            status:true,
            team:teams
    
        })

    }).catch(err => {
        return res.status(500).json({
            status:false,
            massage:"Database Error",
            error:{
                db_error:"some error in database"
            }
          
    
        })
    

    })


    
})
//perticuller user team raouts

//all team raout
//method = get
//access = private

router.get("/my",
verifyToken, 
(req , res) => {

    Team.find({user:req.user.id}, {_id:0, __v:0,createdAt:0}).populate("user",["username"]).then(teams => {

        return res.status(200).json({
            status:true,
            team:teams
    
        })

    }).catch(err => {
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