import React, { useState, useEffect, useRef, useCallback } from 'react'
import { InputNumber } from 'primereact/inputnumber';
import * as fn from '../../../shared/fn';
import * as api from '../../../api/api';
import axios from 'axios';

const Counter = () => {
    //const [xxx, setXxx] = useState(0);
    const [txns, setTxns] = useState(localStorage.getItem('__sak-txns'));  
    const [tps, setTps] = useState(0);
    const tpsInterval = 10000;
    const oldCountRef = useRef(0);
    const totalCountRef = useRef(0);
    const oldTpsRef = useRef(0);
    const tpsLastRef = useRef(new Date().getTime());

    const getTps = async() => {      
        const response = await api.getTPS('mainnet-public');
        const tps = fn.calcTps(response);
        tpsLastRef.current=new Date().getTime();
        return tps;
    }    

    const _counter = useCallback(async() => {
        fn.delay(1500);
        let frame=0;
        const animationDuration = 1000;
        const frameDuration = 1000/(25);

        const resetInterval = (intvl) => {
            clearInterval(intvl);
            _counter();
        }

        const interval = setInterval(async() => {
            //if the tps changes, clear the interval
            
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

	useEffect(() => {
        const getTxnCount = async() => {
            const resp=await axios(`/.netlify/functions/getTxns`)
                .then(function (response) {                    
                    return response;
            })
            
            totalCountRef.current=parseInt(resp.data.data[0].txns);
            setTxns(totalCountRef.current);
            localStorage.setItem('__sak-txns', JSON.stringify(totalCountRef.current));
        }

        getTxnCount();
        _counter();
    }, []);

    return (
        <div className={``}>
            <div className={`card-container`}>
                <div className={`card`}>
                    <div className={`lg`}>
                        <div className={``}>
                            <div className={`accent network title`}>{`Total Transactions`}</div>
                            <div className={`text-align--center`}>
                                <div className={`txns-wrapper`}>
                                    <InputNumber value={txns} readOnly />
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