import React, { useState, useEffect } from 'react';
import { Knob } from 'primereact/knob';
import * as api from './../../../api/api';
import * as fn from './../../../shared/fn';

const TPSGauge = (props) => {
    const [tps, setTps] = React.useState(0);
    const [minRange, setMinRange] = useState(0);
    const [maxRange, setMaxRange] = useState(0);
    const [tpsArr]= useState([]);
    const [palette] = useState([]);    

    const arrItems = 12;
    const tpsInterval = 5000;

    
    useEffect(() => {
        window.onresize = resizeKnob;
        const updateArr = (val) => {
            if(tpsArr.length > arrItems) {
                tpsArr.shift()
            }
            
            tpsArr.push(val);
    
            if(props.env!=="testnet"){
                sessionStorage.setItem('sak-tps-arr', JSON.stringify(tpsArr));
            }
            
            const highest = Math.max(...tpsArr);
            const lowest = Math.min(...tpsArr);
    
            tpsArr.filter(n => n !== highest)
            tpsArr.filter(n => n !== lowest)
    
            setMinRange(Math.round(lowest*.9));
            setMaxRange(Math.round(highest*1.05));
        }

        const getTPS = async () => {
            const response = await api.getTPS(props.env);
            const tps = fn.calcTps(response);
            
            updateArr(tps);
            const avgTps = tpsArr.length===0 ? tps : Math.round(tpsArr.reduce((a, b) => a + b) / tpsArr.length);
            setTps(avgTps);
          }

        // create interval
        const interval = setInterval(() => { 
            getTPS()}, tpsInterval
        );

        // clean up interval on unmount
        return () => {
            clearInterval(interval);
        };
    },[tpsArr, props.env, tpsInterval]);

    const resizeKnob=()=> {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const size=vw/7.6;
        return size;
    }
    return (
      <div className={`tps`}>
        <div className={`card`}>
          <div className={`lg`}>
            <div>
              <div className="accent network title">{`TPS - ${props.env.split('-')[0]}`}</div>
            </div>
            <div className={`items`}>
              <Knob
                value={`${tps}`}
                className={``}
                min={minRange >= 0 ? minRange : 0}
                max={maxRange}
                size={resizeKnob()}
                step={1}
                valueColor={palette[4]}
                rangeColor={`#595b7b`}
                readOnly />
            </div>
          </div>
        </div>
      </div>    
    )
}

export default TPSGauge