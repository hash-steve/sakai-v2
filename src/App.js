
import React, { useState, useEffect, useRef } from 'react';
//import { useSession } from './hooks/session';
import { Outlet, useNavigate } from "react-router-dom";
import memberstackDOM from "@memberstack/dom";
import { Dialog } from 'primereact/dialog';
import Header from './layout/header';
import NavMenu from "./layout/navmenu";
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import * as fn from './shared/fn';
import * as constants from './shared/constants';
import * as api from './api/api'


const App = (props) => {
    const [sidebarVisible, setSidebarVisible] = useState();
    const [member, setMember] = useState();
    const [showTokenDlg, setShowTokenDlg] = useState(false);
    //const [xxx, setXxx] = useState();
    const navigate = useNavigate();
    const config = { publicKey: "pk_sb_593b6dbb29acb36b95b5" }

    const memberstack = memberstackDOM.init({
        publicKey: config.publicKey,
        sessionDurationDays: 1
    });

    const listenerRef=useRef();

    // var myElement = document.getElementById("root");
    //     myElement.addEventListener("contextmenu", function(event) {
    //         event.preventDefault(); // Prevent the default right-click menu behavior
    // });

    const createUserSession = async (data) => {
        let tokenId='';
        let sessionId=localStorage.getItem('__sak:session');

        if(listenerRef.current) return;

        if(data && !sessionId) {
            listenerRef.current=true;
            const member = await api.getMember(data.id);
            
            if(member.data.data.length>0) {
                const res = await api.createUserSession(data.id, tokenId, data.createdAt);
                localStorage.setItem('__sak:session', res.data.data[0].sessionid);
                return;
            }

            return;
        }
        else {
            listenerRef.current=true;
            await api.expireUserSession(sessionId);
            localStorage.removeItem('__sak:session');
        }
    }          

    const toggleSidebar = (v) => {
        setSidebarVisible(v);
    }    
    
    const onAckClick = (name, position) => {
        setShowTokenDlg(false);

        localStorage.setItem('__sak:cookie_ack', new Date())
    }

    const renderDlgFooter = (name) => {
        return (
            <div>
                <Button label="Accept" icon="pi pi-check" onClick={() => onAckClick(name)} autoFocus />
            </div>
        );
    }

    const cookieAck = (name) => {
        const ack = localStorage.getItem('__sak:cookie_ack')

        if(!ack) {
            setShowTokenDlg(true);
        }
    }

    useEffect(() => {
        const listener = memberstack.onAuthChange(data => {
            setMember(data);
            createUserSession(data);
        });

        if(!member) {
            memberstack.getCurrentMember()
            .then(({ data: member }) => setMember(member))
            .catch();

            listenerRef.current=false;
        } else {
            listener.unsubscribe();
            listenerRef.current=false;
            var init = sessionStorage.getItem('init');

            if(!init) {
                sessionStorage.setItem('init', true);
            } else {
                if(!fn.isAdmin(member)) {
                    navigate(member.loginRedirect, { state: { member: member, fromCheckout: true  } });
                }                
            }

            sessionStorage.removeItem('init'); 
        }        
    }, [member, memberstack, navigate])
 
     useEffect(() => {
        cookieAck();
    }, [])

    const SideBar = () => {        
        return <div id="app--sidebar" className="flex- flex--column h--full">
            <div className="flex- flex--column h--full">                
                <Sidebar 
                    visible={sidebarVisible}
                    onHide={() => setSidebarVisible(false)}
                >
                    <NavMenu toggleSidebar={toggleSidebar} member={ member } />
                    <div className={`mx-0 mt-6`} 
                        style={{position: 'fixed', bottom : '15px', left: '40px'}}>
                    </div>
                </Sidebar>
                
                <div className={`mx-0 pt-0`}>&nbsp;</div>
               
                <Button style={{border: '1px solid red'}}
                    className={`sak-button sidebar-toggle`} 
                    icon="pi pi-bars" 
                    onClick={(e) => setSidebarVisible(true)}                    
                />
            </div>                                
        </div>
    }

    return (
        <main className={`app`}>
            <header className={``}>
                <Header
                    appName = {constants.APP_NAME}
                    sideBar={ <SideBar/> }
                    member = { member }
                    //fromCheckout = {props.fromCheckout}
                    memberstack = { memberstack }
                />
            </header>
            
            <div className={`row container outlet-container`}>
                <Outlet />
            </div>
            
            <Dialog 
                header="Cookie Consent" 
                visible={showTokenDlg}
                footer={renderDlgFooter('showTokenDlg')}
                className={`cookie-ack-dlg`}
                modal
                resizable={false}
                draggable={false}
                closeOnEscape={false}
                closable={false}
                blockScroll={true}
                maskClassName={`sak-no-overlay`}
                breakpoints={{'960px': '75vw', '640px': '100vw'}}
            >
                <div>                        
                    We use cookies and similar methods to recognize visitors and remember their preferences. 
                    We also use them to measure performance and site traffic. We do not collect personally identifying information.
                    By clicking 'Accept,' you consent to the use of these methods by us and third parties. You can review our use of cookies
                    by visiting our Privacy policy.                   
                </div>
            </Dialog>

            {/* <footer className={``}>
                <p>footer (fixed height)</p>
            </footer> */}
        </main>
    )
}

export default App;