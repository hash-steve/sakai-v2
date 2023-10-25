import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataView } from 'primereact/dataview';
import { TabView, TabPanel } from 'primereact/tabview';
import ArticleReader from './reader';
import ArticleSummary from './preview';
import Unauthorized from '../unauthorized';
import { MemberstackProtected } from "@memberstack/react";
//import * as api from '../../api/api';
import * as fn from '../../shared/fn';

const Blog = (props) => {
    const [content] = useState([]);
    const [layout] = useState('grid');
    const [showReader, setShowReader] = useState(false);
    const [article, setArticle] = useState([]);
    const obj = {};
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
    const onReaderHide = () => {
        setShowReader(false)
    }
    
    const itemTemplate = (data) => {    
        if (layout==='grid') {
            return renderGridItem(data);        
        }
    
        if (layout==='list') {
            return (
                'list Content'
            );
        }
    }
    const renderGridItem = (data) => {
        if(!data.text) return;
        
        var summaryColor = localStorage.getItem('sak-article-summ-highlight-'+data.id);
        
        if(!summaryColor) {
            summaryColor = fn.randomHslColor();
            localStorage.setItem('sak-article-summ-highlight-'+data.id, summaryColor);
        }

        obj[data.id] = [data.text]

        return (       
            <ArticleSummary 
                data = {data} 
                handleOpenReaderClick = {handleOpenReaderClick}
                summaryColor = {summaryColor}
            />     
         );
    }
    const handleOpenReaderClick = (e) => {
        const id = parseInt(e.currentTarget.id);
        const selected = obj[id];

        setArticle(selected)
        setShowReader(true);

        // function selectedArticle(article) {
        //     return article===articleId;
        // }
    }

    return (
        
        <div className={``}>
            <MemberstackProtected
                onUnauthorized={<Unauthorized  mt={8}/>}
                allow={{
                    permissions: fn.getFullAccessPermissions(),
                }}>
                <div>
                    <TabView className={`data-view card outer`}>
                        <TabPanel header={`${props.title}`}>
                            <DataView 
                                value={content} 
                                layout={layout} 
                                header={""}
                                itemTemplate={itemTemplate} 
                                paginator 
                                rows={8}
                                sortField={'date'}
                                responsiveOptions={responsiveOptions}
                            />
                        </TabPanel>
                    </TabView>
                </div>
                <Dialog 
                    visible={showReader}
                    onHide={onReaderHide}
                    style={{width: '75%'}}
                >
                    <ArticleReader text={article[0]} />
                </Dialog>
            </MemberstackProtected>
        </div>


);
  }

  export default Blog