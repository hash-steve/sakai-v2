import React, {useEffect, useState, useCallback, useRef} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import * as fn from '../../../shared/fn';
import * as cnst from '../../../shared/constants';
//import * as api from '../../../api/api';
import axios from 'axios';

const NetworkFees = (props) => {    
    //const [xxx, setXxx] = useState(0);
    const [nodeFees, setNodeFees] = useState(0);
    const [treasuryFees, setTreasuryFees] = useState(0);
    const [stakingRewards, setStakingRewards] = useState(0);
    
    const h = cnst.LBL_HBAR_SYMBOL;
    const timeframeRef=useRef();
    const fetchInterval = 3600000;    

    const getNetworkFees = useCallback(async() => {        
        if(!props.tf) return;
        
        const timeframe= fn.mapFilterOption(props.tf);
        let recs;
        
        const resp=await axios(`/.netlify/functions/getNetworkFees?tf=${timeframe}`)
            .then(function (response) {                    
                return response;
        });

        recs=resp.data.data;            
        timeframeRef.current=timeframe;

        setNodeFees(recs[0].nodefees);
        setTreasuryFees(recs[0].treasury);
        setStakingRewards(recs[0].stakingrewards);

    }, [props.tf]);

    useEffect(() => {
        if(timeframeRef.current !==props.tf){
            getNetworkFees();
        }
        const interval = setInterval(() => { 
            getNetworkFees();
        }, fetchInterval);  

        return () => { clearInterval(interval); };        
    }, [getNetworkFees, props.tf]);
    
    return (
        <div className={`card-container`}>
        <div className={`card`}>
            <div className={`sm`}>                
                <div className={``}>
                    <div className={`accent network title`}>{`Network Fees`}</div>
                    <ScrollPanel className={`items`}>
                        <div className="text-900 font-medium item">
                            <label>Node Fees {h}:</label>
                            <InputNumber 
                                readOnly                                
                                value={`${nodeFees}`}
                                minFractionDigits={0}
                                maxFractionDigits={0}
                            />
                        </div>
                        <div className="text-900 font-medium item indent">
                            <label>Hedera Fees {h}:</label>
                            <InputNumber 
                                readOnly 
                                value={`${treasuryFees}`}
                                minFractionDigits={0}
                                maxFractionDigits={0}
                            />
                        </div>                                    
                            
                        <div className="text-900 font-medium item">
                            <label>Staking Fees {h}:</label>
                            <InputNumber 
                                readOnly 
                                value={`${stakingRewards}`}
                                minFractionDigits={0}
                                maxFractionDigits={0}
                            />
                        </div>
                        {/* <div className="text-900 font-medium item">
                            <label>Staking Reward Fee Fraction:</label>
                            <InputNumber 
                                readOnly 
                                value={`${stakingRewardsFeeFraction}`}
                                mode="currency"
                                currency="USD" 
                                locale="en-US"
                                minFractionDigits={0}
                                maxFractionDigits={0}
                            />
                        </div> 
                        <div className="text-900 font-medium item">
                            <label>Node Reward Fee Fraction:</label>
                            <InputNumber 
                                readOnly 
                                value={`${stakingRewards}`}
                                mode="currency"
                                currency="USD" 
                                locale="en-US"
                                minFractionDigits={0}
                                maxFractionDigits={0}
                            />
                        </div>                          */}
                    </ScrollPanel>
                </div>                   
            </div>               
        </div>
    </div>               
    );
  }

  export default NetworkFees