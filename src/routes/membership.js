import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';


const Membership = (props) => {
    
    const handleLinkClick = () => {
        localStorage.removeItem("fc");
    }

    return (
        <div>        
            <div style={{paddingTop: 'calc(50vh - 15vh)', margin : '0 5%' , fontSize: '30px'}} className={`m-8 w3-display-middle text-align-center`}>           
                Membership created!  Thank you for your membership with Hashpoint Research.
                <div>&nbsp;</div>
                <div style={{ fontSize: '25px'}}>
                <Link to="/dashboard" className={`link`} onClick={handleLinkClick}>
                    Continue to Dashboard
                </Link>
                </div>
            </div>
            
        </div>
    );
  }

  export default Membership