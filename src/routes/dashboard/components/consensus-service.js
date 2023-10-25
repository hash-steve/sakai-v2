import React, {useEffect, useState, useCallback, useRef} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';
import * as fn from '../../../shared/fn';
// import * as cnst from '../../../shared/constants';
// import * as api from '../../../api/api';

const ConsensusService = (props) => {    
    const [createdTopics, setCreatedTopics] = useState(0);
    const [activeTopics, setActiveTopics] = useState(0);
    //const [xxx, setXxx] = useState(0);

    const timeframeRef=useRef();
    const fetchInterval = 3600000;

    const getTopics = useCallback(async() => {        
        if(!props.tf) return;
        
        const timeframe= fn.mapFilterOption(props.tf);
        let recs;        
        
        const resp=await axios(`/.netlify/functions/getTopics?tf=${timeframe}`)
            .then(function (response) {                    
                return response;
        })

        recs=resp.data.data;
        timeframeRef.current=timeframe;

        setCreatedTopics(recs[0].entities_count);
        setActiveTopics(recs[0].active_count);

    }, [props.tf]);

    useEffect(() => {
        if(timeframeRef.current !==props.tf){
            getTopics();
        }
        const interval = setInterval(() => { 
            getTopics()
        }, fetchInterval);  

        return () => { clearInterval(interval); };
    }, [getTopics, props.tf]);

    const getActiveTopicsValue = () => {
        return activeTopics;
    }
    const getCreatedTopicsValue = () => {
        return createdTopics;
    }
    // useEffect(() => {        
    // });
    
    return (
        <div className={``}>
        <div className={`card`}>
            <div className={`sm`}>
                <div className={``}>
                    <div className={`accent network title`}>{`Consensus Service`}</div>
                    <ScrollPanel className={`items`}>
                    <div className="text-900 font-medium item">
                            <label>Active Topics:</label>
                            <InputNumber 
                                readOnly                                 
                                value={getActiveTopicsValue()}                               
                                minFractionDigits={0}
                                maxFractionDigits={0}
                            />
                        </div>
                        <div className="text-900 font-medium item indent">
                            <label>Created Topics:</label>
                            <InputNumber 
                                readOnly                                 
                                value={getCreatedTopicsValue()}                               
                                minFractionDigits={0}
                                maxFractionDigits={0}
                            />
                        </div>                                    
                        <div className={`vert-filler`}>&nbsp;</div>                     
                    </ScrollPanel>
                </div>                   
            </div>               
        </div>
    </div>               
    );
  }

  export default ConsensusService