import React from 'react';
import Unauthorized from './../routes/unauthorized';
import { MemberstackProtected } from "@memberstack/react";
import * as fn from './../shared/fn';
const HNS = (props) => {
    
    return (
        <div>
            <MemberstackProtected
                onUnauthorized={<Unauthorized />}
                allow={{
                    permissions: fn.getFullAccessPermissions()
                }}>
                gated content that only members and admins can see
            </MemberstackProtected>              
        </div>  
        
    );
  }

  export default HNS