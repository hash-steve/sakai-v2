
import React from 'react';
import Unauthorized from './../routes/unauthorized';
import { MemberstackProtected } from "@memberstack/react";
import * as fn from './../shared/fn';

    
const Forum = (props) => {
    return (   
        <div className={`ml-4`}>
            <MemberstackProtected
                onUnauthorized={<Unauthorized />}
                allow={{
                    permissions: fn.getFullAccessPermissions()
                }}>
                <widgetbot server="468391548283781130" 
                    channel="468391548283781132" 
                    
                >
                    <iframe 
                        title="WidgetBot Discord chat embed" 
                        allow="clipboard-write"
                        width={`${fn.vwToPx(95)}`} 
                        height={`${fn.vhToPx(90)}`} 
                        src="https://e.widgetbot.io/channels/468391548283781130/468391548283781132?api=a59e3da0-e367-424a-b3f6-5cdb26a7b266" >
                    </iframe>
                </widgetbot>
            </MemberstackProtected>                
        </div>        
    );
}

  export default Forum