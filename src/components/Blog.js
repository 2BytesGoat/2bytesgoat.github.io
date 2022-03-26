import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import BlogTooltip from './BlogTooltip'
import CategoryLinks from './CategoryLinks';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [featuredBlog, setFeaturedBlog] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/featured`);
                setFeaturedBlog(res.data[0]);
            }
            catch (err) {
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/`);
                setBlogs(res.data);
            }
            catch (err) {

            }
        }

        fetchBlogs();
    }, []);

    const getBlogs = () => {
        let list = [];
        let result = [];
        
        blogs.map(blogPost => {
            return list.push(
                <BlogTooltip id={blogPost.slug}></BlogTooltip>
            );
        });

        for (let i = 0; i < list.length; i += 2) {
            result.push(
                <div key={i} className='row mb-2'>
                    <div className='col-md-6'>
                        {list[i]}
                    </div>
                    <div className='col-md-6'>
                        {list[i+1] ? list[i+1] : null}
                    </div>
                </div>
            )
        }

        return result;
    };

    return (
        <div className='container'>
            <div className="p-4 p-md-5 mb-4 text-white rounded bg-dark">
                <div className="col-md-6 px-0">
                    <h1 className="display-4 font-italic">{featuredBlog.title}</h1>
                    <p className="lead my-3">{featuredBlog.excerpt}</p>
                    <p className="lead mb-0">
                    <Link to={`/blog/${featuredBlog.slug}`} className="text-white font-weight-bold">
                        Continue reading...
                    </Link>
                    </p>
                </div>
            </div>

            <CategoryLinks />
            
            <div className="row mb-2">
                {getBlogs()}
            </div>
        </div>
    );
};

export default Blog;