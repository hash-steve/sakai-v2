import React, { Component, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import * as fn from '../../shared/fn';

const ConfirmDlg = (props) => {
  const [width, setWidth] = useState(props.width ?? '30vw');
  const [dialogType, setDialogType] = useState(props.dialogType ?? 'info');     //success, fail, info, warning, question
  const [position, setPosition] = useState(props.position, 'center');
  const [header, setHeader] = useState(props.header, null);
  const [redirect, setRedirect] = useState(props.redirect, '/dashboard');
  const [mainText, setMainText] = useState(props.mainText, 'No text');
  const [detailText, setDetailText] = useState(props.detailText, 'No detail text');
  const [hideButtonText, setHideButtonText] = useState(props.hideButtonText, 'Close');
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const getIconClass = () => {
    var className='pi-';

    switch(dialogType) {
        case 'success':
          className += 'pi-check-circle '
          break;
        case 'info':
            className += 'pi-info-circle '
          break;
        case 'warning':
            className += 'pi-exclamation-triangle '
            break;
        case 'question':
                className += 'pi-exclamation-circle '
        case 'fail':
            className += 'pi-exclamation-circle '
            break;
        default:
            className = 'pi-info-circle'
      }

      return className;
  }

  return (
        <div className="sak sak-dialog confirm-dialog">
            <ConfirmDialog 
                visible={visible} 
                onHide={() => setVisible(false)}              
                message={<div>{props.confirmText}</div><div>{props.confirmText2}</div>}
                header={ header }
                footer={
                    <Button className='sak-button sak-button-sm' onClick={(e) => props.onHideClick(e) }>
                        { hideButtonText }
                    </Button>
                }
                icon={ getIconClass() }
                accept={ props.accept } 
            />           
        </div> 
    );
  }

  export default ConfirmDlg