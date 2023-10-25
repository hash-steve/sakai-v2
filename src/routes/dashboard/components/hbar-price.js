import React, {useEffect, useState} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputNumber } from 'primereact/inputnumber';
import * as fn from '../../../shared/fn';
// import * as cnst from '../../../shared/constants';
import * as api from '../../../api/api';

const HbarPrice = (props) => {
    const [price, setPrice] = useState(0);
    const [networkPrice, setNetworkPrice] = useState(0);
    const [priceChange, setPriceChange] = useState(null);
//  const [xxx, setXXX] = useState(null);

    const priceFetchInterval=12000;

    useEffect(() => {        
        getExchangeRate();
    })

    useEffect(() => {        
        const interval = setInterval(() => { 
            getHbarPrice() }, (price===0 ? 1000 : priceFetchInterval)            
        );  

        return () => { clearInterval(interval); };
    });

    const handlePriceFetch = async (resp) => {
        if(!resp) return;
        
        setPrice(resp.data[0].current_price);
        setPriceChange((parseFloat(resp.data[0].price_change_percentage_24h)));
        sessionStorage.setItem('sak-current-price', resp.data[0].current_price);
        sessionStorage.setItem('sak-current-price-fetch',new Date().getTime());
     }

    const handleExchangeRate = async (data) => {
       const np = (data.current_rate.cent_equivalent / data.current_rate.hbar_equivalent) /100
       setNetworkPrice(np)
    }
    const getHbarPrice = async() =>{
        const now = new Date().getTime();
        const lastFetch=sessionStorage.getItem('sak-current-price-fetch');

        if((now-lastFetch) > priceFetchInterval) {
            api.fetchGeckEndpoint('coins/markets?vs_currency=usd&ids=hedera-hashgraph')
            .then(response =>
                handlePriceFetch(response)
            );
        }        
    }
    const getExchangeRate = async () => {
        await api.fetchEndpoint('network/exchangerate')
            .then(response => handleExchangeRate(response.data));            
    }

    return (
        <div className={`card-container`}>
            <div className={`card`}>
                <div className={`sm`}>
                    <div className={``}>
                        <div className={`accent network title`}>HBAR</div>
                        <ScrollPanel className={`items`}>                                                        
                            <div className="text-900 font-medium item">
                                <label>Price:</label>
                                <InputNumber 
                                    readOnly 
                                    mode="currency" 
                                    value={`${fn.formatToDecimal(price, 4)}`} 
                                    currency="USD" 
                                    locale="en-US"
                                    minFractionDigits={2}
                                    maxFractionDigits={9}
                                />
                            </div>
                            <div className="text-900 font-medium item indent">
                                <label>24H change:</label>
                                <InputNumber 
                                    readOnly 
                                    value={`${priceChange}`}
                                    mode="decimal"
                                    suffix={`%`}
                                />
                            </div>                                    
                            
                            <div className="text-900 font-medium item">
                                <label>Network Price:</label>
                                <InputNumber 
                                    readOnly 
                                    value={`${fn.formatToDecimal(networkPrice, 4)}`}
                                    mode="currency"
                                    currency="USD" 
                                    locale="en-US"
                                    minFractionDigits={2}
                                    maxFractionDigits={9}
                                />
                            </div>
                        </ScrollPanel>
                    </div>                   
                </div>               
            </div>
        </div>        
    );
  }

  export default HbarPrice