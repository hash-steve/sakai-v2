import React, {useEffect, useState, useCallback} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import * as fn from '../../../shared/fn';
// import * as cnst from '../../../shared/constants';
import * as api from './../../../api/api';

const APY = (props) => {    
    const [stakedForRewards, setStakedForRewards]= useState();
    const [stakeRewardRate, setStakeRewardRate]= useState();
    const [apy, setApy] = useState();
    const [maxApy, setMaxApy] = useState();
    //const [xxx, setXxx] = useState();

    

    const getAdminData = useCallback(async() => {
        const data = await api.getAdminData();
        setMaxApy(data.filter(f => f.dataname==='apy_maximum')[0].datavalue)
    }, [])

    const getNodeStake = useCallback(async() => {
        const data = await api.getNodeStake();  
        const stakeRewarded=data.data.json.data.node_stake.stake.stake_data.stake_rewarded;
        setStakedForRewards(stakeRewarded);
    }, []);

    const getNetworkStake = useCallback(async() => {
        const response = await api.getNetworkStake();
        setStakeRewardRate(response.data.staking_reward_rate);
    }, []);

    useEffect(() => {
        getNetworkStake();
        getAdminData();
        getNodeStake();
    },[getNodeStake, getNetworkStake, getAdminData]);

    useEffect(() => {
        const actualApy = fn.calcActualApy(stakeRewardRate, stakedForRewards);
        setApy(actualApy);
    },[stakedForRewards, stakeRewardRate]);
    
    const getMaxApyValue = () => {
        return maxApy * 100;
    }
    const getApyValue = () => {
        return apy * 100;
    }
    return (
        <div className={`card-container`}>
            <div className={`card`}>
                <div className={`sm`}>
                    <div className={``}>
                        <div className={`accent staking title`}>{`APY`}</div>
                        <ScrollPanel className={`items`}>
                            <div className="text-900 font-medium item">
                                <label>Maximum:</label>
                                <InputNumber
                                    inputId="MaxApy"
                                    value={getMaxApyValue()}                                 
                                    showButtons={false}
                                    allowEmpty={false}
                                    suffix="%"
                                    minFractionDigits={0} 
                                    maxFractionDigits={2}
                                    min={0}
                                    readOnly
                                    className={`readonly`}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>Current:</label>
                                <InputNumber
                                    inputId="Apy"
                                    value={getApyValue()}                                 
                                    showButtons={false}
                                    allowEmpty={false}
                                    suffix="%"
                                    minFractionDigits={0} 
                                    maxFractionDigits={2}
                                    min={0}
                                    readOnly
                                    className={`readonly`}
                                />
                            </div>

                        </ScrollPanel>
                    </div>                   
                </div>               
            </div>
        </div>               
    );
  }

  export default APY