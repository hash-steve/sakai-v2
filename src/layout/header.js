import React, { forwardRef, useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom'
import { Toolbar } from 'primereact/toolbar';
import { Link } from 'react-router-dom';
import LogoutButton from './../components/buttons/logout-button';
import LoginButton from './../components/buttons/login-button';
import SignupButton from './../components/buttons/signup-button';
import * as constants from './../shared/constants';
import * as fn from './../shared/fn';

const Header = forwardRef((props, ref) => {
    const [member, setMember] = useState(props.member);
    const [showBanner, setShowBanner]=useState(false);
    const [showSignupButton, setShowSignupButton]=useState(false);

    const location = useLocation();    
    const isAppRoot = location.pathname === '/';

    useEffect(() => {

        if(!props.member) {
            props.memberstack.getCurrentMember()
                .then(({ data: member }) => {
                    setMember(member);                    
                    setShowBanner(!member && isAppRoot ? true : false);
                    setShowSignupButton(member ? false : true);
                })
                .catch();       
        }
        else {
            setMember(props.member);
            const isUserAccess = props.member.permissions[0]==='f02bab43-194c-49a2-8cc3-e231a330f472' || props.member.permissions.length===0;
            const hasNoPlans=props.member.planConnections.length===0;
            setShowBanner(hasNoPlans && isAppRoot ? true : false);
            setShowSignupButton(hasNoPlans && isUserAccess ? true : false);
        }
    }, [props, isAppRoot, member])

    const rightContents = (
        <React.Fragment>            
            <div className={`top-menu-buttons`}>                                    
                {props.member ? 
                    <LogoutButton 
                        className={`sak-button logout-button`}
                        member={props.member} 
                        memberstack={props.memberstack}  
                    /> 
                    : 
                    <LoginButton
                        className={`sak-button login-button`}
                        member={props.member} 
                        memberstack={props.memberstack} 
                    />
                }
            </div>
        </React.Fragment>
    );

    const centerContents = (
        <React.Fragment>
            <div className={`${showSignupButton ? '' : 'hidden'}`}>
                <SignupButton
                    member={props.member}
                    label={`${ props.member && props.member.planConnections.length===0 ? "Complete your Membership" : "Become a Member" } `}
                    renderAsLink= {false}
                    disabled={false}                
                />
            </div>
        </React.Fragment>
    )

    const leftContents = (
        <React.Fragment>
            {props.sideBar}
            <div className="flex align-items-left flex-shrink-0">                
                <Link to="/" className="layout-topbar-logo">                                    
                    <div className=''>                             
                        <div className='masthead'>
                            <div className='icon icon-logo' />         
                            <div className={`app-name`}>
                                <span className={`app-name-0`}>{constants.APP_NAME_0}</span>
                                <span className={`app-name-1`}>{constants.APP_NAME_1}</span>
                            </div>                         
                        </div>
                    </div>
                </Link>
            </div>
        </React.Fragment>
    );
    
    return (
        <div>
            <header className="layout-topbar">
                <Toolbar left={leftContents} center={centerContents} right={rightContents} />
            </header>
            <div className={`${showBanner ? '' : 'hidden'}`}>
                <div className="banner px-4 md:px-8 py-3">
                    Limited number of subscriptions available for only $199/year!
                    <div className='text-xl pt-3'>Hashpoint Research is making a limited number of subscriptions available for only
                        $199/year, which is a <span className='callout-text'>$500 savings</span> off the regular subscription price of $699.&nbsp;
                        
                        <SignupButton 
                            label={`${ props.member && props.member.planConnections.length===0 ? `Complete your Membership` : `Become a Member` } `}
                            renderAsLink= {true}
                        />today!
                    </div>
                </div>
            </div>            
        </div>
    );
});

export default Header;
