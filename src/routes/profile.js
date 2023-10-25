import React, { useState } from 'react';
import { MemberstackProtected, ProfileModal } from "@memberstack/react";
import $ from 'jquery';
import { Button } from 'primereact/button';
//import { TabView, TabPanel } from 'primereact/tabview';
//import * as fn from './../shared/fn';

const Profile = (props) => {
    const [member, setMember] = useState();
    
    //const [activeIndex, setActiveIndex] = useState(0);

    // const handleTabChange = (index) => {
    //     setActiveIndex(index);
    //     sessionStorage.setItem('sak-gc-sel-tab', index);
    // }

    // const getActiveIndex = () => {
    //     const index = sessionStorage.getItem("sak-gc-sel-tab") ? parseInt(sessionStorage.getItem("sak-gc-sel-tab")) : activeIndex;
    //     return index;
    // }

    props.memberstack.getCurrentMember()
        .then(({ data: member }) => setMember(member))
        .catch();

    $(function() {
       //$(".ms-modal__custom-field-container .ms-form__input").prop("disabled", true);
       $("label[for='firstname']").html("First Name");
       $("label[for='lastname']").html("Last Name");
    });

    return (
            <div className={`profile`}>
                <div style={{paddingTop: '50px'}}>
                    <Button 
                        className="sak-button" 
                        label={`Open Profile`}
                        onClick={(e) => !member ? props.memberstack.openModal("LOGIN") : props.memberstack.openModal("PROFILE")}
                    />
                </div>
                <MemberstackProtected>
                    <ProfileModal />
                    {/* <TabView className={`card out-er`}>
                        <TabPanel header={props.title}>
                            <TabView className={`in-ner`}
                                activeIndex={getActiveIndex()} 
                                onTabChange={(e) => handleTabChange(e.index)}
                            >
                                <TabPanel>
                                    <ProfileModal />
                                </TabPanel>
                            </TabView>
                        </TabPanel>    
                    </TabView> */}
                </MemberstackProtected>
            </div>

           
        
    );
  }

  export default Profile