import React, {useEffect, useState} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import * as fn from '../../../shared/fn';
import * as cnst from '../../../shared/constants';
import * as api from '../../../api/api';

const SnapshotTemplate = (props) => {    
    const [balance, setBalance] = useState(0);
    const [fees, setFees] = useState(0);
    
    const fetchInterval = 3600000;

    useEffect(() => {        
        const interval = setInterval(() => { 
            getNetworkRevenue();
        }, balance===0 ? 1 : fetchInterval
        );
        return () => {
            clearInterval(interval);
        };
      },[]);

    const getNetworkRevenue = async () => {
        const response = await api.getAccount('0.0.98');     
        setBalance(response.data.balance.balance);
    }
    const getNodeFees = async () => {
        const response = await api.getAccount('0.0.98');     
        setFees(response.data.balance.balance);
    }
    return (
        <div className={`card-container`}>
        <div className={`card`}>
            <div className={`sm`}>
                <div className={``}>
                    <div className={`accent network title`}>{`Network Revenue`}</div>
                    <ScrollPanel className={`sm items`}>
                        <div className="text-900 font-medium item"><label>label: <label>{`${balance}`}</label></label></div>
                        <div className="text-900 font-medium item"><label>label: <label>{`${balance}`}</label></label></div>
                        <div className="text-900 font-medium item hidden"><label>label: <label>{`${balance}`}</label></label>
                        <div className={`vert-spacer hidden`}>&nbsp;</div>
                            <ul className={`list-style-type-none`}>
                                <li><label>XXX: <label>{`${balance}`}</label></label></li>
                                <li><label>XXX: <label>{`${balance}`}</label></label></li>
                            </ul>
                        </div> 
                    </ScrollPanel>
                </div>                   
            </div>               
        </div>
    </div>               
    );
  }

  export default SnapshotTemplate