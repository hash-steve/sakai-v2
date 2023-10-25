import React, {useEffect, useState, useRef, useCallback} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import * as fn from '../../../shared/fn';
//import * as cnst from '../../../shared/constants';
//import * as api from '../../../api/api';
import axios from 'axios';

const Accounts = (props) => { 
    const [totalAccounts, setTotalAccounts] = useState(0);
    const [activeAccounts, setActiveAccounts] = useState(0);
    const [inactiveAccounts, setInAccounts] = useState(0);
    //const [timeframe, setTimeframe] = useState(props.tf);
    const [title] = useState(props.title ?? 'Accounts (non-zero balance)');
    //const [xxx, setXxx] = useState(0);

    const timeframeRef=useRef();
    let timeframe= fn.mapFilterOption(props.tf);

    const getAccountAggregates = useCallback(async () => {

        let recs;
        const resp=await axios(`/.netlify/functions/getAccountAggregates?tf=${timeframe}`)
            .then(function (response) {                    
                    return response;
        })

        recs=resp.data.data;
        timeframeRef.current=timeframe;
        
        if (recs) {
            setTotalAccounts(recs.total.aggregate.count);
            setActiveAccounts(recs.active.aggregate.count);
            setInAccounts(recs.inactive.aggregate.count);
        }       
    }, [timeframe]);


    useEffect(() => {
        const interval = setInterval(() => {
            getAccountAggregates();
        }, (totalAccounts===0 ? 1000 : 3600000));

        return () => { clearInterval(interval); };
    }, [getAccountAggregates, totalAccounts])

    return (
        <div className={`card-container`}>
        <div className={`card`}>
            <div className={`sm`}>
                <div className={``}>
                    <div className={`accent network title`}>{`${title}`}</div>
                    <ScrollPanel className={`med items`}>
                        <div className="text-900 font-medium item"><label>Total Accounts:</label><InputNumber readOnly value={`${totalAccounts}`} /></div>
                        <div className="text-900 font-medium item"><label>Active Accounts:</label><InputNumber readOnly value={`${activeAccounts}`} /></div>
                        <div className="text-900 font-medium item"><label>Inactive Accounts:</label><InputNumber readOnly value={`${inactiveAccounts}`} /></div>
                    </ScrollPanel>
                </div>                   
            </div>               
        </div>
    </div>               
    );
  }

  export default Accounts