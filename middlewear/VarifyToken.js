// include librrey
const jwt = require('jsonwebtoken');
const User = require('./../Models/UserModel');
const token_key = process.env.TOKEN_KEY;


function verifyToken(req, res, next) {
    //get token form header

    const token = req.headers["x-access-token"];
    //is token is empty
    if(!token){
        return res.status(404).json({
            status:false,
            massage:"Token Not Provided",
            error:{
                token_error:"Token Not Provided"
            }
           })
         }

         //verify token

        jwt.verify(token,token_key, function(error, decoded){

            //check error
            if(error){

                return res.status(404).json({
                    status:false,
                    massage:"Token Decription Errro",
                    error:{
                        token_error:"Token Decription Errro"
                    }
                   })

            }

            //check user id is present in database or not
            User.findById({ _id:decoded.id }, {password:0, createdAt:0, })
            .then(user => {

                if(!user){
                    return res.status(404).json({
                        status:false,
                        massage:"User Token Invalid",
                        error:{
                            token_error:"User Token Invalid"
                        }
                       })
                    }
        //add user object in requiest

        req.user= {
            id:user._id,
            username: user.username,
            email: user.email
        };
        next();

            }).catch(error => {

                return res.status(502).json({
                    status:false,
                    massage:"Database Errror",
                    error:{
                        token_error:"Database Errror"
                    }
                   })

            })
        })
}

module.exports = verifyToken;