import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Menu } from 'primereact/menu';
import { MemberstackProtected } from "@memberstack/react";
import * as fn from './../shared/fn';

const NavMenu = (props) => {
    const subdir = fn.getSubDirectory();
    const [activeMenuIndex, setActiveMenuIndex] = useState(-1);
    
    // useEffect(() => {
    //
    // }) 

    const handleMenuClick = (idx) => {
        setActiveMenuIndex(idx)
        props.toggleSidebar(false);
    }

    let items = [
        {
            label: 'Dashboard',
            template: (item, options) => {
                return (
                    <div className="nav-item flex align-items-center cursor-pointer">
                        <div className={`icon icon-nav icon-dashboard ${activeMenuIndex===0 && subdir==='dashboard' ? 'selected' : ''}`}></div>                        
                        <Link to='dashboard' onClick={() => handleMenuClick(0)} 
                            className={` ${activeMenuIndex===0 && subdir==='dashboard' ? 'selected' : ''}`}>Dashboard</Link>                                    
                    </div>
                );
            }
        },
        {
            label: 'Foundations',
            template: (item, options) => {
                return (
                    <div className="nav-item flex align-items-center cursor-pointer">
                        <div className={`icon icon-nav icon-foundations ${activeMenuIndex===1 && subdir==='foundations' ? 'selected' : ''}`}></div>
                        <Link to='foundations' onClick={() => handleMenuClick(1)} 
                            className={` ${activeMenuIndex===1 && subdir==='foundations' ?  'selected' : ''}`}>Foundations</Link>
                    </div>
                );
            }
        },
        {
            label: 'Blog',
            template: (item, options) => {
                return (
                    <div className="nav-item sub--menu-item flex align-items-center cursor-pointer">
                        <div className={`icon icon-nav icon-blog ${activeMenuIndex===2 && subdir==='blog' ? 'selected' : ''}`}></div>
                        <Link to='blog' onClick={() => handleMenuClick(2)} 
                            className={` ${activeMenuIndex===2 && subdir==='blog' ? 'selected' : ''}`}>Enlightened Hbarbarian</Link>
                    </div>
                );
            }
        },
        {
            label: 'Analytics',
            template: (item, options) => {
                return (        
                    <div className="nav-item sub--menu-item flex align-items-center cursor-pointer">
                        <div className={`icon icon-nav icon-analytics ${activeMenuIndex===3 && subdir==='analytics' ? 'selected' : ''}`}></div>
                        <Link to='analytics' onClick={() => handleMenuClick(3)} 
                            className={` ${activeMenuIndex===3 && subdir==='analytics' ? 'selected' : ''}`}>Valuation Model</Link>                                    
                    </div>
                );
            }
        },
        {
            label: 'Chart Book',
            template: (item, options) => {
                return (
                    <div className="nav-item sub--menu-item flex align-items-center cursor-pointer">
                        <div className={`icon icon-nav icon-use-cases ${activeMenuIndex===4 && subdir==='chartbook' ? 'selected' : ''}`}></div>
                        <Link to='chartbook' onClick={() => handleMenuClick(4)} 
                            className={` ${activeMenuIndex===4 && subdir==='chartbook' ? 'selected' : ''}`}>Chart Book</Link>
                    </div>
                );
            }
        },                        
        {
            label: 'Governing Council',
            template: (item, options) => {
                return (
                    <div className="nav-item sub--menu-item flex align-items-center cursor-pointer">
                        <div className={`icon icon-nav icon-govcouncil ${activeMenuIndex===5 && subdir==='govcouncil' ? 'selected' : ''}`}></div>
                        <Link to='gc' onClick={() => handleMenuClick(5)} 
                            className={` ${activeMenuIndex===5 && subdir==='govcouncil' ? 'selected' : ''}`}>Governing Council</Link>
                    </div>
                );
            }
        },
        {
            label: 'Hedera Name Service',
            template: (item, options) => {
                return (
                    <div className="nav-item sub--menu-item flex align-items-center cursor-pointer">
                        <div className={`icon icon-nav icon-hns ${activeMenuIndex===6 && subdir==='hns' ? 'selected' : ''}`}></div>
                        <Link to='hns' onClick={() => handleMenuClick(6)} 
                            className={` ${activeMenuIndex===6 && subdir==='hns' ? 'selected' : ''}`}>Hedera Name Service</Link>
                    </div>
                );
            }
        },
        {
            label: 'Forum',
            template: (item, options) => {
                return (
                    <div className="nav-item sub--menu-item flex align-items-center cursor-pointer">
                        <div className={`icon icon-nav icon-forum ${activeMenuIndex===7 && subdir==='forum' ? 'selected' : ''}`}></div>
                        <Link to='forum' onClick={() => handleMenuClick(7)} 
                            className={` ${activeMenuIndex===7 && subdir==='forum' ? 'selected' : ''}`}>Forum</Link>
                    </div>
                );
            }
        },
        {
            label: 'Member Services',
            template: (item, options) => {
                return (
                    <div className="nav-item sub--menu-item flex align-items-center cursor-pointer">
                        <div className={`icon icon-nav icon-membersvcs ${activeMenuIndex===8 && subdir==='membersvcs' ? 'selected' : ''}`}></div>
                        <Link to='membersvcs' onClick={() => handleMenuClick(8)} 
                            className={` ${activeMenuIndex===8 && subdir==='membersvcs' ? 'selected' : ''}`}>Member Services</Link>
                    </div>
                );
            }
        },
        {
            label: 'Profile',
            template: (item, options) => {
                return (
                    <div className="nav-item flex align-items-center cursor-pointer p--3 border--round transition--duration-150 transition--colors w--full">
                        <div className={`icon icon-nav icon-profile ${activeMenuIndex===9 && subdir==='profile' ? 'selected' : ''}`}></div>
                        <Link to='profile' onClick={() => handleMenuClick(9)} 
                            className={` ${activeMenuIndex===9 && subdir==='profile' ? 'selected' : ''}`}>Profile</Link>                                    
                    </div>
                );
            }
        },
        {
            label: 'Admin',
            template: (item, options) => {
                return (
                    <MemberstackProtected allow={{
                        permissions: ["9703094d-7ef3-4293-994b-4aff487b5add"]
                    }}>
                        <div className="nav-item flex align-items-center cursor-pointer p--3 border--round transition--duration-150 transition--colors w--full">
                            <div className={`icon icon-nav icon-admin ${activeMenuIndex===10 && subdir==='admin' ? 'selected' : ''}`}></div>
                            <Link to='admin' onClick={() => handleMenuClick(10)} 
                                className={`text-xl ${activeMenuIndex===10 && subdir==='admin' ? 'selected' : ''}`}>Admin</Link>                                    
                        </div>
                    </MemberstackProtected>
                );
            }
        },
    ]

    return (  
        <div>
            <Menu className='nav-menu' model={items} />
        </div>  
    );
  }

  export default NavMenu