import React from 'react';
//import { Link } from 'react-router-dom';

const Features = (props) => {  
        return (
            <div className={``}>
                <div id="features" className="px-4 my-8 py-0 md:px-6 lg:px-8 overflow-y explore-features">
                        
                    <div id="feature1" className="flex lg:justify-content-center mb-5 mt-5">
                        <div className="py-3 pr-8 pl-3 w-30rem hidden lg:block">
                        </div>
                        <div className="flex flex-column align-items-center w-2rem">
                            <span className="bg-indigo-300 text-0 flex align-items-center justify-content-center border-circle" 
                                style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}>1</span>
                            <div className="h-full bg-indigo-300" style={{ width: '2px', minHeight: '4rem' }}></div>
                        </div>
                        <div className="py-3 pl-5 lg:pl-8 pl-3 lg:w-30rem feature feature-right feature-1">
                            <div className="text-900 text-xl mb-2 font-medium">Hashpoint Data Services</div>
                            <span className="block text-900 line-height-3 mb-3">Access to real-time network statistics, analysis of HBAR
                                distribution patterns, and our proprietary Hedera staking model.
                            </span>
                            <div className="pt-3 border-top-1 border-300">
                                <div className="mb-2 line-height-3"><span className="text-900 font-medium">Network explorers provide access to massive volumes of data; Hashpoint curates and
                                    interprets that data to provide meaningful actionable insights to investors.  Gain the conviction required to fully participate in the long-term wealth creation process
                                    of the Hedera Hashgraph revolution.</span></div>                    
                            </div>
                        </div>
                    </div>
                    
                    {/* ---------------------- 2 ------------------- */}
                    <div id="feature2" className="flex justify-content-center mb-5">
                        <div className="py-3 pl-5 pr-3 lg:pr-8 lg:pl-3 lg:w-30rem flex-order-1 lg:flex-order-0 feature feature-left feature-2">
                            <div className="text-900 text-xl mb-2 font-medium">The Hashpoint Equilibrium Valuation Model</div>
                            <span className="block text-900 line-height-3 mb-3">
                            Does Hedera have bad tokenomics? Does the market cap of $HBAR matter? How does network TPS influence valuation?</span>
                            <div className="pt-3 border-top-1 border-300">
                                <div className="mb-2 line-height-3"><span className="text-900 font-medium">Hashpoint’s Equilibrium Valuation Model - updated in
                                    real-time - is the correct framework for for valuing $hbar, and provides real-time
                                    updated fair value estimates for $hbar along with interactive scenario based price forecasts.</span></div>
                                
                            </div>
                        </div>
                        <div className="flex flex-column align-items-center w-2rem flex-order-0 lg:flex-order-1">
                            <span className="bg-yellow-300 text-0 flex align-items-center justify-content-center border-circle" 
                                style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}>2</span>
                            <div className="h-full bg-yellow-300" style={{ width: '2px', minHeight: '4rem' }}></div>
                        </div>
                        <div className="py-3 pl-8 pr-3 w-30rem hidden lg:block flex-order-2">                
                        </div>
                    </div>

                    {/* ------------------ 3 ----------------------- */}       
                    <div id="feature3" className="flex justify-content-center mb-5">
                        <div className="py-3 pr-8 pl-3 w-30rem hidden lg:block ">
                        </div>
                        <div className="flex flex-column align-items-center w-2rem">
                            <span className="bg-cyan-500 text-0 flex align-items-center justify-content-center border-circle" 
                                style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}>3</span>
                            <div className="h-full bg-cyan-500" style={{ width: '2px', minHeight: '4rem' }}></div>
                        </div>
                        <div className="py-3 pl-5 lg:pl-8 pl-3 lg:w-30rem feature feature-right feature-3">
                            <div className="text-900 text-xl mb-2 font-medium">Access to The Enlightened Hbarbarian</div>
                            <span className="block text-900 line-height-3 mb-3">Become an Enlightened Hbarbarian with a subscription to Hashpoint Research which
                                provides access to our proprietary data service, and research newsletter.</span>
                            <div className="pt-3 border-top-1 border-300">
                                <div className="mb-2 line-height-3"><span className="text-900 font-medium">Complex
                                    ideas are made accessible, investment and blockchain falsehoods are exposed, 
                                    and the FUD, myths and misunderstandings that are the mainstay of public
                                    message boards are dispelled. </span></div>
                            </div>
                        </div>
                    </div>

                    {/* -------------------- 4 --------------------- */}
                    <div id="feature4" className="flex justify-content-center mb-5">
                        <div className="py-3 pl-5 pr-3 lg:pr-8 lg:pl-3 lg:w-30rem flex-order-1 lg:flex-order-0 feature feature-left feature-4">
                            <div className="text-900 text-xl mb-2 font-medium">Access the discussion on the forum</div>
                            <span className="block text-900 line-height-3 mb-3">Leading experts on Hedera Hashgraph and HBAR yada... yada... yada...
                            </span>
                            <div className="pt-3 border-top-1 border-300">
                                <div className="mb-2 line-height-3">
                                    <span className="text-900 font-medium">
                                        Hashpoint Contributors are often the first to learn of new developments relating to Hedera Hashgraph 
                                        yada... yada... yada...                   
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-column align-items-center w-2rem flex-order-0 lg:flex-order-1">
                            <span className="bg-pink-300 text-0 flex align-items-center justify-content-center border-circle" 
                                style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}>4</span>
                            <div className="h-full bg-pink-300" style={{ width: '2px', minHeight: '4rem' }}></div>
                        </div>
                        <div className="py-3 pl-8 pr-3 w-30rem hidden lg:block flex-order-2">
                        </div>
                    </div>

