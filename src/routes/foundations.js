import React, { useState, useEffect } from 'react';
import { Carousel } from 'primereact/carousel';
import { TabView, TabPanel } from 'primereact/tabview';
import { Editor } from 'primereact/editor';
import * as svc from '../api/api';
//import * as fn from './../shared/fn';

const Foundations = (props) => {
    const [content, setContent] = useState([]);

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
    
    const setSmContent = (data) => {
        setContent(data);
    }
    const fetchLocalData = async (name) => {        
        await svc.fetchLocalData(name)
            .then(response => setSmContent(response.data.data));       
    }
    
    useEffect(() => {        
        fetchLocalData('foundations');
        //fetchDocument('')
    });

    
    const scrollTemplate = (item) => {
        if(!item.text) return null;
        
        if(item.type==="object" || item.type==="embed") 
            return <div className="doc" dangerouslySetInnerHTML={{__html: item.text}}></div>;
        
        //var template = <div></div>
        return (
            <Editor 
                className={`read-only foundations-editor`} 
                readOnly={true} 
                value={item.text} />
        );
    }

    return (
        <TabView className={`carousel-view card outer`}>
            <TabPanel header={`${props.title}`}>
                <Carousel
                    className={`foundations`}
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
    );
  }

  export default Foundations