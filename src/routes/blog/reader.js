import React, { useState } from 'react';
import { Editor } from 'primereact/editor'

/*
     useEffect(() => {        
    
    });
*/

const ArtcleReader = (props) => {
    const [content] = useState(props.text);
    return (   
        <div className="p-3 flex flex-column flex-auto">
            <div className={`article-full`}>
                <Editor 
                    value={content}
                    readOnly />
            </div>
        </div> 
        
    );
  }

  export default ArtcleReader