{/* ----------------------- 5 ------------------ */}
<div id="feature5" className="flex justify-content-center mb-5">
                        <div className="py-3 pr-8 pl-3 w-30rem hidden lg:block">
                        </div>
                        <div className="flex flex-column align-items-center w-2rem">
                            <span className="bg-blue-300 text-0 flex align-items-center justify-content-center border-circle" 
                                style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}>5</span>
                            <div className="h-full bg-blue-300" style={{ width: '2px', minHeight: '4rem' }}></div>
                        </div>
                        <div className="py-3 pl-5 lg:pl-8 pl-3 lg:w-30rem feature feature-right feature-5">
                            <div className="text-900 text-xl mb-2 font-medium">Staking Rewards Tax Basis Calculator</div>
                            <span className="block text-900 line-height-3 mb-3">Updates when daily
                                staking rewards are paid which simplifies tax reporting requirements.
                                </span>
                            <div className="pt-3 border-top-1 border-300">
                                <div className="mb-2 line-height-3"><span className="text-900 font-medium">Need something here...</span></div>
                            </div>
                        </div>
                    </div>

                    {/* -------------------- 6 --------------------- */}
                    <div id="feature6" className="flex justify-content-center mb-5">
                        <div className="py-3 pl-5 pr-3 lg:pr-8 lg:pl-3 lg:w-30rem flex-order-1 lg:flex-order-0 feature feature-left feature-6">
                            <div className="text-900 text-xl mb-2 font-medium">Account Monitoring and Fraud & Scam Alerts</div>
                            <span className="block text-900 line-height-3 mb-3">Helps protect you and your assets from malicious activity by being immediate notified 
                                of any activity in your accounts and made aware of new frauds targeting the Hedera ecosystem
                            </span>
                            <div className="pt-3 border-top-1 border-300">
                                <div className="mb-2 line-height-3">
                                    <span className="text-900 font-medium">
                                        Need something here...
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-column align-items-center w-2rem flex-order-0 lg:flex-order-1">
                            <span className="bg-yellow-300 text-0 flex align-items-center justify-content-center border-circle" 
                                style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}>6</span>
                            <div className="h-full bg-yellow-300" style={{ width: '2px', minHeight: '4rem' }}></div>
                        </div>
                        <div className="py-3 pl-8 pr-3 w-30rem hidden lg:block flex-order-2">
                        </div>
                    </div>

                    {/* ----------------------- 7 ------------------ */}
                    <div id="feature7" className="flex justify-content-center mb-5">
                        <div className="py-3 pr-8 pl-3 w-30rem hidden lg:block">
                        </div>
                        <div className="flex flex-column align-items-center w-2rem">
                            <span className="bg-orange-400 text-0 flex align-items-center justify-content-center border-circle" 
                                style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}>7</span>
                            <div className="h-full bg-orange-400" style={{ width: '2px', minHeight: '4rem' }}></div>
                        </div>
                        <div className="py-3 pl-5 lg:pl-8 pl-3 lg:w-30rem feature feature-right feature-7">
                            <div className="text-900 text-xl mb-2 font-medium">Hedera Domain Expiration Watch</div>
                            <span className="block text-900 line-height-3 mb-3">Need something here
                                </span>
                            <div className="pt-3 border-top-1 border-300">
                                <div className="mb-2 line-height-3"><span className="text-900 font-medium">...and here.</span></div>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        )
}

export default Features