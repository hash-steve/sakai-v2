import React from 'react';
import ReactDOM from 'react-dom/client';
//import SessionProvider from './providers/session';
import './styles/scss/layout/layout.scss';
//import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MemberstackProvider } from "@memberstack/react";
import memberstackDOM from "@memberstack/dom";
import App from './App';
import Login from './login';
import Default from "./routes/default/default";
import Membership from "./routes/membership";
import Profile from "./routes/profile";
import ChartBook from "./routes/chartbook";
import Dashboard from "./routes/dashboard/dashboard";
import Analytics from "./routes/analytics/analytics";
import Admin from "./routes/admin/admin";
import Blog from "./routes/blog/blog";
import Plans from "./routes/default/plans";
import Foundations from "./routes/foundations";
import Forum from "./routes/forum";
import GC from "./routes/gc/gc";
import HNS from "./routes/hns";
import SubscriberServices from "./routes/services";
//import * as fn from './shared/fn';

const config = { publicKey: "pk_sb_593b6dbb29acb36b95b5" }

const memberstack = memberstackDOM.init({
    publicKey: config.publicKey,
    sessionDurationDays: 1
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const fromCheckout = urlParams.get('fromCheckout');
const root = ReactDOM.createRoot(document.getElementById('root'));

localStorage.setItem('fc', fromCheckout ? 1 : 0);

root.render(
    <MemberstackProvider config={config}>
        <React.Fragment>
            <BrowserRouter>
                {/* <SessionProvider> */}
                    <Routes>
                        <Route 
                            path="/" 
                            element={
                                <App 
                                    urlParams={ urlParams } 
                                />
                            }>
                            <Route index element={<Default title="Default" splash={true} memberstack = { memberstack }/>} />
                            <Route path="home" element={<Default title="Default" />} />
                            <Route path="dashboard"element={<Dashboard title="Dashboard"/>} />
                            <Route path="members" element={ <Membership />}/>
                            <Route path="profile" 
                                element={
                                    <Profile 
                                        title="Profile"
                                        memberstack = { memberstack } 
                                    />
                                } 
                            />
                            <Route path="chartbook" element={<ChartBook title="Chart Book"  />} />
                            <Route path="analytics" element={<Analytics title="Valuation Model" />} />
                            <Route path="blog" element={<Blog title="Enlightened Hbarbarian" />} />
                            <Route path="admin" element={<Admin title="Admin" />} />
                            <Route path="foundations" element={<Foundations title="Foundations" />} />
                            <Route path="gc" element={<GC title="Governing Council" />} />
                            <Route path="hns" element={<HNS title="Hedera Name Service" />} />
                            <Route path="forum" element={<Forum title="Forum"/>} />
                            <Route path="plans" element={<Plans title="Membership Plans" />} />
                            <Route path="subscribersvcs" element={<SubscriberServices title="Subscriber Services" />} />
                            <Route path="login" element={ <Login />}/>
                        </Route>
                    </Routes>
                {/* </SessionProvider> */}
            </BrowserRouter>               
        </React.Fragment>
    </MemberstackProvider>
);

if ('serviceWorker' in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`).then(
      registration => {
        console.log('Service worker registration succeeded:', registration);
      },
      /*catch*/ error => {
        console.error(`Service worker registration failed: ${error}`);
      }
    );
  } else {
    console.error('Service workers are not supported.');
  }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);
