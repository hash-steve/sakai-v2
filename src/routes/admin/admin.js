import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import AdminUseCases from './usecases'
import Foundations from './foundations'
import AdminData from './admindata';
import Nodes from './nodes';
import Blog from './blog';
import EntityAlias from './entityalias'
import AccountGroups from './account-groups'
import Unauthorized from '../unauthorized';
import { MemberstackProtected } from "@memberstack/react";
import * as fn from '../../shared/fn';

const Admin = (props) => {
    const [activeIndex, setActiveIndex] = useState();

    const handleTabChange = (index) => {
        setActiveIndex(index);
        sessionStorage.setItem('sak-admin-sel-tab', index);
    }

    const getActiveIndex = () => {
        const index = sessionStorage.getItem("sak-admin-sel-tab") ? parseInt(sessionStorage.getItem("sak-admin-sel-tab")) : activeIndex;
        return index;
    }
    
    return (      
        <div className="admin">
            <MemberstackProtected
                onUnauthorized={<Unauthorized />}
                allow={{
                    permissions:fn.getAdminPermissions(),
                }}>
                <Card>
                    <TabView activeIndex={getActiveIndex()} onTabChange={(e) => handleTabChange(e.index)}>                        
                        <TabPanel header="Alias">
                            <EntityAlias title="Alias"/>
                        </TabPanel>
                        <TabPanel header="Account Groups">
                            <AccountGroups />                          
                        </TabPanel>
                        <TabPanel header="Data">
                            <AdminData title="Data" />
                        </TabPanel>
                        <TabPanel header="Blog">
                            <Blog title={`Blog`} />
                        </TabPanel>
                        <TabPanel header="Nodes">
                            <Nodes title={`Node`} />
                        </TabPanel>
                        <TabPanel header="Use Cases">
                            <AdminUseCases title={`Use Case`} />
                        </TabPanel>
                        <TabPanel header="Foundations">
                            <Foundations title={`Foundations`} />
                        </TabPanel>                        
                        <TabPanel header="HNS">
                            Hedera Name Service
                        </TabPanel>
                        <TabPanel header="Forum">
                            Forum
                        </TabPanel>
                        <TabPanel header="Subscriber Services">
                            Subscriber Services
                        </TabPanel>
                        <TabPanel header="Member Management">
                            Member Management
                        </TabPanel>
                        <TabPanel header="Settings">
                            Settings
                        </TabPanel>
                    </TabView>
                </Card>
            </MemberstackProtected>
        </div>

    );
  }

  export default Admin