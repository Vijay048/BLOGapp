import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footers from '../components/Footers'
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { URL } from '../url';
import HomePost from '../components/HomePost';
import Loader from '../components/Loader';

const MyBlogs = () => {
    const [posts,setPosts] = useState([]);

  const [noResults,setNoResults] = useState(false);
  const [loader, setLoader] = useState(false)

  const {search} = useLocation();

  const {user} = useContext(UserContext);

  const fetchPosts = async ()=>{
    setLoader(true)
    try {
      const res = await axios.get(URL+"/api/posts/user/"+user._id)

      console.log(res.data);

      setPosts(res.data);

      if(res.data.length === 0){
        setNoResults(true);
      }else{
        setNoResults(false);
      }

      setLoader(false)

    } catch (error) {
      console.log(error);
      setLoader(false)
    }
  }

  useEffect(()=>{
    fetchPosts()
  },[search])

    return (
        <div>
            <Navbar />

            <div className='px-8 md:px-[200px] min-h-[80vh]'>
                {
                    loader ? <div className='h-[40vh] flex justify-center items-center'><Loader /></div> : (!noResults ? posts.map((post) => {
                        return (
                            <>
                                <Link to={user ? `/posts/post/${post._id}` : "/login"}>
                                    <HomePost key={post._id} post={post} />
                                </Link>
                            </>
                        )
                    }) :
                        <h3 className='text-center font-bold mt-16'>No posts available</h3>)
                }
            </div>

            <Footers />
        </div>
    )
}

export default MyBlogs