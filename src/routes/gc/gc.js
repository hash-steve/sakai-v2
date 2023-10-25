import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { MemberstackProtected } from "@memberstack/react";
import Bio from './bio';
import Matrix from './matrix';
import Map from './map';
import Unauthorized from '../unauthorized';
//import * as svc from '../../api/api';
import * as fn from '../../shared/fn';

const GC = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleTabChange = (index) => {
        setActiveIndex(index);
        sessionStorage.setItem('sak-gc-sel-tab', index);
    }

    const getActiveIndex = () => {
        const index = sessionStorage.getItem("sak-gc-sel-tab") ? parseInt(sessionStorage.getItem("sak-gc-sel-tab")) : activeIndex;
        return index;
    }

    return (
            <div className={`gc`}>
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
                                <TabPanel header="Bio">
                                    <Bio />
                                </TabPanel>
                                <TabPanel header="Matrix">
                                    <Matrix />
                                </TabPanel>
                                <TabPanel header="Node Map">
                                    <Map />
                                </TabPanel>
                            </TabView>
                        </TabPanel>    
                    </TabView>
 
                </MemberstackProtected>
            </div>
        );
  }

  export default GC