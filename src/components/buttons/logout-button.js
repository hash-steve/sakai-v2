import React, { useState, useRef } from 'react';
import {  useNavigate } from 'react-router-dom';
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
//import * as fn from '../../shared/fn';

const LogoutButton = (props) => {
  const [member] = useState(props.member);
  const memberstack = props.memberstack;
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleLogoutClick = async (e) => {
    const res = await memberstack.logout();   
    navigate("/login", { state: { res } });
  }
 
  const handleProfileClick = async (e) => {    
    navigate("/profile");
  }

  const buttonOptions = () => {
      return [
        {
            label: `Profile`,
            icon: 'pi pi-user',
            command: () => {
                handleProfileClick();
            }
        },
        {
            label: `Log out`,
            icon: 'pi pi-sign-out',
            command: () => {
                handleLogoutClick();
            }
        },
        
      ];
  }

  return (
    <div>        
        <div className="sak-wrapper-button">
          <Toast ref={toast} position= "bottom-right"></Toast>
            <div>            
              <SplitButton
                  label={`${member.auth.email}` }
                  icon={<Avatar label={`HR`} shape="circle"/>}
                  model={ buttonOptions(member.customFields.firstname) } 
                  className={`p-button--plain mr--2 mb--2`}
                  
                >
              </SplitButton>
            </div>
        </div>
      </div>
      
    );
  }

  export default LogoutButton