import React, { useState } from 'react';
import { useMemberstackModal } from "@memberstack/react";
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import * as fn from '../../shared/fn';

const LoginButton = (props) => {
    const { openModal, hideModal } = useMemberstackModal();
    const [visible] = useState(props.visible);
    const navigate = useNavigate();

    return (        
        <div className="sak-wrapper sak-wrapper-button">
            <span className='logged-in-as'>&nbsp;</span>
            <Button
                id = {fn.randomString(10)}
                visible={visible}
                label={`Login`}
                onClick={(e) => fn.loadLoginModal(openModal, hideModal, navigate)}
                className={`p-button-outlined p-button sak-button sak-button-login sak-button-lg`}
                tooltip={``}                  
            />
        </div>
    );
  }

  export default LoginButton