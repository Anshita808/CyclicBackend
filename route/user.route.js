const express = require("express");
const {UserModel} = require("../model/user.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 


/*
 * @swagger
 * components:
 *  schemas:
 *     Users:
 *        type: object
 *        properties:
 *             id:
 *                type: string
 *             name:
 *                 type: string
 *             email:
 *                 type: string
 *             password:
 *                 type:string
 */
/*
* @swagger
* tags:
*  title: user
*  description: All the API routes related to User
*/
/**
* @swagger
* /user/register:
*   post:
*     summary: To post the details of a new user
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Users'
*     responses:
*       200:
*         description: The User was successfully added
*     content:
*       application/json:
*         schema:
*            $ref: '#/components/schemas/Users'
*       500:
*         description: Some server error
*/

userRouter.post("/Register",async(req,res)=>{
    const {name,email,password,age}=req.body
    try {
        const isemail = await UserModel.findOne({email})
        if(isemail){
            res.status(400).send({"msg":"user already registered"});
        }
        bcrypt.hash(password, 5, async(err, hash)=> {
            
            const user = new UserModel({name,email,password:hash,age})
             await user.save()
            res.status(200).send(user)
        });
    } catch (error) {
        res.status(400).send({err:"user not register"})
    }
})

// login
// userRoute.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//       const user = await UserModel.find({ email: email, password: password });
//       user.length > 0 ? res.status(200).send({msg: "login successful", token: jwt.sign({ name: "shahbaz" }, "superman"),}): res.status(400).send({ err: "Login failed" });
//     } catch (error) {
//       res.status(400).send({ msg: err.message});
//     }
//   });

/**
* @swagger
* /user/login:
*   post:
*     summary: To login registereed users
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Users'
*     responses:
*       200:
*         description: User login successfully
*     content:
*       application/json:
*         schema:
*            $ref: '#/components/schemas/Users'
*       500:
*         description: Some server error
*/

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password, (err,result)=>{
                if(result){
                    res.status(200).send({"msg":"Login Sucessful","token":jwt.sign({"userID":user._id},"masai")})
                }else{
                    res.status(400).send({"msg":"Wrong Credentials"})
                }
            })
        }
        // user.length>0 ?res.status(200).send({msg:"login sucessful","token":jwt.sign({name:"Anshita"},"soon",{expiresIn:"1h"}),}):
        // res.status(400).send({err:"Login failed"});


    } catch (error) {
        res.status(400).send({err:"login failed"});
    }
})

userRouter.get("/data", async(req,res)=>{
    const token = req.headers.authorization
    jwt.verify(token, 'soon', (err, decoded)=> 
        { decoded ? res.status(200).send({ msg: "User Details" }) : res.status(400).send({ err: "login required, Cannot access restricted route" });
      });
})


// userRoute.get("/data", async (req, res) => {
//     const token  = req.headers.authorization
//     jwt.verify(token, "superman", (err, decoded) => { decoded ? res.status(200).send({ msg: "User Details" }) : res.status(400).send({ err: "login required, Cannot access restricted route" });
//     });
//   });


module.exports={
  userRouter
}