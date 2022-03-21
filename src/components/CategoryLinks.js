import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CategoryLinks = () => {
    const [categories, setCategories] =  useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/all-categories`);
                setCategories(res.data);
            }
            catch (err) {
            }
        }
        fetchCategories();
    }, []);

    let categoryLinks = [];
       
    categories.map(category => {
        return categoryLinks.push(
            <Link className="p-2 text-muted" to={`/category/${category}`} key={category}>{category}</Link>
        );
    });

    return (
        <div className="nav-scroller py-1 mb-2">
            <nav className="nav d-flex">
                {categoryLinks}
            </nav>
        </div>
        );
};

export default CategoryLinks;