import React, { Component } from 'react';

const Button = (props) => {
    return (   
        <div className="sak-button">
            <div className="border-0 surface-border border-round surface-section flex-auto">
                <div className="title">{props.title}</div>
            </div>
            <div>
                
            </div>
        </div> 
        
    );
  }

  export default Button