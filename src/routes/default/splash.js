import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginButton from './../../components/buttons/login-button';
//import * as fn from './../../shared/fn';

const Splash = (props) => {
    //const [xxx, setXxx] = useState();
    const [plans, setPlans] = useState([]);

    const getMsPlans = async () => {
            window.$memberstackDom.getPlans()
                .then(({ data: allPlans }) => setPlans(allPlans))
                .catch();
    };

    useEffect(() => {
        if(plans.length > 0) return;
            getMsPlans();
    }, [plans])

        return (
            <div className={`splash`}>
                <div className={`gradient`}>
                    <div className={``}>
                        <div className={``}>
                            <h1 className="text-12xl">
                                <span className="leader">Web 3 insight and beyond.</span>
                            </h1>  
                        </div>
                        <div className={``}>
                            <p className="text-3xl text-gray-200 mt-3 mb-5">Get the Hashpoint insight on Hedera Hashgraph, 
                                the most widely used, and only enterprise-grade distributed ledger on the planet.
                            </p>
                        </div>
                        <div className={``}>
                            <ul className="list-none p-0 m-0 mb-6 text-xxl features-list">
                                <li className="mb-3 pl-5 flex align-items-center">
                                    <i className='icon icon-database primary' />
                                        &nbsp;&nbsp;Access to Hashpoint Data Services
                                </li>
                                <li className="mb-3 pl-5 flex align-items-center">
                                    <i className='icon icon-model primary' />
                                        &nbsp;&nbsp;The Hashpoint Equilibrium Valuation Model
                                </li>
                                <li className="mb-3 pl-5 flex align-items-center">
                                    <i className='icon icon-blog primary' />
                                        &nbsp;&nbsp;Access to The Enlightened Hbarbarian
                                </li>
                                <li className="mb-3 pl-5 flex align-items-center">
                                    <i className='icon icon-calculator primary' />
                                        &nbsp;&nbsp;Staking Rewards Tax Basis Calculator
                                </li>
                                <li className="mb-3 pl-5 flex align-items-center">
                                    <i className='icon icon-pulse primary' />
                                        &nbsp;&nbsp;Account Monitoring and Fraud & Scam Alerts
                                </li>
                                <li className="mb-3 pl-5 flex align-items-center">
                                    <i className='icon icon-notifications primary' />
                                        &nbsp;&nbsp;Hedera Domain Expiration Watch
                                </li>
                            </ul>
                            <div className="text-2xl mb-3 pl-5 flex align-items-center">
                                <div className="icon icon-dashboard link"></div>
                                &nbsp;&nbsp;
                                <Link to="/dashboard" className={`link`}>
                                    My Dashboard
                                </Link>
                                                                
                            </div>
                            <div className="text-2xl mb-3 pl-5 flex align-items-center button-as-link">
                            <div className="icon icon-login link"></div>
                                <LoginButton />
                            </div>
                        </div> 
                    </div>                              
                </div>
            </div>)
}

export default Splash