import React, {useEffect, useState, useCallback} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';
import * as fn from '../../../shared/fn';
// import * as cnst from '../../../shared/constants';
import * as api from '../../../api/api';

const Treasury = (props) => {    
    //const [value] = useState(0);
    const [allocated, setAllocated] = useState(0);
    const [unAllocated, setUnAllocated] = useState(0);
    const [swirlds, setSwirlds] = useState(0);
    const [hbarf, setHbarf] = useState(0);
    const [released, setReleased] = useState(0);
    //const [xxx, setXx] = useState(0);

    const getAccountBalances = useCallback(async () => {
        let recs;
        const resp=await axios(`/.netlify/functions/getAccountGroups`);

        recs=resp.data.balances;
        
        if (recs) {
            const arr1=recs.filter(x=>x.accountgroupid===1).map(d=>({
                amount : d.balances.reduce((n, {balance}) => n + balance, 0)
            }));
            const allocAmount=Math.round(arr1.reduce((n, {amount}) => n + amount, 0)/fn.tinyBarTncr);
            setAllocated(allocAmount);

            const arr2=recs.filter(x=>x.accountgroupid===2).map(d=>({
                amount : d.balances.reduce((n, {balance}) => n + balance, 0)
            }));
            const unAllocAmount=Math.round(arr2.reduce((n, {amount}) => n + amount, 0)/fn.tinyBarTncr);
            setUnAllocated(unAllocAmount);

            const arr6=recs.filter(x=>x.accountgroupid===6).map(d=>({
                amount : d.balances.reduce((n, {balance}) => n + balance, 0)
            }));
            const swirldsAmount=Math.round(arr6.reduce((n, {amount}) => n + amount, 0)/fn.tinyBarTncr);
            setSwirlds(swirldsAmount);

            const arr7=recs.filter(x=>x.accountgroupid===7).map(d=>({
                amount : d.balances.reduce((n, {balance}) => n + balance, 0)
            }));
            const hbarfAmount=Math.round(arr7.reduce((n, {amount}) => n + amount, 0)/fn.tinyBarTncr);
            setHbarf(hbarfAmount);

        }       
    }, []);

    const setNetworkSupply = async (data) => {
        const released = fn.toHbar(parseInt(data.released_supply));
        setReleased(released);        
    }
    
    const getNetworkSupply = useCallback(async () => {
        const response = await api.getNetworkSupply()
        setNetworkSupply(response.data);    
    }, []);    

    const getCirculatingFloat = () => {
        return released-allocated-swirlds-hbarf;
    }
    useEffect(() => {
        getAccountBalances();
        getNetworkSupply(); 
    },[getAccountBalances, getNetworkSupply])

    return (
        <div className={`card-container`}>
            <div className={`card`}>
                <div className={`ml`}>
                    <div className={``}>
                        <div className={`accent distribution title`}>{`Hedera Treasury`}</div>
                        <ScrollPanel className={`xl items`}>
                            <div className="text-900 font-medium item">
                                <label>Allocated:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${allocated}`}                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>Unallocated:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${unAllocated}`}                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>
                            <div className={`vert-spacer hidden`}>&nbsp;</div>

                            <div className="text-900 font-medium item">
                                <label>Released:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${released}`}                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label className={`child`}>Treasury Allocated:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${allocated}`}                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label className={`child`}>Swirlds:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${swirlds}`}                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label className={`child`}>HBAR Foundation:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${hbarf}`}                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>
                            <div className="text-900 font-medium item">
                                <label>Circulating Float: </label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${getCirculatingFloat()}`}                                    
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>
                        </ScrollPanel>
                    </div>                   
                </div>               
            </div>
    </div>               
    );
  }

  export default Treasury