import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './../../api/dbclient';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
//import { InputNumber } from 'primereact/inputnumber';
import { ToggleButton } from 'primereact/togglebutton';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import AdminEditor from './editor';
import * as fn from './../../shared/fn';
import * as fmt from './../../shared/formats';
import * as opts from './../../shared/options';

const UseCases = (props) => {

    const RECORD_SOURCE = 'usecase';
    const COMMIT_SOURCE = 'usecase';
    const RECORD_PK = COMMIT_SOURCE + 'id';

    const [records, setRecords] = useState(null);
    const [setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const [recordDialog, setRecordDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    //const [datePublished, setDatePublished] = useState(null);
    const [dateCreated, setDateCreated] = useState(null);
    const [setActive] = useState(null);

    const columns = [
        {field: 'title', header: 'Title'},
        {field: 'summary', header: 'Summary'},
        {field: 'content', header: 'Content'},
        {field: 'datecreated', header: 'Date Created'},
        //{field: 'datepublished', header: 'Date Published'},        
        {field: 'active', header: 'Active'},
    ];
    
    let emptyRecord = {
        usecaseid: null,
        title: '',
        summary: '',
        content: '',
        datecreated: fn.getUtcCalendarDate(),
        //datepublished: '',
        active: false,
    };

    const [record, setRecord] = useState(emptyRecord);

    // const datePublishedTemplate = (rowData) => {
    //     const dt = rowData.datepublished ? fn.dateToLocalDate(rowData.datepublished) : '';
    //     return <span className={``}>{dt}</span>;
    // }

    const dateCreatedTemplate = (rowData) => {
        const dt = rowData.datecreated ? fn.dateToLocalDate(rowData.datecreated) : '';
        return <span className={``}>{dt}</span>;
    }

    const activeTemplate = (rowData) => {
        return <i className={classNames('pi', {'true-icon pi-check-circle': rowData.active, 'false-icon pi-times-circle': !rowData.active})}></i>;
    }

    const getColumnTemplate = (column) => {
        let template;

        switch (column) {
            case "datecreated":
                template = dateCreatedTemplate;
                break;
            //case "datepublished":
            //    template = datePublishedTemplate;
            //    break;
            case "active":
                template = activeTemplate;
                break;
            default:
        }

        return template
    }

    const dynamicColumns = columns.map((col,i) => {
        return <Column 
            key={col.field} 
            field={col.field}
            className={col.field}
            header={fn.fieldNameToColumnName(col.header)}
            body={getColumnTemplate(col.field)}
        />;
    });

    const openNew = () => {
        setRecord(emptyRecord);
        setSubmitted(false);
        setRecordDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setRecordDialog(false);
    }

    const getRecords = async() => {
        const { data } = await supabase
          .from(RECORD_SOURCE)
          .select()
          .order(RECORD_PK, { ascending: true })
          
          //console.log(data)
          setRecords(data);
    }

    useEffect(() => {
        getRecords();
    });

    const findIndexById = (id) => {
         let index = -1;
         for (let i = 0; i < records.length; i++) {
             if (records[i][RECORD_PK]===id) {
                 index = i;
                 break;
             }
         }
         return index;
     }

    const handleResponse = async(rec, err) => {
        if(err) {           
            await supabase
                .from('apperror')
                .upsert({ code: err.code, message: err.message });
        }
        
        setRecordDialog(false);
        setDeleteDialog(false);
        setRecord(emptyRecord);
        setSubmitted(true);
    }

    const updateRecord = async(rec) => {
        if(!rec[RECORD_PK]) return;

        const { data, error } = await supabase
            .from(COMMIT_SOURCE)
            .update({           
                title: rec[columns[0].field],
                summary: rec[columns[1].field],
                content:  rec[columns[2].field],
                datecreated:  rec[columns[3].field],
                //datepublished:  rec[columns[3].field],
                active:  rec[columns[4].field]
            })
            .eq(RECORD_PK, rec[RECORD_PK])
            .select();

            handleResponse(data, error);            
            return error;
    }

    const insertRecord = async(rec) => {
        const { data, error } = await supabase
            .from(COMMIT_SOURCE)
            .insert([
                { 
                    title: rec[columns[0].field],
                    summary: rec[columns[1].field],
                    content:  rec[columns[2].field],
                    datecreated:  rec[columns[3].field],
                    active:  rec[columns[4].field] 
                },
            ])
            .select();
        
        handleResponse(data, error);
        return error;
    }

    const deleteRecord = async() => {
        if(!record[RECORD_PK]) return;

        let _records = records.filter(val => val[RECORD_PK] !== record[RECORD_PK]);
        
        const { data, error } = await supabase
            .from(COMMIT_SOURCE)
            .delete()
            .eq(RECORD_PK, record[RECORD_PK])
            .select();
            
        handleResponse(data, error);

        if(!error) {
            setRecords(_records);
            toast.current.show({ severity: 'success', summary: 'Record deleted', detail: '', life: opts.TOAST_LIFE });
        }            
        else
            toast.current.show({ severity: 'error', summary: `Error: ${error.code}`, detail: `${error.message}`, life: opts.TOAST_LIFE });
    }

    const saveRecord = async(e) => {
        e.currentTarget.disabled = true;

        let _records = [...records];
        let _record = {...record};
        let err;
        
        if (record[RECORD_PK]) {
            const index = findIndexById(record[RECORD_PK]);
            _records[index] = _record;
            err = await updateRecord(_record);
        }
        else {
            _records.push(_record);
            err = await insertRecord(_record);
        }       

        if(!err) {
            setRecords(_records);
            toast.current.show({ severity: 'success', summary: `Success `, detail: `Update successful`, life: opts.TOAST_LIFE });
        } else {
            toast.current.show({ severity: 'error', summary: `Error: ${err.code}`, detail: `${err.message}`, life: opts.TOAST_LIFE });
        }

        setRecordDialog(false);
        setRecord(emptyRecord);
        setSubmitted(true);
    }

    const onRefreshClick = () => {        
        getRecords();
    }

    // const onInputNumberChange = (e, name) => {
    //     const val = e.value || 0;
    //     let _record = {...record};
    //     _record[`${name}`] = val;

    //     setRecord(_record);
    // }

    const onInputChange = (e, name) => {
        //console.log(name);
        const val = (e.target && e.target.value) || e.htmlValue || '';
        let _record = {...record};
        _record[`${name}`] = val;

        setRecord(_record);
    }
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" onClick={onRefreshClick} />;
    const paginatorRight = <React.Fragment />;

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
            </React.Fragment>
        )
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>                    
            </React.Fragment>
        )
    }
    
    const actionTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editRecord(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteRecord(rowData)} />
            </React.Fragment>
        );
    }

    const editRecord = (record) => {
        setRecord({...record});
        setRecordDialog(true);
    }

    const confirmDeleteRecord = (record) => {
        setRecord(record);
        setDeleteDialog(true);
    }

    const confirmDelete = async() => {
        await deleteRecord();
    }

    const rejectDelete = () => {
        setDeleteDialog(false);
    }

    const recordDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveRecord} />
        </React.Fragment>
    );

    const onToggleChange = (e) => {
        const id = e.target.id;
        let _record = {...record};
        _record[`${id}`] = e.target.value;

        setActive(e.target.value);
        setRecord(_record);
    }

    return (   
        <div className={`admin table`}>
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
            
            <ConfirmDialog 
                visible={deleteDialog} 
                onHide={() => setDeleteDialog(false)} 
                message={`Confirm delete '${record[columns[0].field]}'`}
                header={`Confirm delete`}
                icon="pi pi-exclamation-triangle" 
                accept={confirmDelete} 
                reject={rejectDelete}
                className={`confirm-delete`}
            />
            <DataTable 
                ref={dt}
                value={records}
                dataKey= {RECORD_PK}
                rows={25}
                resizableColumns 
                columnResizeMode="fit"
                responsiveLayout="stack" 
                breakpoint="960px"
                stripedRows
                paginator
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
                rowsPerPageOptions={[10,25,50, 100]}
                paginatorLeft={paginatorLeft} 
                paginatorRight={paginatorRight}
                className={`datatable-${RECORD_SOURCE}`}
            >
                {dynamicColumns}
                <Column body={actionTemplate} className={`column-crud`}  />
            </DataTable>

            <Dialog 
                visible={recordDialog} 
                style={{ width: '50%' }} 
                header={props.title}
                modal 
                className="p-fluid" 
                footer={recordDialogFooter} 
                onHide={hideDialog}
                resizable                
            >
                <div className="admin form" style={{border: '0px solid red'}}>
                    <div className={`foundations`}>
                        <div className="column">
                            <div className="center">
                                <div>
                                    <label>{`${columns[0].header}`}<span className={`req-ast`}> *</span></label>
                                </div>
                            
                                <div>
                                    <InputText 
                                        id={`${columns[0].field}`} 
                                        value={record[columns[0].field].toString()} 
                                        onChange={(e) => onInputChange(e, `${columns[0].field}`)} 
                                        required
                                        autoFocus
                                        className={`${columns[0].field}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="column">
                            <div className="center">
                                <div>
                                    <label>{`${columns[1].header}`}<span className={`req-ast`}> </span></label>
                                </div>
                            
                                <div>
                                    <InputText 
                                        id={`${columns[1].field}`} 
                                        value={record[columns[1].field].toString()} 
                                        onChange={(e) => onInputChange(e, `${columns[1].field}`)} 
                                        className={`${columns[1].field}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="column">                                
                            <div className="center">
                                <div>
                                    <label>{`${columns[3].header}`}<span className={`req-ast`}></span></label>
                                </div>
                            
                                <div>
                                    <Calendar 
                                        id={`${columns[3].field}`}
                                        value={new Date(dateCreated ?? record[columns[3].field.toString()] ?? '')}
                                        dateFormat={fmt.DATE_FORMAT}
                                        onChange={(e) => setDateCreated(e.value)}
                                        showIcon
                                        showButtonBar                                        
                                        className={`input-date ${columns[3].field}`} 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="column">                                
                            <div className="center">
                                <div>
                                    <label>{`${columns[4].header}`}<span className={`req-ast`}></span></label>
                                </div>                            
                                <div>
                                <ToggleButton
                                    id={columns[4].field}
                                    checked={record[columns[4].field]} 
                                    onChange={(e) => onToggleChange(e)}
                                    style={{width: '30%'}}
                                />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${COMMIT_SOURCE}-content-editor`}>
                        <label>{`${columns[2].header}`}<span className={`req-ast`}> *</span></label>
                        
                        <AdminEditor 
                            id={`${columns[2].field}`} 
                            editorValue={record[columns[2].field]}
                            onTextChange={((e) => onInputChange(e, `${columns[2].field}`))}
                        />
                    </div>                  
                </div>
            </Dialog>
        </div>
        
    );
  }

  export default UseCases