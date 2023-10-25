import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
//import { InputText } from 'primereact/inputtext';
// import { Tooltip } from 'primereact/tooltip';
import * as api from './../../api/api';
import * as fn from './../../shared/fn';
import * as cnst from './../../shared/constants';

const Model = (props) => {
    const costPerTxn=0.0001;
    const [price, setPrice] = useState(parseFloat(sessionStorage.getItem('sak-current-price')));
    const [tps, setTps] = useState();
    const [txFee, setTxFee] = useState(costPerTxn);
    const [inflowsFromNetworkFeesUsd, setInflowsFromNetworkFeesUsd] = useState();
    const [inflowsFromNetworkFeesHbar, setInflowsFromNetworkFeesHbar] = useState();
    const [outflowsForRewards, setOutflowsForRewards] = useState();
    const [networkBalance, setNetworkBalance] = useState();
    const [stakedForRewards, setStakedForRewards]= useState();
    const [apy, setApy] = useState();
    const [networkStakeData, setNetworkStakeData] = useState();
    const [chartData, setChartData] = useState();
    // const [xxx, setXxx] = useState();

    const stakedForRewardsRef= useRef();
    const h = cnst.LBL_HBAR_SYMBOL;
    const secondsPerDay = fn.secondsPerDay();    
    
    const basicOptions = {
        maintainAspectRatio: false,
        aspectRatio: .7,
        plugins: {
            legend: {
                labels: {
                    color: '#fff',                    
                    font: {
                        size: '17.5vw',
                        family: 'Jost'
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: h + ' Price',
                    color: '#fff',
                    font: {
                        size: '15w',
                        family: 'Jost'
                    }
                },
                ticks: {
                    color: '#dddddd',
                    font: {
                        size: '16w',
                        family: 'Jost'
                    }
                },
                grid: {
                    color: '#9E9E9E'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'APY',
                    color: '#fff',
                    font: {
                        size: '16w',
                        family: 'Jost'
                    }
                },
                ticks: {
                    color: '#dddddd',
                    font: {
                        size: '15vw',
                        family: 'Jost'
                    }
                },
                grid: {
                    color: '#9E9E9E'
                }
            }
        }
    };
    
    const calcActualApy = useCallback(() => {
        if(!stakedForRewards || !networkStakeData) {
             return;
        };
        
        const stakingRewardRate = networkStakeData.staking_reward_rate;
        const stakeRewarded = stakedForRewards;

        const apy = fn.calcActualApy(stakingRewardRate, stakeRewarded);
        setApy(apy);
    },[stakedForRewards, networkStakeData]);

    const getNodeStake = useCallback(async() => {
        const data = await api.getNodeStake();
        handleNodeStakeData(data);
    },[])

    // function chartXCalcPoints(inflowsFromNetworkFeesHbar, networkBalance, contribution) {
    //     console.log('');
    //     console.log('---xplot--- ');
    //     console.log('price: ' + price);
    //     console.log('tps: ' + tps);
    //     console.log('Txn Fee: ' + txFee);
    //     console.log('numerator: ' + tps*txFee*86400*365);
    //     console.log('inflowsFromNetworkFees: '+inflowsFromNetworkFeesHbar);
    //     console.log('networkBalance: '+networkBalance);
    //     console.log('contribution: '+ parseFloat(contribution.toFixed(2)));
    //     console.log('denominator: '+ (inflowsFromNetworkFeesHbar - (networkBalance * parseFloat(contribution.toFixed(2)))));
    //     console.log('xTick: '+ (tps*txFee*86400*365)/(inflowsFromNetworkFeesHbar - (networkBalance * parseFloat(contribution.toFixed(2)))))
        
    // }

    
    const plotAxisPoints = useCallback(() => {
        if(!inflowsFromNetworkFeesHbar || !networkBalance || !outflowsForRewards || !stakedForRewards) return;

        let pricePoints;
        let apyPoints;

        const plotPricePoints =()=> {            
            const xTicks = [];
            const num = tps*txFee*86400*365;        
            let contribution = 0;
            for(var x = 0; x <21; x++) {            
                let denom = (inflowsFromNetworkFeesHbar - (networkBalance * parseFloat(contribution.toFixed(2))));
                const xTick = parseFloat((num/denom).toFixed(4));
                //if(x<=1) {
                    //chartXCalcPoints(inflowsFromNetworkFeesHbar, networkBalance, contribution);
                //}
                xTicks.push(xTick);
                contribution+=.05;
            }
    
            pricePoints = xTicks.sort();
        }        

        // function chartYCalcPoints(outflowsForRewards, networkBalance, contribution, stakedForRewardsHbar) {
        //     contribution=parseFloat(contribution.toFixed(2));
        //     console.log('');
        //     console.log('---yplot---');
        //     console.log('price: ' + price);
        //     console.log('tps: ' + tps);
        //     console.log('Txn Fee: ' + txFee);
        //     //console.log('numerator: ' + tps*txFee*86400*365);
        //     console.log('outflowsForRewards: '+outflowsForRewards);
        //     console.log('networkBalance: '+networkBalance);
        //     console.log('contribution: '+ contribution);
        //     console.log('stakedForRewards: '+stakedForRewardsHbar);
        //     console.log('calc: ('+ outflowsForRewards + ' + ('+ networkBalance + '*' + contribution +') / ' + stakedForRewardsHbar+')*100');
        //     console.log('yTick: '+ ((outflowsForRewards + (networkBalance * contribution)) / stakedForRewardsHbar)*100);
        //     //console.log('');
            
        // }
    

        const plotApyPoints = ()=> {
            const yTicks = [];
            let contribution = 1;
            let stakedForRewardsHbar = fn.toHbar(stakedForRewards);

            for(var x=21; x>0; x--) {
                const val=(outflowsForRewards + (networkBalance * parseFloat(contribution.toFixed(2)))) / stakedForRewardsHbar;
                const yTick=parseFloat((val*100).toFixed(4));
                // if(x >=20) {
                //     chartYCalcPoints(outflowsForRewards, networkBalance, contribution, stakedForRewardsHbar);
                // }

                yTicks.push(yTick);
                  contribution-=.05;
            }
            apyPoints = yTicks.sort(function(a, b){return b-a});
        }

        plotApyPoints();        
        plotPricePoints();

        const data = {
            labels: pricePoints,
            datasets: [
                {
                    label: 'Equillibrium',
                    data: apyPoints,
                    fill: false,
                    borderColor: '#42A5F5',
                    borderWidth: 2,
                    tension: .3,
                    backgroundColor: '#42A5F5'
                }
            ]
        };

        setChartData(data);
    }, [
        inflowsFromNetworkFeesHbar
        , networkBalance
        , txFee
        , tps
        , stakedForRewards
        , outflowsForRewards
    ]);

    useEffect(() => {
        getNodeStake();

        const getNetworkStake = async() => {
            const response = await api.getNetworkStake();
            setNetworkStakeData(response.data);
        }

        getNetworkStake();        
    },[getNodeStake]);

    useEffect(() => {
        if(apy) return;
        calcActualApy();
    });

    useEffect(() => {
        if(tps) return;
        getTps();
    });  

    useEffect(() => {
        getHbarPrice();
        plotAxisPoints();
    },[plotAxisPoints]);

    useEffect(() => {
        const calcOutflowsForRewards = () => {
            const rewardsHbar = fn.toHbar(stakedForRewards) * apy;
            setOutflowsForRewards(rewardsHbar);
        }  

        const calcInflowsFromNetworkFeesUsd = () => {
            const feesUsd = parseInt(tps) * txFee * secondsPerDay * 365;
            setInflowsFromNetworkFeesUsd(feesUsd);
        }
    
        const calcInflowsFromNetworkFeesHbar = () => {
            var feesHbar = inflowsFromNetworkFeesUsd / parseFloat(price);
            setInflowsFromNetworkFeesHbar(feesHbar);
        }
        const calcNetworkBalance = () => {
            const balance = inflowsFromNetworkFeesHbar - outflowsForRewards;
            setNetworkBalance(balance);
        }

        calcOutflowsForRewards();
        calcInflowsFromNetworkFeesHbar()
        calcInflowsFromNetworkFeesUsd();
        calcNetworkBalance();
        calcInflowsFromNetworkFeesHbar();
    }, [
        inflowsFromNetworkFeesHbar
        , outflowsForRewards
        , txFee
        , price
        , tps
        , inflowsFromNetworkFeesUsd
        , secondsPerDay
        , stakedForRewards
        , apy
    ]);

    const getHbarPrice = async() =>{
        const now = new Date().getTime();
        const item='sak-slide-price'
        const itemFetch = item+'-fetch'
        const lastFetch = sessionStorage.getItem(itemFetch) ? sessionStorage.getItem(itemFetch) : 0;

        if((now - parseInt(lastFetch)) > 12000) {
            api.fetchGeckEndpoint('coins/markets?vs_currency=usd&ids=hedera-hashgraph')
                .then(response => {
                    const currentPrice = response.data[0].current_price;
                    setPrice(currentPrice);
            });

            sessionStorage.setItem(itemFetch, new Date().getTime());
        }
    }
    
    const handleNodeStakeData = (data) => {      
        const stakeRewarded=data.data.json.data.node_stake.stake.stake_data.stake_rewarded;
        setStakedForRewards(stakeRewarded);
        stakedForRewardsRef.current=stakeRewarded;
    }
    
    const getTps = async () => {
        const response = await api.getTPS('mainnet-public');
        const blocks = response.data.blocks[0].count ?? .1;
        const tsTo = response.data.blocks[0].timestamp.to;
        const tsFrom = response.data.blocks[0].timestamp.from
        var tps = Math.round(1 / (tsTo - tsFrom) * blocks) !== undefined ? Math.round(1 / (tsTo - tsFrom) * blocks) : 0;
        
        if(tps===Infinity || !tps) tps = 0;
        
        setTps(tps);
    }

    function _handleTpsChange(e){
        setNetworkBalance(null);
        var tps = e.value.name ?? e.value;
        tps = parseInt(tps);
        setTps(tps);
    }

    const handleTpsChange = fn.debounce(_handleTpsChange);

    function _handleTxFeeChange(e){
        //setNetworkBalance(null);
        var fee = e.value.name ?? e.value;
        fee = parseFloat(fee);
        setTxFee(fee);
    }
    const handleTxFeeChange = fn.debounce(_handleTxFeeChange);

    function _handlestakedForRewardsChange (e){
        //setNetworkBalance(null);
        var val = e.value.name ?? e.value;
        val = parseInt(val*100000000);
        setStakedForRewards(val);
    }  
    const handlestakedForRewardsChange = fn.debounce(_handlestakedForRewardsChange);

    const getPriceValue = () => {
        return fn.formatToDecimal(price, 4);
    }

    const getTpsValue = () => {
        return tps;
    }

    const getTxFeeValue = () => {
        return txFee;
    }

    const getInflowsFromNetworkFeesUsdValue = () => {
        return inflowsFromNetworkFeesUsd;
    }

    const getInflowsFromNetworkFeesHbarValue = () => {
        return inflowsFromNetworkFeesHbar;
    }

    const getStakedForRewardsValue = () => {
        if(!stakedForRewards) return;        
        return fn.toHbar(stakedForRewards);
    }

    const getApyValue = () => {
        return apy * 100;
    }

    const getNetworkBalanceValue = () => {
        return networkBalance;
    } 

    const getOutflowsForRewardsValue = () => {
        return outflowsForRewards;
    }
  
    const onTpsResetClick = () => {
        getTps();        
    }

    const onCostPerTxnResetClick = () => {
        setTxFee(costPerTxn);
    }

    const onStakedForRewardsResetClick = () => {
        setStakedForRewards(stakedForRewardsRef.current);
    }

    function getDefictPrefix() {
        var prefix='';
        if(networkBalance < 0) {
            prefix = '(';
        }

        return prefix;
    }

    function getDefictSuffix() {
        var suffix='';
        if(networkBalance < 0) {
            suffix = ')'
        }

        return suffix;
    }

    function getTpsStep(pTps) {
        return 100;
    }
   
    return ( 
        <div className="card">
            <div className="title">{``}</div>

            <div className={`wrapper model`}>            
                <div>
                    <div className="grid">
                        <div className="col-4">&nbsp;</div>
                        <div className="col-2">Current {h} Price:</div>
                        <div className="col-2">
                            <InputNumber
                                inputId="HbarPrice"
                                value={getPriceValue()} 
                                allowEmpty={false}
                                minFractionDigits={0} 
                                maxFractionDigits={4}
                                min={0}
                                readOnly
                                className={`readonly`}
                            />
                        </div>
                    </div>

                    <div className={`grid`}>
                        <div className="col-4">&nbsp;</div>
                        <div className="col-2">Current TPS:</div>
                        <div className="col-2">
                            <InputNumber
                                inputId="Tps"
                                value={getTpsValue()}                                 
                                showButtons
                                allowEmpty={false}
                                buttonLayout="horizontal" 
                                step={getTpsStep(tps)}                                        
                                incrementButtonIcon="pi pi-plus" 
                                decrementButtonIcon="pi pi-minus"
                                minFractionDigits={0} 
                                maxFractionDigits={0}
                                min={0}
                                onChange={handleTpsChange}
                                className={`tps`}
                            />
                        </div>
                        <div className="col-1">
                            <Button className={`refresh`} onClick={onTpsResetClick} icon="pi pi-refresh" />
                        </div>
                    </div>
                </div>
                
                <div className={`grid-split-row`}></div>

                <div className={`grid`}>
                    <div className="col-1">&nbsp;</div>
                    <div className="col-2">
                        Cost per Transaction:
                    </div>
                    <div className="col-2">
                        <InputNumber 
                            inputId='CostPerTxn'
                            value={getTxFeeValue()}
                            showButtons
                            allowEmpty={false}
                            buttonLayout="horizontal" 
                            step={0.00001}                                        
                            incrementButtonIcon="pi pi-plus" 
                            decrementButtonIcon="pi pi-minus"
                            minFractionDigits={2} 
                            maxFractionDigits={9}
                            mode="currency" 
                            currency="USD"
                            locale="en-US"
                            min={0}
                            onChange={handleTxFeeChange}
                            className={``}                        
                        />
                    </div>
                    <div className="col-1">
                        <Button className={`refresh`} onClick={onCostPerTxnResetClick} icon="pi pi-refresh" />
                    </div>
                    <div className="col-3 tbl-2">
                        {h} Staked for Rewards:
                    </div>
                    <div className="col-2">
                        <InputNumber
                            inputId="StakedForRewards"
                            value={getStakedForRewardsValue()}                                 
                            showButtons
                            allowEmpty={false}
                            buttonLayout="horizontal" 
                            step={10000}                                        
                            incrementButtonIcon="pi pi-plus" 
                            decrementButtonIcon="pi pi-minus"
                            minFractionDigits={0} 
                            maxFractionDigits={0}
                            min={0}
                            onChange={handlestakedForRewardsChange}
                            className={``}
                        />
                    </div>
                    <div className="col-1">
                        <Button className={`refresh`} onClick={onStakedForRewardsResetClick} icon="pi pi-refresh" />
                    </div>
                </div>

                <div className={`grid`}>
                    <div className="col-1">&nbsp;</div>
                    <div className="col-2">
                        Network Fees:
                    </div>
                    <div className="col-3">
                        <InputNumber 
                            inputId='InflowsFromNetworkFees'
                            value={getInflowsFromNetworkFeesUsdValue()} 
                            allowEmpty={false}
                            minFractionDigits={0} 
                            maxFractionDigits={0}
                            min={0}
                            mode="currency" 
                            currency="USD"
                            locale="en-US"
                            readOnly
                            className={`readonly`}
                        />
                    </div>
                    <div className="col-3 tbl-2">
                        APY:
                    </div>
                    <div className="col-2">                
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
                </div>
            
                <div className={`grid`}>
                    <div className="col-1">&nbsp;</div>
                    <div className="col-2">
                        {h} Inflows from Network Fees:
                    </div>
                    <div className="col-3">
                        <InputNumber 
                            inputId='InflowsFromNetworkFees'
                            value={getInflowsFromNetworkFeesHbarValue()} 
                            allowEmpty={false}
                            minFractionDigits={0} 
                            maxFractionDigits={0}
                            readOnly
                            className={`readonly`}                        
                        />
                    </div>

                    <div className="col-3 tbl-2">
                        {h} Outflows for Staking Rewards:
                    </div>
                    <div className="col-1">
                        <InputNumber 
                            inputId='OutlowsForRewards'
                            value={getOutflowsForRewardsValue()} 
                            allowEmpty={false}
                            minFractionDigits={0} 
                            maxFractionDigits={0}
                            readOnly
                            min={0}
                            className={`readonly`}
                        />
                    </div>
                </div>
                
                <div className={`grid-split-row`}></div>

                <div className={`grid`}>
                    <div className="col-4">&nbsp;</div>
                    <div className="col-2">Network {h} (deficit) surplus:</div>
                    <div className="col-2">
                        <InputNumber 
                            inputId='NetworkBalance'
                            value={Math.abs(getNetworkBalanceValue())} 
                            allowEmpty={false}
                            minFractionDigits={0} 
                            maxFractionDigits={0}
                            prefix={getDefictPrefix()}
                            suffix={getDefictSuffix()}
                            readOnly
                            min={0}
                            className={`readonly`}
                        />
                    </div>
                </div>
                
                <div className={`chart`}>
                    <div className={`chart`}>
                        <label className={`${isNaN(networkBalance) ? '' : 'hidden'}`}>Loading...</label>
                    </div>
                    
                    <Chart type="line" data={chartData} options={basicOptions} className={`${isNaN(networkBalance) ? 'hidden' : ''}`}/>
                </div>
            
            </div>


                

        </div>      
    );
  }

  export default React.memo(Model);