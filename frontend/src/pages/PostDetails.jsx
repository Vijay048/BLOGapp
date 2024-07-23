import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footers from '../components/Footers'
import { BiEdit } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import Comment from '../components/Comment'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { URL } from '../url'
import { UserContext } from '../context/UserContext'
import Loader from '../components/Loader'
import { IF } from '../url'

const PostDetails = () => {

    const {user} = useContext(UserContext)

    const postId = useParams().id;
    const [post, setPost] = useState({})
    const [loader,setLoader] = useState(false);

    const [comments,setComments] = useState([]);

    const [comment,setComment] = useState("");

    const navigate = useNavigate();

    const fetchPost = async () => {
        setLoader(true)
        try {
            const res = await axios.get(URL + "/api/posts/" + postId)
            console.log(res.data)
            setPost(res.data);

            setLoader(false)
        } catch (error) {
            console.log(error)
            setLoader(false)
        }
    }

    const handleDeletePost = async ()=>{
        try {
            const res = await axios.delete(URL+"/api/posts/"+postId,{withCredentials:true});
            console.log(res.data);
            navigate('/');
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPost()
    }, [postId])


    const fetchPostComments = async ()=>{
        try {
            const res = await axios.get(URL+"/api/comments/post/"+postId,{withCredentials:true})

            setComments(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchPostComments()
    },[postId])


    const postComment = async (e)=>{
        e.preventDefault();
        try {
            const res = await axios.post(URL+"/api/comments/create",{comment:comment,author:user.username,postId:postId,userId:user._id},{withCredentials:true});

            // fetchPostComments()
            // setComment("");
            window.location.reload(true);

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Navbar />

            {loader ? <div className='h-[80vh] w-full flex justify-center items-center'><Loader/></div> : <div className='px-8 md:px-[200px] mt-8'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-bold text-black md:text-3xl'>{post.title}</h1>
                    {
                        user?._id === post?.userId && <div className='flex items-center justify-center space-x-4'>
                        <p onClick={(e)=> navigate("/edit/"+postId)} className='cursor-pointer'><BiEdit size={'24px'} /></p>
                        <p onClick={handleDeletePost} className='cursor-pointer'><MdDelete size={'24px'} /></p>
                    </div>
                    }
                </div>

                <div className='flex items-center justify-between mt-2 md:mt-4'>
                    <p>{"@" + post.username}</p>
                    <div className='flex space-x-2'>
                        <p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
                        <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
                    </div>
                </div>

                <img src={IF+post.photo} className='w-full h-[80vh] mx-auto mt-8' alt="" />

                <p className='mx-auto mt-8'>{post.desc}</p>

                <div className='flex items-center mt-8 space-x-4 font-semibold'>
                    <p>Categories:</p>
                    <div className='flex justify-center items-center space-x-2'>
                        {
                            post.categories?.map((category, index) => {
                                return (
                                    <div key={index} className="bg-gray-300 rounded-lg px-3 py-1">
                                        {category}
                                    </div>
                                )
                            })
                        }
                        
                    </div>
                </div>

                <div className='flex flex-col mt-4'>
                    <h3 className='mt-6 mb-4 font-semibold'>Comments:</h3>
                    {/* comment */}
                    {
                        comments?.map((comment)=>{
                            return (
                                <Comment key={comment._id} comment={comment}/>
                            )
                        })
                    }

                </div>

                {/* write Comments */}
                <div className='w-full flex flex-col mt-4 md:flex-row'>
                    <input onChange={(e)=> setComment(e.target.value)} className='md:w-[80%] outline-none px-4 mt-4 md:mt-0' type="text" placeholder='Write a comment...' />
                    <button onClick={postComment} className='bg-black text-sm text-white px-4 py-2 md:w-[20%] mt-4 md:mt-0'>Add Comment</button>
                </div>
            </div>}

            <Footers />
        </div>
    )
}

export default PostDetails