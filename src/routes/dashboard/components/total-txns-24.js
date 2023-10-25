import React, { useState, useEffect, useRef, useCallback } from 'react'
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import * as fn from '../../../shared/fn';
import * as api from '../../../api/api';
import axios from 'axios';

const Counter = () => {
    //const [xxx, setXxx] = useState(0);
    const [txns, setTxns] = useState(0);   
    const [tps, setTps] = useState(0);
    const tpsInterval = 10000;
    const fetchInterval = 900000;
    const oldCountRef = useRef(0);
    const totalCountRef = useRef(0);
    const oldTpsRef = useRef(0);
    const tpsLastRef = useRef(new Date().getTime());

    useEffect(() => {
        totalCountRef.current=sessionStorage.getItem('sak-txns24') ?? 0;
        _counter();
    }, []);

    useEffect(() => {        
        const interval = setInterval(() => { 
            getTxns24()}, txns===0 ? 1000 : fetchInterval
        );
  
        return () => { clearInterval(interval); };
      }, [txns]);

    const getTps = async() => {      
        const response = await api.getTPS('mainnet-public');
        const tps = fn.calcTps(response);
        tpsLastRef.current=new Date().getTime();
        return tps;
    }

    const getTxns24 = async () => {        
        const startDt = fn.daysAgoToUtcDate(1);
        axios(`/.netlify/functions/getTxns24?tf=${startDt}`)
            .then(function (response) {                    
                const data=response.data ?? 0;
                totalCountRef.current=data.data;
                console.log(data.data);
                setTxns(data.data);
            })
            .catch(function (error) {
                return {
                    statusCode: 422,
                    body: `Error: ${error}`
                }
            });
    }

    const _counter = useCallback(async() => {
        let frame=0;
        const animationDuration = 1000;
        const frameDuration = 1000/(25);

        const resetInterval = (intvl) => {
            clearInterval(intvl);
            _counter();
        }

        const interval = setInterval(async() => {
            if(parseInt(totalCountRef.current)===0) return;

            const now = new Date().getTime();            
            const arr = [];
            if((now - tpsLastRef.current) > tpsInterval || (arr.length===0)) {
                const storeTps=JSON.parse(sessionStorage.getItem('sak-tps-arr'));
                if(storeTps) {
                    arr.push(storeTps);
                }                    
                else {
                    const tps=await getTps();
                    arr.push([tps]);
                }
            }
            
            const avgTps = Math.round(arr[0].reduce((a, b) => a + b) / arr[0].length);
            setTps(avgTps);
            let countTo = parseInt(avgTps);
            
            let oldTps = oldTpsRef.current;
            if(oldTps !== tps) {
                countTo = tps;
                oldTpsRef.current = tps;
                resetInterval(interval);
            }
            
            const totalFrames = Math.round(animationDuration/frameDuration) < 1 
            ? 1 
            : Math.round(animationDuration/frameDuration);

            frame++;
            const progress = (frame / totalFrames);
            let currentCount = Math.round(countTo * progress);
            const oldTotal = oldCountRef.current;
            const newTotal = currentCount - oldTotal;
            oldCountRef.current = currentCount;
            totalCountRef.current = parseInt(totalCountRef.current) + parseInt(newTotal);
            setTxns(totalCountRef.current);
            
            if(frame === totalFrames) {
                oldCountRef.current = 0;
                resetInterval(interval);
            }
        }, frameDuration );
    },[tps]);
	
    return (
    <div className={``}>
        <div className={`card-container`}>
            <div className={`card`}>
                <div className={`lg`}>
                    <div className={``}>
                        <div className={`accent network title`}>{`Total Transactions Last 24 Hours`}</div>
                        <div className={``}>
                            <div className={`txns-wrapper`}>
                                <InputText className={`loading ${txns==='NaN' || txns===0 ? 'hidden' : 'hidden'}`} value="Loading... We ask that you please bear with us."/>
                                <InputNumber  value={txns} readOnly />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Counter;