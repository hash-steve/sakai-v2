import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import Monitor from './services/monitor';
import Domains from './services/domains';
import Alerts from './services/alerts';
import Unauthorized from './../routes/unauthorized';
import { MemberstackProtected } from "@memberstack/react";
import * as fn from './../shared/fn';

const SubscriberServices = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (      
        
        <div className="p-3 flex flex-column flex-auto">
            <div className="border-0 surface-border border-round surface-section flex-auto content">
                <div className="title">{props.title}</div>
            </div>
            <MemberstackProtected onUnauthorized={<Unauthorized />}
                allow={{
                    permissions: fn.getFullAccessPermissions()
                }}>
                <Card>
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel header="Account Monitor">
                            <Monitor title="Account Monitor" />
                        </TabPanel>
                        <TabPanel header="Hedera Domains">
                            <Domains title="Hedera Domains"/>
                        </TabPanel>
                        <TabPanel header="Monitoring & Alerts">
                            <Alerts title="Monitoring & Alerts"/>
                        </TabPanel>
                    </TabView>
                </Card>
            </MemberstackProtected>
        </div>
       
    );
  }

  export default SubscriberServices