import React from 'react';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';

/*
     useEffect(() => {        
    
    });
*/

const ArticleSummary = (props) => {
    return (            
        <div className="col-3">
            <div className="article-grid-item">                
                <div className="article-grid-detail">
                    <div className={`article-preview`}>
                        <div className={`article-summary card`}  style={{borderTop : '5px solid '+ props.summaryColor}}>
                            {/* <ScrollPanel> */}
                                <Editor 
                                    className={`read-only`} 
                                    readOnly={true} 
                                    value={props.data.text}
                                />
                            {/* </ScrollPanel> */}
                           <div className={`article-date`}>
                                <span>Date: {props.data.date}</span>
                                <span>
                                    <Button
                                        id={`${props.data.id}`}                                        
                                        label={`Read More`}
                                        onClick={props.handleOpenReaderClick}
                                    />
                                </span>
                            </div>
                        </div>                            
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticleSummary