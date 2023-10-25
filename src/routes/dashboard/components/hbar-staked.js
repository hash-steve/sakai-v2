import React, {useEffect, useState, useCallback} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import * as fn from '../../../shared/fn';
import * as cnst from '../../../shared/constants';
import * as api from '../../../api/api';

const h = cnst.LBL_HBAR_SYMBOL;

const HbarStaked = (props) => {    
    const [networkStake, setNetworkStake] = useState(0);
    const [networkSupply, setNetworkSupply] = useState(0);
    const [stakingPeriod, setStakingPeriod] = useState(0);
    const [stakeRewarded, setStakeRewarded] = useState(0);
    const [stakeNotRewarded, setStakeNotRewarded] = useState(0);    
    //const [xxx, SetXxx] = useState(0);

    const getStakingPeriod = useCallback(() => {
        if(stakingPeriod) return;
            
        const sp = sessionStorage.getItem('sak-stk-pd.from')
        if(sp) {
            setStakingPeriod(sp);
        }
    },[stakingPeriod])

    const handleNodeStakeData = (resp) => {       
        const stakeRewarded=resp.data.json.data.node_stake.stake.stake_data.stake_rewarded;
        const stakeNotRewarded=resp.data.json.data.node_stake.stake.stake_data.stake_not_rewarded;

        setStakeRewarded(stakeRewarded);
        setStakeNotRewarded(stakeNotRewarded);
    }

    const getNodeStake = useCallback(async() => {
        const data = await api.getNodeStake();
        handleNodeStakeData(data);
    }, []);

    useEffect(() => {
        getNetworkSupply();
        getNodeStake();        
        getStakingPeriod();               
    },[getNodeStake, getStakingPeriod]);

    // useEffect(() => {
        
    // },[])

    useEffect(() => {        
        const interval = setInterval(() => { 
            getNetworkStake();
        }, 1000
        );
        return () => {
          clearInterval(interval);
        };
      },[]);

    const getNetworkStake = async () => {
        const response = await api.getNetworkStake();     
        setNetworkStake(response.data.stake_total);
    }

    const getNetworkSupply = async () => {
        const response = await api.getNetworkSupply()
        setNetworkSupply(response.data.total_supply);         
    }

    const getStakeRewardedValue = () => {
        if(!stakeRewarded) return;
        return stakeRewarded;
    }
    
    const getStakeNotRewardedValue = () => {
        if(!stakeNotRewarded) return;        
        return stakeNotRewarded;
    }

    return (
        <div>
            <div className={`card-container`}>
                <div className={`card`}>
                    <div className={``}>
                        <div className={`md`}>
                            <div className={`accent staking title`}>{`HBAR Staked`}</div>
                            <ScrollPanel className={`items`}>
                            <div className="text-900 font-medium item">
                                    <label>Last Staking Period:</label>
                                    <InputText
                                        readOnly                                    
                                        value={`${fn.tsToDate(stakingPeriod)}`}
                                        
                                    />
                                </div>
                                <div className="text-900 font-medium item">
                                    <label>Max {h} Supply:</label>
                                    <InputNumber 
                                        readOnly                                    
                                        value={`${fn.toHbar(networkSupply)}`}
                                        minFractionDigits={0}
                                        maxFractionDigits={0}
                                    />
                                </div>

                                <div className="text-900 font-medium item">
                                    <label>{h} Staked:</label>
                                    <InputNumber 
                                        readOnly                                    
                                        value={`${fn.toHbar(networkStake)}`}
                                        minFractionDigits={0}
                                        maxFractionDigits={0}
                                    />
                                </div>

                                <div className="text-900 font-medium item">
                                    <label className={`child`}>Accepting Rewards:</label>
                                    <InputNumber 
                                        readOnly                                    
                                        value={`${fn.toHbar(getStakeRewardedValue())}`}
                                        minFractionDigits={0}
                                        maxFractionDigits={0}
                                    />
                                </div>

                                <div className="text-900 font-medium item">
                                    <label className={`child`}>Declining Rewards:</label>
                                    <InputNumber 
                                        readOnly                                    
                                        value={`${fn.toHbar(getStakeNotRewardedValue())}`}
                                        minFractionDigits={0}
                                        maxFractionDigits={0}
                                    />
                                </div>
                                <div className="text-900 font-medium item">
                                    <label className={`child`}>Percent Staked: </label>
                                    <InputNumber 
                                        readOnly                                    
                                        value={`${(networkStake / networkSupply).toFixed(6) * 100}`}
                                        minFractionDigits={0}
                                        maxFractionDigits={0}
                                        suffix={`%`}
                                    />
                                </div>
                                
                            </ScrollPanel>
                        </div>                                    
                    </div>               
                </div>
            </div>
    </div>            
    );
  }

  export default HbarStaked