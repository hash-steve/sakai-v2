import React, { Component, useState } from 'react';
import { Button } from 'primereact/button';
import * as fn from '../../shared/fn';

const ConfirmDialog = (props) => {
  const [width, setWidth] = useState(props.width ??'30vw');
  const [visible, setVisible] = useState(props.visible ?? false);
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('transparent');
  const [mainText, setMainText] = useState('No text');
  const [detailText, setDetailText] = useState('No detail text');
  const [hideButtonText, setHideButtonText] = useState('Close');
    
  const handleHideClick = (e) => {
    setShowVisible(false);
  }

  return (
        <div className="sak sak-dialog">
            <Dialog 
                visible={visible} 
                onHide={() => setShowVisible(false)} 
                position="top" 
                footer={<Button className='sak-button sak-button-sm' onClick={(e) => handleHideClick(e) }>{ hideButtonText }</Button>} 
                showHeader={false} 
                breakpoints={{ '960px': '80vw' }} 
                style={{ width: width }}>
                
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className={`pi ${icon ? '' : 'hidden'}`} style={{ fontSize: '3rem', color: {color} }}></i>
                    <h5>{mainText}</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '0' }}>
                        {detailText}
                    </p>
                </div>
            </Dialog>
        </div> 
    );
  }

  export default ConfirmDialog