import React, {useEffect, useState, useRef, useCallback} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';
import * as fn from '../../../shared/fn';
//import * as cnst from '../../../shared/constants';

const TransactionsByType = (props) => {    
    // const [xxx, setXxx] = useState();
    const [crypto, setCrypto] = useState();
    const [accounts, setAccounts] = useState();
    const [hcs, setHcs] = useState(0);
    const [hcsFungible, setHcsFungible] = useState(0);
    const [hcsNft, setNft] = useState(0);
    const [smartContract, setSmartContract] = useState(0);
    const [file, setFile] = useState(0);
    
    //const h = cnst.LBL_HBAR_SYMBOL;
    const timeframeRef=useRef();
    const fetchInterval = 3600000;    

    const getTxnsByServiceCount = useCallback(async() => {
        if(!props.tf) return;
        
        const timeframe= fn.mapFilterOption(props.tf);
        let recs;        
        
        const resp=await axios(`/.netlify/functions/getTxnsByService?tf=${timeframe}`)
            .then(function (response) {                    
                return response;
        })

        recs=resp.data.data;
        timeframeRef.current=timeframe;

        setAccounts(recs[0].accounts_count);
        setHcs(recs[0].messages_count);
        setHcsFungible(recs[0].ft_count);
        setNft(recs[0].nft_count);
        setSmartContract(recs[0].contracts_count);
        setFile(recs[0].files_count);
        const cryptoCount = recs[0].accounts_count + 
                            recs[0].messages_count + 
                            recs[0].ft_count + 
                            recs[0].nft_count + 
                            recs[0].contracts_count +
                            recs[0].files_count;
        setCrypto(cryptoCount);
        
    }, [props.tf])

    useEffect(() => {
        if(timeframeRef.current !==props.tf){
            getTxnsByServiceCount();
        }
        const interval = setInterval(() => { 
            getTxnsByServiceCount()
        }, fetchInterval);  

        return () => { clearInterval(interval); };
    }, [getTxnsByServiceCount, props.tf]);

    const getAccountsValue = () => { 
        return accounts ?? 0;
    }

    const getSmartContractValue = () => { 
        return smartContract ?? 0;
    }

    const getHcsValue = () => { 
        return hcs ?? 0;
    }

    const getHcsFungibleValue = () => { 
        return hcsFungible ?? 0;
    }

    const getHcsNftValue = () => { 
        return hcsNft ?? 0;
    }

    const getFilesValue = () => { 
        return file ?? 0;
    }

    return (
        <div>
        <div className={`card-container`}>
            <div className={`card`}>
                <div className={`ml`}>
                    <div className={``}>
                        <div className={`accent network title`}>{`${'Transactions by Service'}`}</div>
                        <ScrollPanel className={`xl items`}>                    
                            <div className="text-900 font-medium item">
                                <label>Crypto:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={`${crypto}`}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>
                            
                            <div className="text-900 font-medium item">
                                <label>Created Accounts:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getAccountsValue()}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>
                            <div className="text-900 font-medium item">
                                <label>Smart Contracts:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getSmartContractValue()}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>
                            <div className="text-900 font-medium item">
                                <label>HCS Messages:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getHcsValue()}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>HTS Fungible Tokens:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getHcsFungibleValue()}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>HTS Non-Fungible Tokens:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getHcsNftValue()}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>

                            <div className="text-900 font-medium item">
                                <label>Files:</label>
                                <InputNumber 
                                    readOnly                                    
                                    value={getFilesValue()}
                                    minFractionDigits={0}
                                    maxFractionDigits={0}
                                />
                            </div>
                        </ScrollPanel>                   
                    </div>
                </div>
            </div>
        </div>
    </div>             
    );
  }

  export default TransactionsByType