import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import { Editor } from 'primereact/editor'
import { ContextMenu } from 'primereact/contextmenu';
import { InputTextarea } from 'primereact/inputtextarea';
import $ from 'jquery';

const AdminEditor = (props) => {
    const [showDialog, setShowDialog] = useState(false);
    const [editorContent, setEditorContent] = useState();

    const cm = useRef(null);
    const onHideDialog = () => {        
        setShowDialog(false);
    }
    
    const getEditorContent =() => {
        const content = $("#AdminEditor .p-editor-content .ql-editor").html();
        return cleanString(content);
    }
    const getEscapedEditorContent = () => {
        $("textarea.admin-editor-content").select();
        var content = $("textarea.admin-editor-content").text()
        //console.log(content);
        return content;
    }
    const getSavedEditorContent = () => {
        const content = localStorage.getItem('foundations-content');
        return cleanString(content);
    }
    const refreshEditorFromLocal =() => {
        const savedContent = getSavedEditorContent();
        if(savedContent) {
            var cleanedStr = cleanString(savedContent);
        }
            $("#AdminEditor .p-editor-content .ql-editor").html(cleanedStr);
    }
    const saveEditorContent = () => {
        const editorContent = getEditorContent();

        if(editorContent) {
            deleteSavedEditorContent();
            localStorage.setItem('foundations-content', editorContent);
        }
        
    }
    const deleteSavedEditorContent = () => {
        localStorage.removeItem('foundations-content');        
    }

    const handleShowHTMLClick = (e) => {
        var content = getEditorContent();
        content = JSON.stringify(content);
        setEditorContent(content);
        setShowDialog(true);
    }

    const copyToClipboard = () => {
        const content = getEscapedEditorContent();
        navigator.clipboard.writeText(content);
    }
    const cleanString = (str) => {
        if(!str) return;

        return str
            //.replace('"', '')
           // .replace('"','')
           // .replace(/\t+/g, '')
            //.replace('\"','');
    }

    const contextMenuItems = [
        {
            label:'Show HTML',
            icon:'pi pi-code',
            command: (e) => {
                handleShowHTMLClick(this);
            } 
        },
        {
            label:'Save',
            icon:'pi pi-fw pi-save',
            command: (e) => {
                saveEditorContent();
            } 
        },
        {
            label:'Refresh',
            icon:'pi pi-fw pi-refresh',
            command: (e) => {
                refreshEditorFromLocal(true);
            } 
        },
        {
            label:'Delete',
            icon:'pi pi-fw pi-exclamation-triangle',
            command: (e) => {
                deleteSavedEditorContent(true);
            } 
        }
    ];
 
    const dialogFooter =()=> {
        return <div className={`sak-buttons--row`}>
                <Button 
                    label='Copy to Clipboard' 
                    className={`sak-button sak-button-sm`}
                    onClick={(e) => copyToClipboard()}
                />

                <Button 
                    label='Close' 
                    className={`sak-button sak-button-sm`}
                    onClick={() => onHideDialog()}
                />
            </div>
    }

  return (
        <div>
            <Editor 
                id={`${props.id ? props.id : 'AdminEditor'}`}
                value={props.editorValue}
                onContextMenu={(e) => cm.current.show(e)}
                readOnly={false} 
                className={`editor admin`}
                onTextChange={props.onTextChange}
                modules={{
                    toolbar: [
                        [{ 'header': [1, 2, 3, false, 5] }],
                        [{ 'size': ['small', 'normal', 'large'] }], 
                        ['bold', 'italic', 'underline', 'strike'],
                        [ 'link', 'image', 'video', 'code-block','blockquote',],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                        [{ 'align': [] }], // text direction
                        [{ 'color': [] }, { 'background': [] }],
                        // ['attachment'],
                        ['clean']
                    ]
                }}
            />
            <ContextMenu model={contextMenuItems} ref={cm}/>
            <Dialog 
                id='editorHtmlContent' 
                visible={showDialog}
                onHide={() => onHideDialog()}
                footer={dialogFooter}
            >
                <InputTextarea 
                    value={`${editorContent}`} 
                    className={`admin-editor-content`} 
                    resizable={false}
                />                                            
            </Dialog>
        </div>
  );
}

export default AdminEditor