import React, { useState, useEffect } from 'react';
import { Carousel } from 'primereact/carousel';
import { TabView, TabPanel } from 'primereact/tabview';
import Unauthorized from './unauthorized';
import { MemberstackProtected } from "@memberstack/react";
import { Editor } from 'primereact/editor';
//import * as api from '../api/api';
import * as fn from './../shared/fn';

const UseCases = (props) => {
    const [content] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleTabChange = (index) => {
        setActiveIndex(index);
        sessionStorage.setItem('sak-gc-sel-tab', index);
    }

    const getActiveIndex = () => {
        const index = sessionStorage.getItem("sak-gc-sel-tab") ? parseInt(sessionStorage.getItem("sak-gc-sel-tab")) : activeIndex;
        return index;
    }

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
        
    });

    
    const scrollTemplate = (item) => {
        if(item.visible==='false') return;

        return (            
            <div className="scrollable-item">
                <div className="scrollable-item-content text-align-center">                  
                    <div className="">
                        <h4 className="mb-1">{item.title}</h4>
                        <h5 className="mt-0 mb-3">{item.summary}</h5>
                        <h6 className="mt-0 mb-3">last update {fn.dateToLocalDate(item.lastupdated)}</h6>
                        <Editor readOnly={true} value={item.text} />
                    </div>                    
                </div>                
            </div>            
        );
    }

    return (            
        <div className={`uc`}>
            <MemberstackProtected
                onUnauthorized={<Unauthorized mt={8} />}
                allow={{
                    permissions:fn.getFullAccessPermissions()
                }}>
                    <TabView className={`card outer`}>
                        <TabPanel header={props.title}>
                            <TabView className={`inner`}
                                activeIndex={getActiveIndex()} 
                                onTabChange={(e) => handleTabChange(e.index)}
                            >
                                <TabPanel>
                                    <Carousel 
                                        className={`usecases`}
                                        circular
                                        showIndicators={true}
                                        value={content} 
                                        numVisible={1} 
                                        numScroll={1} 
                                        responsiveOptions={responsiveOptions}
                                        itemTemplate={scrollTemplate} 
                                    />     
                                </TabPanel>
                            </TabView>
                        </TabPanel>
                    </TabView>
            </MemberstackProtected>
        </div>

    );
  }

  export default UseCases