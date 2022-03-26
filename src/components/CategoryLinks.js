import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react'

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
            <Dropdown.Item><Link className="p-2 text-muted" to={`/category/${category}`} key={category}>{category}</Link></Dropdown.Item>
        );
    });

    return (
        <div className="p-4 p-md-0 mb-2 text-white rounded">
            <Dropdown
                text='Filter'
                icon='filter'
                floating
                labeled
                button
                className='icon'
            >
                <Dropdown.Menu>
                    <Dropdown.Header icon='tags' content='Filter by tag' />
                    <Dropdown.Divider />
                        {categoryLinks}
                </Dropdown.Menu>
            </Dropdown>
        </div>
        );
};

export default CategoryLinks;