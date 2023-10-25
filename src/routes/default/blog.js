import React from 'react';
import { Link } from 'react-router-dom';

const Blog = (props) => {
    const msMem = JSON.parse(localStorage.getItem('_ms-mem'));
    var email = msMem ? msMem.auth.email : null;

  return (
    <div>
        <div className={`${email ? '' : 'hidden'} substack-subscribe mb-3 pt-0`}>
            <a href="https://hbarbarian.substack.com/" target="_blank"  rel="noreferrer">
                <img 
                    src="https://substackcdn.com/image/fetch/w_170,c_limit,f_auto,q_auto:best,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F77cd1b6e-9f75-4153-92c9-3160fc9f49c4_1024x1024.png" 
                    alt="The Enlightened Hbarbarian" 
                    className="publication-logo" />
            </a>
            
            <h1 className="publication-name mt-3 mb-1">
                <Link to="https://hbarbarian.substack.com/" target="_blank" rel="noreferrer" className={`${email ? 'hidden' : ''}`}>
                    <span className="balance-text visible">The Enlightened Hbarbarian</span>
                </Link>
                <Link to="/blog" className={`${email ? '' : 'hidden'}`}>
                    <span className="balance-text visible">The Enlightened Hbarbarian</span>
                </Link>
            </h1>
            <p className="publication-tagline mb-3">
                <span className="balance-text visible">
                    For the uncommonly curious: the insights, knowledge, and conviction necessary for a 100-year investment.
                </span>
            </p>
        </div>
        <div className={`${email ? 'hidden' : ''}`} >
            {/* <div className={'uppercase text-medium text-2xl text-center mb-5'}>Get Notifications of new issues of <span className={`primary`}>the Enlightened Hbarbarian</span></div> */}
            <embed src="https://hbarbarian.substack.com/embed" autoFocus={false} width="800px" height="320"/>
        </div>
        
    </div>
  );
};

export default Blog;
