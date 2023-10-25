import React, { Component, useState } from 'react';
import { Button } from 'primereact/button';
import * as fn from './../../shared/fn';

const SakButton = (props) => {
  const [value, setValue] = useState(false);
  
  const handleButtonClick = (e) => {
    console.log(e)
  }

  return (
        <div className="sak sak-button">
            <Button
                id = {fn.randomString(10)}
                visible={true}
                label={`button label`}
                onClick={(e) => handleButtonClick(e)}
                className={``}
                tooltip={``}
            />
        </div> 
        
    );
  }

  export default SakButton