import React, { useState } from 'react';
import { SelectButton } from 'primereact/selectbutton';
import { Toolbar } from 'primereact/toolbar';
import HbarPrice from './components/hbar-price';
import ConsensusService from './components/consensus-service';
import TransactionsByType from './components/trxns-by-service';
import Accounts from './components/accounts';
import NetworkFees from './components/network-fees';
import Leaderboard from './components/leaderboard'
import TPS from './components/tps';
import HBARStaked from './components/hbar-staked';
import HBARSupply from './components/hbar-supply';
import StakingRewards from './components/staking-rewards';
import RewardsAccount from './components/rewards-account';
import Treasury from './components/treasury';
import TotalTxns from './components/total-txns';
import TotalTxns24 from './components/total-txns-24';
//import * as fn from '../../shared/fn';

const Dashboard = (props) => { 
    const [timeframe, setTimeframe] = useState(`1`);
    //const [xxx, setXxx] = useState();  
    
    const timeframeOptions = [
        {label: '24 Hours', value: `1`},
        {label: '7 Days', value: `7`},
        {label: '30 Days', value: `30`},
        {label: 'YTD', value: 'YTD'},
        {label: '1 Year', value: `365`},
        {label: 'OA', value: `OA`}
    ];

    const onTimeframeChange = (e) => {
        setTimeframe(e.value);
    }

    const rightContents = (
        <React.Fragment>            
            <SelectButton
                id={`timeframeFilter`}
                value={timeframe}
                options = {timeframeOptions}
                onChange = {(e) => onTimeframeChange(e)}
                dataKey={timeframe}
                unselectable={false}
            />
        </React.Fragment>
    );

    //useEffect(() => { 
    //},[]);

    const leftContents = (
        <React.Fragment>
          <></>
        </React.Fragment>
    );

    const centerContents = (
        <React.Fragment>
        </React.Fragment>
    );

    return (    
        <div className={`dashboard`}>
            <Toolbar 
                left={leftContents} 
                center={centerContents} 
                right={rightContents} 
            />
            <section>
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-3">
                        <HbarPrice />
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <Accounts timeframe={timeframe} />
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <NetworkFees tf={timeframe} />
                    </div>
                    
                    <div className="col-12 md:col-6 lg:col-3">
                        <ConsensusService tf={timeframe} />
                    </div>
                    
                </div>
                <div className={`grid mt-1`}>
                    <div className="col-12 md:col-6 lg:col-3">
                        <TotalTxns />
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <TotalTxns24 />
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <TPS env='mainnet-public' />
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <TPS env='testnet' />
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">                 
                        <Leaderboard />  
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">                 
                        <TransactionsByType tf={timeframe} />   
                    </div>
                                        
                    
                </div>
            </section>
            <section>
                <div className={`grid mt-1`}>
                    <div className="col-12 md:col-6 lg:col-3">
                        <StakingRewards />
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <RewardsAccount title="Account 0.0.800 (staking rewards)" account="800" />
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <RewardsAccount title="Account 0.0.801 (node rewards)"  account="801"/>
                    </div>                    
                    
                    <div className="col-12 md:col-6 lg:col-3">
                        <HBARStaked />
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <Treasury />
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <HBARSupply />
                    </div>
                </div>
            </section>
            {/* <section>
                <div className={`grid  mt-1`}>                    
                    <div className="col-12 md:col-6 lg:col-3">
                        <Treasury />
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <HBARSupply />
                    </div>
                    <div className="col-12 md:col-12 lg:col-6">
                        <HbarDistribution />
                    </div>
                </div>
            </section> */}
            {/* <section>
                <div className={`grid mt-1`}>
                    <div className="col-12 md:col-6 lg:col-12">
                        <Matrix />
                    </div>
                    <div className="col-12 md:col-6 lg:col-12">
                        <WorldMap />
                    </div>
                </div>
            </section> */}
        </div>  
            
    );
};

export default Dashboard;
