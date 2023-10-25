import React, { useState, useEffect, useRef } from 'react';
import { SelectButton } from 'primereact/selectbutton';

/*
     useEffect(() => {
    
    });
*/

const ButtonGroup = (props) => {
    const [value, setValue] = useState(props.value);

    const onOptionChange = (opt) => {
        setValue(opt);
        props.optionChange(opt)
    }

    return (   
        <div className="sak-button-group w-12 text-align-right">
            <SelectButton 
                value={value} 
                options={props.options} 
                onChange={(e) => onOptionChange(e.value)} 
                optionLabel="name" 
                multiple 
            />
        </div> 
        
    );
  }

  export default ButtonGroup