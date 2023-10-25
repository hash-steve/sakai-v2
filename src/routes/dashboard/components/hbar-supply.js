import React, {useEffect, useState} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import * as fn from '../../../shared/fn';
//import * as cnst from '../../../shared/constants';
import * as api from '../../../api/api';

const HbarSupply = (props) => {    
    //const [value, setValue] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [releasedSupply, setReleasedSupply] = useState(0);
    const [unreleasedSupply, setUnreleasedSupply] = useState(0);
    const [pctReleased, setPctReleased] = useState(0);
    
    useEffect(() => {
        const getNetworkSupply = async () => {
            const response = await api.getNetworkSupply()
            setNetworkSupply(response.data);    
        }

        getNetworkSupply();        
    },[])
    const setNetworkSupply = async (data) => {
        const ttlSupply = fn.toHbar(parseInt(data.total_supply));
        const rlsdSupply = fn.toHbar(parseInt(data.released_supply));
        setTotalSupply(ttlSupply);
        setReleasedSupply(rlsdSupply);
        const unreleased = ttlSupply - rlsdSupply;
        const pctReleased = (rlsdSupply / ttlSupply)*100;
        setUnreleasedSupply(unreleased);
        setPctReleased(pctReleased)
    }
    
    return (
        <div className={`card-container`}>
            <div className={`card`}>
                <div className={`md`}>
                    <div className={``}>
                        <div className={`accent distribution title`}>{`HBAR Supply`}</div>
                        <ScrollPanel className={`items`}>

                            <div className="text-900 font-medium item">
                                <label>Maximum:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${totalSupply}`}
                                    useGrouping={true}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>Released:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${releasedSupply}`}
                                    useGrouping
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>Unreleased:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${unreleasedSupply}`}
                                    useGrouping
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>Percent Released:</label>
                                <InputNumber 
                                    readOnly
                                    mode="decimal"                             
                                    value={`${pctReleased}`}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                    suffix={`%`}
                                />
                            </div>

                        </ScrollPanel>
                    </div>                   
                </div>               
            </div>
        </div>
    );
  }

  export default HbarSupply