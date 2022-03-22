import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Search } from 'semantic-ui-react';

const navbar = () => (
    <div className='container py-3 mb-4'>
        <div className="row">
            <div className="d-flex justify-content-start col-xs-6 col-sm-4">
                <a class="link-dark" href="https://github.com/2BytesGoat">
                    <i aria-hidden="true" class="github big icon" />
                </a>
                <a class="link-dark" href="https://www.patreon.com/2bytesgoat">
                    <i aria-hidden="true" class="patreon big icon"></i>
                </a>
            </div>
            <div className="d-flex justify-content-center col-xs-6 col-sm-4">
                <Link className="navbar-brand" to='/'><h1>2BytesGoat</h1></Link>    
            </div>
            <div className="d-flex justify-content-end col-xs-6 col-sm-4 flex-wrap">
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
                        <NavLink className="nav-link" exact to='/projects'>Projects</NavLink>
                    </li>
                    <li className="nav-item px-4">
                        <NavLink className="nav-link" exact to='/about'>About</NavLink>
                    </li>
                    <li className="nav-item px-4">
                        <NavLink className="nav-link" exact to='/contact'>Contact</NavLink>
                    </li>
                </ul>
                </div>
            </nav>
        </div>
    </div>
);

export default navbar;