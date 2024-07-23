const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET="hellomynameissuzisuziiskuzi"


// register
router.post('/register', async (req,res) => {
    try {
        
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({
                msg:"All fields are required."
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                msg:"User already exists."
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hashSync(password,salt);

        const newUser = new User({username, email, password:hashedPassword});
        const savedUser = await newUser.save();

        res.status(200).json(savedUser);

    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})



//login
router.post('/login', async (req,res) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                msg:"User not found."
            })
        }

        const match = await bcrypt.compare(req.body.password, user.password);

        if(!match){
            return res.status(401).json({
                msg:"Wrong Credentials."
            })
        }

        const token = jwt.sign({_id:user._id,username:user.username,email:user.email}, process.env.SECRET, { expiresIn: "3d"})

        const {password,...info} = user._doc;
        
        res.cookie("token", token,{
            httpOnly:true,
            secure:true,
            sameSite:'strict'
        }).status(200).json(info)

    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})




//logout
router.get('/logout', async (req,res)=>{
    try {
        res.clearCookie("token", {sameSite:"none", secure:true}).status(200).json({
            msg:"User logout successfully."
        })
        
    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})



// refetch user
router.get("/refetch", async (req,res)=>{
    const token=req.cookies.token
    // console.log(token)
    jwt.verify(token,process.env.SECRET,{},async (err,data)=>{
        if(err){
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })
})




module.exports = router