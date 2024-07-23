const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const verifyToken = require('../verifyToken');

// update
router.put('/:id', verifyToken, async (req,res) => {
    try {

        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hashSync(req.body.password,salt);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})

        res.status(200).json(updatedUser);

    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})



// delete
router.delete('/:id', verifyToken, async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Post.deleteMany({userId:req.params.id});
        await Comment.deleteMany({userId:req.params.id});

        res.status(200).json({
            msg:"User has been deleted."
        })

    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})




// getuser
router.get('/:id', async (req,res) => {
    try {
        const user = await User.findById(req.params.id);

        //for hiding password
        const {password,...info} = user._doc;

        res.status(200).json(info)
    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})




module.exports = router