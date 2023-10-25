import React from 'react';
import { Tag } from 'primereact/tag';
import SignupButton from './../../components/buttons/signup-button';

const PlanBlock = (props) => {
    
    if(!props || !props.plans) return;
    
    return (
        <div className={``}>
            <div className="grid"> {                    
                    props.plans.map((plan, index) => (
                        plan.prices.sort(({amount:a}, {amount:b}) => a-b).map((price, idx) => (               
                            <div key={price.id} 
                                id={price.id} 
                                className={
                                    `ribbon-container plan-block plan-block-${price.name.toLowerCase().replace(' ', '')} 
                                    price-${price.name.toLowerCase().replace(' ', '')} 
                                    ${price.status.toLowerCase()==="inactive" ? 'hidden' : ''}
                                `}
                                data-ribbon="71% savings from annual rate!"
                            >
                                
                                <div className={`p-5 flex flex-column align-items-center gap-2 plan plan-${index}`}>                                     
                                    <div className={`text-2xl font-medium`}>{price.name}</div>
                                    <div className="mt-3 text-3xl font-bold plan-price ">${price.amount} 
                                        <span className='font-medium'> per {plan.name.toLowerCase().replace("ly", "")}
                                        <Tag value="Limited Time !" 
                                            className={`tag-${price.name.toLowerCase().replace(' ', '')}`}></Tag>
                                        </span>
                                        <div className="font-medium text-xl mt-3 mb-0">Plan includes:
                                            <ul className={`list-none p--0 m-0 overflow-hidden text-lg plan-inclusions 
                                                text-${price.name.toLowerCase().replace(' ', '')}`}>
                                                <li><svg className="icon icon-tick"></svg>Dashboard metrics</li>
                                                <li><svg className="icon icon-tick"></svg>Access to the best research and analysis</li>
                                                <li><svg className="icon icon-tick"></svg>Access to the Discussion forum</li>
                                                <li><svg className="icon icon-tick"></svg>Access to <i>The Enlightened Hbarbarian</i> blog</li>
                                                <li><svg className="icon icon-tick"></svg>Account monitoring</li>
                                                <li><svg className="icon icon-tick"></svg>HBAR Valuation Models</li>
                                                <li><svg className="icon icon-tick"></svg>Valuation Scenario Models</li>
                                                <li><svg className="icon icon-tick"></svg>HBAR Staking Model</li>
                                                <li><svg className="icon icon-tick"></svg>HBAR Distribution Analysis</li>
                                                <li><svg className="icon icon-tick"></svg>Staking Reward tax basis calculator (updated daily!)</li>
                                                <li><svg className="icon icon-tick"></svg>Scam and Fraud Alerts</li>
                                            </ul>
                                        </div> 
                                        <div style={{paddingTop: '0px'}}>&nbsp;</div>
                                        <SignupButton                                             
                                            price={ props.plans ? props.plans[0].prices[0] : {} }                                            
                                            label={`${ 'Subscribe ' + price.name }`}
                                            disabled={price.id !== "prc_inaugural-rate-jsee0arm"}                                            
                                        />                                        
                                    </div>                                        
                                </div>                                 
                            </div> 
                        ))
                    ))
                }
            </div>
        </div>
        
      );
    
}
  
    export default PlanBlock