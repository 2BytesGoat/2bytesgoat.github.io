import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, Accordion } from 'semantic-ui-react';

const navbar = () => (
    <div className='container py-3 mb-4'>
        <div className="row">
            <div className="d-flex justify-content-center col-xs-6 col-sm-4">
                <i aria-hidden="true" class="github big icon"></i>
                <i aria-hidden="true" class="linkedin big icon"></i>
                <i aria-hidden="true" class="patreon big icon"></i>
            </div>
            <div className="d-flex justify-content-center col-xs-6 col-sm-4">
                <Link className="navbar-brand" to='/'>2BytesGoat</Link>    
            </div>
            <div className="d-flex justify-content-center col-xs-6 col-sm-4">
                <Search placeholder={"Search..."} />
            </div>
        </div>
        <div className="row">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="d-flex justify-content-center col-xs-18 col-sm-12">
                <ul className="navbar-nav">
                    <li className="nav-item active px-4">
                        <NavLink className="nav-link" exact to='/'>Home</NavLink>
                    </li>
                    <li className="nav-item px-4">
                        <NavLink className="nav-link" exact to='/blog'>Blog</NavLink>
                    </li>
                    <li className="nav-item px-4">
                        <NavLink className="nav-link" exact to='/about'>About</NavLink>
                    </li>
                </ul>
                </div>
            </nav>
        </div>
    </div>
);

export default navbar;




    // <li className="nav-item dropdown">
    //     <NavLink className="nav-link px-2 link-secondary" exact to='/blog'>Blog</NavLink>
    // </li>