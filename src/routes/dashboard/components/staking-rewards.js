import React, {useEffect, useState, useCallback} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import * as fn from '../../../shared/fn';
import * as cnst from '../../../shared/constants';
import * as api from '../../../api/api';

const StakingRewards = (props) => {    
    const [annualAlloc, setAnnualAlloc] = useState();
    const [title] = useState(props.title ?? 'Staking Rewards');
    const [stakeRewarded, setStakeRewarded] = useState(0);
    const [maxStakeMaxRewards, setMaxStakeMaxRewards] = useState(0);
    const [maxRewardRatePerHbar, setMaxRewardRatePerHbar] = useState(0);
    const [rewardRate, setRewardRate] = useState(0);
    const [maxApy, setMaxApy] = useState(0);
    const [apy, setApy] = useState(0);
    //  const [xxx, setXxx] = useState(0);

    const h = cnst.LBL_HBAR_SYMBOL;

    const handleAdminData = (data) => {
        let aa = data.find(x => x.dataname==='annual_allocation').datavalue;
        let apy = data.find(x => x.dataname==='apy_maximum').datavalue;
        let maxStakeMaxRewards = data.find(x => x.dataname==='max_stake_for_max_rewards').datavalue;

        setAnnualAlloc(aa);
        setMaxApy(apy);
        setMaxStakeMaxRewards(maxStakeMaxRewards);

        sessionStorage.setItem('sak-ad', JSON.stringify(data));
        sessionStorage.setItem('sak-ad-fetch', new Date().getTime());
    }

    const handleNodeStakeData = (data) => {       
        const stakeRewarded=data.data.json.data.node_stake.stake.stake_data.stake_rewarded;
        const rewardRate=data.data.json.data.node_stake.stake.reward_rate_data.reward_rate; 

        setStakeRewarded(stakeRewarded);
        setRewardRate(rewardRate);
        
        const actualApy = fn.calcActualApy(rewardRate, stakeRewarded);        
        setApy(actualApy);

    }

    const getNodeStake = useCallback(async() => {
        const data = await api.getNodeStake();
        handleNodeStakeData(data);
    }, []);

    const getNetworkStake = useCallback(async() => {
        const data = await api.getNetworkStake();
        sessionStorage.setItem('sak-stk-pd.from', data.data.staking_period.from);
        setMaxRewardRatePerHbar(data.data.max_staking_reward_rate_per_hbar);
    }, []);

    useEffect(() => {
        const getAdminData = async() => {
            const data = await api.getAdminData();
            handleAdminData(data);
        }

        getNodeStake();
        getAdminData();
        getNetworkStake();
        
    }, [getNodeStake, getNetworkStake]);

    const getDailyPaidOutValue = () => {
        return Math.round((rewardRate / fn.rateDivisor) * fn.toHbar(stakeRewarded));
    }
    const getAllocNotPaidOutValue = () => {
        //const dpo = fn.calcDailyPaidOut(maxRewardRatePerHbar, stakeRewarded);
        const val = (annualAlloc) / (365);
        return Math.abs(val);
    }

    const getMaxRewardPerHbarValue = () => {
        return maxRewardRatePerHbar / fn.rateDivisor;
    }

    const getStakeRewardedValue = () => {
        return fn.toHbar(stakeRewarded);
    }

    const getRewardedStakeValue = () => {
        return fn.toHbar(stakeRewarded) / maxStakeMaxRewards
    }

    const getMaxApyValue = () => {
        return maxApy * 100;
    }
    const getApyValue = () => {
        return apy * 100;
    }

    return (
        <div className={`card-container`}>
            <div className={`card`}>
                <div className={`lg`}>
                    <div className={``}>
                        <div className={`accent staking title`}>{`${title}`}</div>
                        <ScrollPanel className={`items`}>
                        <div className="text-900 font-medium item">
                                <label>Maximum APY:</label>
                                <InputNumber
                                    inputId="MaxApy"
                                    value={getMaxApyValue()}                                 
                                    showButtons={false}
                                    allowEmpty={false}
                                    suffix={`%`}
                                    minFractionDigits={0} 
                                    maxFractionDigits={2}
                                    min={0}
                                    readOnly
                                    className={`readonly`}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>Current APY:</label>
                                <InputNumber
                                    inputId="Apy"
                                    value={getApyValue()}                                 
                                    showButtons={false}
                                    allowEmpty={false}
                                    suffix={`%`}
                                    minFractionDigits={0} 
                                    maxFractionDigits={2}
                                    min={0}
                                    readOnly
                                    className={`readonly`}
                                />
                            </div>
                            <div className="text-900 font-medium item">
                                <label>Annual Allocation:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${annualAlloc}`}                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>Daily Paid Out:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getDailyPaidOutValue()}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>Allocated Not Paid Out:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getAllocNotPaidOutValue()}                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>


                            <div className={`vert-spacer`}>&nbsp;</div>
                            
                            <div className="text-900 font-medium item">
                                <label>Max per {h}:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getMaxRewardPerHbarValue()}                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={7}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>Max Stake for Max Rewards:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={maxStakeMaxRewards} 
                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={7}
                                />
                            </div>
                            
                            <div className="text-900 font-medium item">
                                <label>Current Stake (with Rewards):</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getStakeRewardedValue()} 
                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={7}
                                />
                            </div>
                            <div className="text-900 font-medium item">
                                <label>{`Rewarded Stake as Percent of Max Stake`}:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getRewardedStakeValue()}                                    
                                    minFractionDigits={2}
                                    maxFractionDigits={2}
                                    suffix={`%`}
                                />
                            </div>                            
                        </ScrollPanel>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  export default StakingRewards