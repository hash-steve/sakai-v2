import React, { useEffect } from 'react';
//import Cookies from 'js-cookie';
//import * as fn from './shared/fn';

const Login = (props) => {

    useEffect(() => {
      localStorage.removeItem("__sak:session");
    }) 

    return (  
        <div className="content center" style={{height: '100%'}}>
            <div className="column center" style={{fontSize: '1.5em'}}>
                <div>You have successfully logged out.</div>
                <div>&nbsp;</div>
                <div>Click the 'Login' button at the top of the page to login again.</div>
            </div>
      </div>
    );
  }

  export default Login