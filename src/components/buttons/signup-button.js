import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import SubscribeForm from '../signup-form';
import * as fn from '../../shared/fn';

const SignupButton = (props) => {
    const [disabled] = useState(props.disabled);
    const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
    const [label] = useState(props.label);
    const [prices, setPrices] = useState();

    const handleButtonClick = (e) => {
        setShowSubscribeDialog(true)}
      
    const handleDialogClose = (e) => { 
        setShowSubscribeDialog(false);
    }

    const fetchPlans = async () => {
         window.$memberstackDom.getPlans()
             .then(({ data: allPlans }) => {
                 const prices= allPlans[0].prices.sort((a,b) => (a.amount - b.amount));
                 setPrices(prices);
             })
             .catch();
       };
  
     useEffect(() => {
         if(!prices)
             fetchPlans();
     }, [prices])

    return (  
        <span>
                <Button
                    id = {fn.randomString(10)}
                    visible={props.renderAsLink ? false : true}
                    label={`${ props.label }`}
                    onClick={(e) => !disabled ? handleButtonClick(e) : void(0)}
                    className={`p-button-outlined p-button callout-button sak-button`}
                    tooltip={``}
                    disabled={disabled}
                />
                <Link className={`${props.renderAsLink ? '' : 'hidden'} callout-link`} onClick={(e) => !disabled ? handleButtonClick(e) : void(0)}>{ label }</Link>
                
                <Dialog
                    className={`sak sak-wrapper sak-form-wrapper`}
                    visible={showSubscribeDialog && !disabled}
                    onHide={() => setShowSubscribeDialog(false)}
                    modal
                    breakpoints={fn.getBreakpoints()}
                    header={
                        <div className="flex flex-column gap-2">
                            <div className="m-0 text-align-left line-height-3">
                                {`${label + ' - '} ${prices && prices[0].name && `$`+ prices[0].amount}`}
                            </div>                    
                        </div>
                    }              
                    style={{ width: '30vw' }}
                    draggable={false}
                    resizable={false}
                >
                    <div>
                        <SubscribeForm 
                            member={ props.member }
                            visible={ showSubscribeDialog }
                            prices = { prices }
                            handleDialogClose={ handleDialogClose }
                        />
                    </div>
                </Dialog>
      
        </span>
    );
  }

  export default SignupButton