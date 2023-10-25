import React, { useState, useEffect, useRef } from 'react';
/*
     useEffect(() => {        
    
    });
*/

const Template = (props) => {
    return (   
        <div className="p-3 flex flex-column flex-auto">
            <div className="border-0 surface-border border-round surface-section flex-auto">
                <div className="title">{props.title}</div>
            </div>
            <div>
                
            </div>
        </div> 
        
    );
  }

  export default Template