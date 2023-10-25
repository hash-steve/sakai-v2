import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Galleria } from 'primereact/galleria'
import Splash from './splash';
import Blog from './blog';
import Plans from './plans';
import Features from './features';
import Membership from './../membership';

const Default = (props) => {
    const [screens, setScreens] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const fc = localStorage.getItem("fc");    
    
    useEffect(() => {
        setScreens(            
            {
                "data": [
                    {"screen": <Splash />, "name": "Home", "caption": ""},
                    {"screen": <Features />, "name": "Explore the Features", "caption": "EXPLORE THE FEATURES"},
                    {"screen": <Plans />, "name": "Become a Member", "caption": "BECOME A MEMBER"},
                    {"screen": <Blog />, "name": "Blog", "caption": "GET NOTIFICATIONS OF NEW ISSUES OF THE ENLIGHTENED HBARBARIAN"},
                    {"screen": <>For a quicker response, visit us on discord</>, "name": "Contact", "caption": "Contact"},                   
                ]
            }     
        )

        const queryParams = new URLSearchParams(location.search);
        if (queryParams.has('fromCheckout') || queryParams.has('forceRefetch')) {
            queryParams.delete('fromCheckout');
            queryParams.delete('forceRefetch');
            navigate('/', { replace: true })
        }
    
    }, [location.search, navigate])

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    const caption = (item) => {
        return (
            <React.Fragment>
                <div className="mb-2">{item.caption}</div>
            </React.Fragment>
        );
    }

    const indicatorTemplate = (index) => {
        return (
            <span className="indicator-text">
                {screens.data[index].name}
            </span>
        )
    }

    const screenTemplate = (item) => {
        return (<div className={`item`}>{item.screen}</div>)
    }

    //console.log(fc);

    if(fc!=="1") {
        return (        
            <div className={`${props.title.toLowerCase()}`}>
                <Galleria 
                    value={screens.data} 
                    numVisible={1} 
                    showThumbnails={false}
                    showIndicators
                    autoPlay={false}
                    indicatorsPosition="left"
                    indicator={indicatorTemplate}
                    item={screenTemplate}
                    responsiveOptions={responsiveOptions}
                    caption={caption}
                    className={``}
                />
            </div>
        );
    }
    else {
        return <Membership />
    }

    
}
   
export default Default


        