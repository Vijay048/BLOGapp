const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { route } = require('./auth');
const verifyToken = require('../verifyToken');


// create
router.post('/create', verifyToken, async (req,res) => {
    try {
        const newComment = new Comment(req.body);

        const savedComment = await newComment.save();

        res.status(200).json(savedComment);
    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})


// update
router.put('/:id', verifyToken, async (req,res)=>{
    try {

        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {$set: req.body},{new:true});
        
        res.status(200).json(updatedComment)
    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})


// delete
router.delete('/:id', verifyToken, async (req,res)=>{
    try {
        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            msg:"Comment has been deleted."
        })
    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})


// get post comments
router.get('/post/:postId', async (req,res) => {
    try {
        const comments = await Comment.find({postId:req.params.postId});
        // console.log(posts)
        res.status(200).json(comments);

    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})



module.exports = router