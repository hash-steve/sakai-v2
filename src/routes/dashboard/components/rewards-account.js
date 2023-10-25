import React, {useEffect, useState, useCallback} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import * as fn from '../../../shared/fn';
//import * as cnst from '../../../shared/constants';
import * as api from '../../../api/api';

const RewardsAccount = (props) => {    
    const [balance, setBalance] = useState(0);
    const [pendingReward800, setPendingReward800] = useState(0);
    const [pendingReward801, setPendingReward801] = useState(0);
    const [maxRewardRatePerHbar, setMaxRewardRatePerHbar] = useState(0);
    const [stakeRewarded, setStakeRewarded] = useState(0);
    const [rewardRate, setRewardRate] = useState(0); 
    const [stakingFees, setStakingFees] = useState(0);
    const [nodeFees, setNodeFees] = useState(0);
    //const [hederaFees, setHederaFees] = useState(0);
    //const [xxx, setXxx] = useState(0);

    const fetchInterval = 3600000;

    useEffect(() => {
        const interval = setInterval(() => { 
            getAccountBalance();        
        }, balance===0 ? 1 : fetchInterval
        );
        return () => {
          clearInterval(interval);
        };
    });

    // useEffect(() => {        
    //
    // },[]);

    const handleNodeStakeData = (data) => {       
        const stakeRewarded=data.data.json.data.node_stake.stake.stake_data.stake_rewarded;
        const rewardRate=data.data.json.data.node_stake.stake.reward_rate_data.reward_rate; 
        //console.log(data)
        setStakeRewarded(stakeRewarded);
        setRewardRate(rewardRate);
    }

    const handleStakingFeesData = (data) => {
        setStakingFees(data[0].fees);
    }

    const handleNodeFeesData = (data) => {
        //console.log(data[0].fees)
        setNodeFees(data[0].fees);
    }

    // const handleHederaFeesData = (data) => {
    //     setHederaFees(data[0].fees);
    // }

    const getNodeStake = useCallback(async() => {
        const data = await api.getNodeStake();
        handleNodeStakeData(data);
    }, [])

    const getStakingFees = useCallback(async() => {
        const data = await api.getStakingFees();
        
        handleStakingFeesData(data);
    }, [])

    const getNodeFees = useCallback(async() => {
        const data = await api.getStakingFees();
        
        handleNodeFeesData(data);
    }, [])

    // const getHederaFees = useCallback(async() => {
    //     const data = await api.getHederaFees();
        
    //     handleHederaFeesData(data);
    // }, [])

    const getEntityStake = useCallback(async() => {
        let data = await api.getEntityStake('800');
        //if(data.status===202) return;

        const pendingRewards800=data.data.json.data.stake.aggregate.sum.pending_reward;
        setPendingReward800(pendingRewards800);

        data = await api.getEntityStake('801');
        const pendingRewards801=data.data.json.data.stake.aggregate.sum.pending_reward;
        setPendingReward801(pendingRewards801);
    }, []);

    const getNetworkStake = useCallback(async() => {
        const data = await api.getNetworkStake();        
        setMaxRewardRatePerHbar(data.data.max_staking_reward_rate_per_hbar);
    }, [])

    const getAccountBalance = async () => {
        const response = await api.getAccount('0.0.'+props.account);     
        setBalance(response.data.balance.balance);
    }
    
    useEffect(() => {        
        getNodeStake();
        getNetworkStake();
        getStakingFees();
        getNodeFees();
        getEntityStake();
    }, [getNodeStake, getNetworkStake, getStakingFees, getNodeFees, getEntityStake]);


    const getBalanceValue = () => {
        return fn.toHbar(balance);
    }

    const getStakingSurplusValue = () => {
        return Math.round((stakingFees - getStakingRewardsValue()));
    }

    const getStakingSurplusAnnualizedValue = () => {
        return Math.round(getStakingSurplusValue()/365);
    }

    const getNodeSurplusValue = () => {
        return Math.round((nodeFees - getNodeRewardsValue()));
    }

    const getNodeSurplusAnnualizedValue = () => {
        return Math.round((getNodeSurplusValue()/365));
    }
    
    const getPendingRewardsValue800 = () => {
        return fn.toHbar(pendingReward800);
    } 
    const getPendingRewardsValue801 = () => {
        return fn.toHbar(pendingReward801);
    }

    const getNetBalanceValue800 = () => {
        return fn.toHbar(balance)-fn.toHbar(pendingReward800);
    }

    const getNetBalanceValue801 = () => {
        return fn.toHbar(balance)-fn.toHbar(pendingReward801);
    }

    const getStakingRewardsValue = () => {
        return Math.round((rewardRate / fn.rateDivisor) * fn.toHbar(stakeRewarded));
    }

    const getNodeRewardsValue = () => {
        return Math.round(6678);
    }

    const getDailyPaidOut = () => {
        return fn.calcDailyPaidOut(maxRewardRatePerHbar, stakeRewarded);
    }

    const getDaysRewardsRemaining = () => {
        const netBalance =  getNetBalanceValue800();
        const dpo = getDailyPaidOut();
        return Math.round((netBalance / dpo) * 100);
    }

    function getStakingDefictPrefix() {
        var prefix='';
        if(getStakingSurplusValue() < 0) {
            prefix = '(';
        }

        return prefix;
    }

    function getStakingDefictSuffix() {
        var suffix='';
        if(getStakingSurplusValue() < 0) {
            suffix = ')'
        }

        return suffix;
    }

    function getNodeDefictPrefix() {
        var prefix='';
        if(getNodeSurplusValue() < 0) {
            prefix = '(';
        }

        return prefix;
    }

    function getNodeDefictSuffix() {
        var suffix='';
        if(getNodeSurplusValue() < 0) {
            suffix = ')'
        }

        return suffix;
    }

    return (
        <div className={`card-container`}>
            <div className={`card`}>
                <div className={`lg`}>
                    <div className={``}>
                        <div className={`accent staking title`}>{`${props.title}`}</div>

                        <ScrollPanel className={`items`}>
                            <div className="text-900 font-medium item">
                                <label>Balance:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getBalanceValue()} 
                                    currency="USD"
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>                            

                            <div className="text-900 font-medium item">
                                <label>Pending Rewards:</label>
                                <InputNumber 
                                    readOnly 
                                    value={`${props.account==='800' ? getPendingRewardsValue800() : getPendingRewardsValue801()}`}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>Net Balance:</label>
                                <InputNumber 
                                    readOnly 
                                    value={`${props.account==='800' ? getNetBalanceValue800() : getNetBalanceValue801()}`}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item indent">
                                <label>Days Rewards Remaining:</label>
                                <InputText 
                                    readOnly 
                                    value={`${props.account==='800' ? getDaysRewardsRemaining() : 'n/a'}`}
                                   
                                />
                            </div>
                                                                
                            <div className={`vert-spacer`}>&nbsp;</div>

                            <div className="text-900 font-medium item">
                                <label>{`Network fees ${props.account==='800' ? '(staking):' : ' (node payments):'}`}</label>
                                <InputNumber 
                                    readOnly 
                                    value={`${props.account==='800' ? stakingFees : nodeFees}`}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>
                            <div className="text-900 font-medium item indent">
                                <label>{`${props.account==='800' ? 'Staking Rewards:' : 'Node Rewards:'}`}</label>
                                <InputNumber 
                                    readOnly 
                                    value={`${props.account==='800' ? getStakingRewardsValue() : 0}`}
                                />
                            </div>
                            <div className="text-900 font-medium item indent">
                                <label>{`Surplus (deficit):`}</label>
                                <InputNumber 
                                    readOnly 
                                    value={`${props.account==='800' ? getStakingSurplusValue() : getNodeSurplusValue()}`}
                                    suffix={`${props.account==='800' ? getStakingDefictSuffix() : getNodeDefictSuffix()}`}
                                    prefix={`${props.account==='800' ? getStakingDefictPrefix() : getNodeDefictPrefix()}`}
                                />
                            </div>
                            <div className="text-900 font-medium item indent">
                                <label>{`Surplus (deficit) annualized:`}</label>
                                <InputNumber 
                                    readOnly 
                                    value={`${props.account==='800' ? getStakingSurplusAnnualizedValue() : getNodeSurplusAnnualizedValue()}`}
                                    suffix={`${props.account==='800' ? getStakingDefictSuffix() : getNodeDefictSuffix()}`}
                                    prefix={`${props.account==='800' ? getStakingDefictPrefix() : getNodeDefictPrefix()}`}
                                />
                            </div>
                        </ScrollPanel>
                    </div>                   
                </div>               
            </div>
    </div>               
    );
  }

  export default RewardsAccount