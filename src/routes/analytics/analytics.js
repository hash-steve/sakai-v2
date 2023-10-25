import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import Model from './model';
import Unauthorized from '../unauthorized';
import { MemberstackProtected } from "@memberstack/react";
import * as fn from '../../shared/fn';

const Analytics = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleTabChange = (index) => {
        setActiveIndex(index);
        localStorage.setItem('sak-analytics-sel-tab', index);
    }

    const getActiveIndex = () => {
        const index = localStorage.getItem("sak-analytics-sel-tab") ? parseInt(localStorage.getItem("sak-analytics-sel-tab")) : activeIndex;
        return index;
    }

    return (      
        <div>
            <MemberstackProtected
                onUnauthorized={<Unauthorized mt={8}/>}
                allow={{
                    permissions: fn.getFullAccessPermissions(),
                }}>
                <div>
                    <TabView className={`card outer`}
                        activeIndex={getActiveIndex()} 
                        onTabChange={(e) => handleTabChange(e.index)}
                        >
                        <TabPanel header={props.title}>
                            <Model title="Valuation Model" />
                        </TabPanel>                           
                    </TabView>
                </div>
            </MemberstackProtected>
        </div>
        
    );
  }

  export default Analytics