const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { route } = require('./auth');
const verifyToken = require('../verifyToken');
const Comment = require('../models/Comment');


// create
router.post('/create', verifyToken, async (req,res) => {
    try {
        const newPost = new Post(req.body);

        const savedPost = await newPost.save();

        res.status(200).json(savedPost);
    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})


// update
router.put('/:id', verifyToken, async (req,res)=>{
    try {

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {$set: req.body},{new:true});
        
        res.status(200).json(updatedPost)
    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})


// delete
router.delete('/:id', verifyToken, async (req,res)=>{
    try {
        await Post.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({postId: req.params.id})
        res.status(200).json({
            msg:"Post has been deleted."
        })
    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})


// get post details
router.get('/:id', async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        res.status(200).json(post);

    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})


// get posts
router.get('/', async (req,res) => {
    const query = req.query;
    try {
        const searchFilter = {
            title:{$regex:query.search, $options:"i"}
        }

        const posts = await Post.find(query.search ? searchFilter : null)

        res.status(200).json(posts);

    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})


// get user posts
router.get('/user/:userId', async (req,res) => {
    try {
        const posts = await Post.find({userId:req.params.userId});
        // console.log(posts)
        res.status(200).json(posts);

    } catch (error) {
        return res.status(500).json({
            msg:error.message
        })
    }
})



module.exports = router