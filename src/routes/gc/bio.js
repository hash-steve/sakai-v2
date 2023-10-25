import React, { useState, useEffect } from 'react';
import { Carousel } from 'primereact/carousel';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Editor } from 'primereact/editor';
//import * as api from '../../api/api';
import * as fn from '../../shared/fn';
import axios from 'axios';

const Bio = (props) => {
    const [records, setRecords] = useState([]);

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '600px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '480px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {  
        const getRecords = async() => {
            const fetchInterval=43200000;
            const now = new Date().getTime();
            const item='sak-nodes'
            const itemFetch = item+'-fetch'
            const store = JSON.parse(sessionStorage.getItem(item));
            const lastFetch = sessionStorage.getItem(itemFetch) ? sessionStorage.getItem(itemFetch) : 0;
            let data;

            if((now - parseInt(lastFetch)) > fetchInterval || !store) {
                const resp=await axios(`/.netlify/functions/getNodes`)
                        .then(function (response) {                    
                            return response;
                })

                data = resp.data.data;
                sessionStorage.setItem(item, JSON.stringify(data));
                sessionStorage.setItem(itemFetch, new Date().getTime());
            }
            else {
                data=store;
            }
    
            setRecords(data);
        }
        getRecords();
    }, []);
    
    const scrollTemplate = (item) => {
        if(item.visible==='false') return;

        return (  
            <Splitter className={`bio`}>
                <SplitterPanel size={33} minSize={33}>
                    <ul className={`gc-profile text-align-center`}>
                        <li><div className={`gc-logo ${item.logo}`}>&nbsp;</div></li>
                        <li><div className={`gc-text`}>{item.hq}</div></li>
                        <li><div className={`gc-text`}>Sector: {item.sector}</div></li>
                        <li><div className={`gc-text`}>Joined: {fn.dateToLocalDate(item.joined)}</div></li>
                    </ul>                
                </SplitterPanel>
                <SplitterPanel size={67}  minSize={67}>
                    <Editor readOnly={true} value={item.bio}/>
                </SplitterPanel>
            </Splitter>        
        );
    }

    return ( 
            <div>               
                <Carousel
                    circular
                    showIndicators={true}
                    value={records} 
                    numVisible={1} 
                    numScroll={1} 
                    responsiveOptions={responsiveOptions}
                    itemTemplate={scrollTemplate} 
                />
            </div>  
    );
  }

  export default Bio