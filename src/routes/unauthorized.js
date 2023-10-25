import React from 'react';
import { Skeleton } from 'primereact/skeleton';
//import SignupButton from './../components/buttons/signup-button';
import * as cnst from './../shared/constants';
//import * as fn from './../shared/fn';

const Unauthorized = (props) => {
    //const mt = props.mt ? props.mt : 8;

    return (   
        <div style={{paddingTop: 'calc(100vh - 90vh)', margin : '0 5%'}} className={`m-8 w3-display-middle unauthorized text-align-center`}>           

            <Skeleton width="86%" className="mb-2 ml-8"></Skeleton>
            <Skeleton width="84%" className="mb-2"></Skeleton>
            <Skeleton width="85%" className="mb-2"></Skeleton>
            <Skeleton width="89%" className="mb-2"></Skeleton>
            <Skeleton width="23%" className="mb-2"></Skeleton>
            <div>&nbsp;</div>
            <Skeleton width="83%" className="mb-2 ml-8"></Skeleton>
            <Skeleton width="88%" className="mb-2"></Skeleton>
            <Skeleton width="45%" className="mb-2"></Skeleton>
            
            
            <Skeleton height="4em" width="96%" className="mb-2 hidden">                
            </Skeleton>           
            
            
            <div>&nbsp;</div><div>&nbsp;</div>
            <h1 className="w3-jumbo w3-animate-top w3-center"><code>You have reached a subscriber's only section of the site.</code></h1>
            <div>&nbsp;</div>
            <hr className="w3-border-white w3-animate-left" style={{margin:"auto", width:"50%"}} />
            <div>&nbsp;</div>
            <h3 className="w3-center w3-animate-right" style={{margin:"auto", width:"75%"}}>
                <div style={{margin:"auto", lineHeight: '40px'}}>{`Please login with an account that is authorized to view this content.  If you don't have an account,
                click the "${cnst.LBL_BECOME_A_MEMBER}" button at the top and subscribe today!`}</div>
            </h3>
            {/* <i pi pi-arrow-up></i> */}
            <div>&nbsp;</div><div>&nbsp;</div>
            <Skeleton width="80%" className="mb-2 ml-8"></Skeleton>
            <Skeleton width="89%" className="mb-2"></Skeleton>
            <Skeleton width="87%" className="mb-2"></Skeleton>
            <div>&nbsp;</div>
            <Skeleton width="86%" className="mb-2 ml-8"></Skeleton>
            <Skeleton width="85%" className="mb-2"></Skeleton>
            <Skeleton width="87%" className="mb-2 ml-0"></Skeleton>
            <Skeleton width="87%" className="mb-2"></Skeleton>
            <div>&nbsp;</div>
            <Skeleton width="86%" className="mb-2 ml-8"></Skeleton>
            <Skeleton width="89%" className="mb-2"></Skeleton>
            <Skeleton width="35%" className="mb-2"></Skeleton>
            <div>&nbsp;</div>
        </div>
    );
  }

  export default Unauthorized