import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './../../api/dbclient';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import AdminEditor from './editor';
import * as fn from './../../shared/fn';
//import * as fmt from './../../shared/formats';
import * as opts from './../../shared/options';

const Nodes = (props) => {

    const RECORD_SOURCE = 'nodes';
    const COMMIT_SOURCE = 'node';
    const RECORD_PK = COMMIT_SOURCE + 'id';

    const [records, setRecords] = useState(null);
    const [setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const [recordDialog, setRecordDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    const columns = [
        {field: RECORD_PK, header: "Node Id"},
        {field: 'owner', header: 'Owner'},
        {field: 'hq', header: 'Hq'},        
        {field: 'geolocation', header: 'Location'},
        {field: 'sector', header: 'Sector'},
        {field: 'coordinates', header: 'Coordinates (long, lat)'},
        {field: 'datejoined', header: 'Date Joined'},
        {field: 'dateleft', header: 'Date Left'},        
        {field: 'logo', header: 'logo'},
        {field: 'bio', header: 'Bio'},
    ];
    
    let emptyRecord = {
        nodeid: null,
        owner: '',
        hq: '',
        geolocation: '',
        sector: '',
        coordinates: '',
        datejoined: fn.getUtcCalendarDate(),
        dateleft: '',
        logo: '',
        bio: ''
    };

    const [record, setRecord] = useState(emptyRecord);

    const dateLeftTemplate = (rowData) => {
        const dt = rowData.dateleft ? fn.dateToLocalDate(rowData.dateleft) : '';
        return <span className={``}>{dt}</span>;
    }

    const dateJoinedTemplate = (rowData) => {
        const dt = rowData.datejoined ? fn.dateToLocalDate(rowData.datejoined) : '';
        return <span className={``}>{dt}</span>;
    }

    const activeTemplate = (rowData) => {
        return <i className={classNames('pi', {'true-icon pi-check-circle': rowData.active, 'false-icon pi-times-circle': !rowData.active})}></i>;
    }

    const getColumnTemplate = (column) => {
        let template;

        switch (column) {
            case "datejoined":
                template = dateJoinedTemplate;
                break;
            case "dateleft":
                template = dateLeftTemplate;
                break;
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
                content:  rec[columns[1].field],
                datecreated:  rec[columns[2].field],
                //datepublished:  rec[columns[3].field],
                active:  rec[columns[3].field]
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
                    content:  rec[columns[1].field],
                    datecreated:  rec[columns[2].field],
                    //datepublished:  rec[columns[3].field],
                    active:  rec[columns[3].field] 
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

    const onEditorChange = (e, name) => {
        //console.log(name);
        let _record = {...record};
        _record[`${name}`] = e.htmlValue;

        setRecord(_record);
    }

    const onInputChange = (e, name) => {
        //console.log(name);
        const val = (e.target && e.target.value) || '';
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
                footer={recordDialogFooter} 
                onHide={hideDialog}
                resizable
                className={`p-fluid dialog-${RECORD_SOURCE}`}               
            >
                <div className="admin form" style={{ height: '610px' }} >
                    <div className="node center">
                        <div className={`columns`}>
                            <div className="column">
                                <div className="center">
                                    <div>
                                        <label>Node Id:<span className={`req-ast`}> *</span></label>
                                    </div>
                                
                                    <div>
                                        <InputNumber 
                                            id="nodeid" 
                                            value={record.nodeid} 
                                            onChange={(e) => onInputChange(e, 'nodeid')} 
                                            required 
                                            autoFocus 
                                            className={`nodeid`} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="center">
                                    <div>
                                        <label>Member:<span className={`req-ast`}> *</span></label>
                                    </div>
                                
                                    <div>
                                        <InputText 
                                            id="owner" 
                                            value={record.owner} 
                                            onChange={(e) => onInputChange(e, 'owner')} 
                                            required                                     
                                            className={`owner`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="center">
                                    <div>
                                        <label>HQ:<span className={`req-ast`}> *</span></label>
                                    </div>
                                
                                    <div>
                                        <InputText 
                                            id="hq" 
                                            value={record.hq} 
                                            onChange={(e) => onInputChange(e, 'hq')} 
                                            required                         
                                            className={`hq`} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="center">
                                    <div>
                                        <label>Location:<span className={`req-ast`}> *</span></label>
                                    </div>
                                
                                    <div>
                                        <InputText 
                                            id="geolocation" 
                                            value={record.geolocation} 
                                            onChange={(e) => onInputChange(e, 'geolocation')} 
                                            required                         
                                            className={`geolocation`} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="center">
                                    <div>
                                        <label>Sector:<span className={`req-ast`}> *</span></label>
                                    </div>
                                
                                    <div>
                                        <InputText 
                                            id="sector" 
                                            value={record.sector} 
                                            onChange={(e) => onInputChange(e, 'sector')} 
                                            required                         
                                            className={`sector`} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{width: '20px'}}>&nbsp;</div>
                        <div className={`columns`}>
                            <div className="column">
                                <div className="center">
                                    <div>
                                        <label>Coordinates (long,lat):<span className={`req-ast`}> *</span></label>
                                    </div>
                                
                                    <div>
                                        <InputText 
                                            id="coordinates" 
                                            value={record.coordinates} 
                                            onChange={(e) => onInputChange(e, 'coordinates')} 
                                            required                         
                                            className={`coordinates`} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="center">
                                    <div>
                                        <label>Date Joined:<span className={`req-ast`}> *</span></label>
                                    </div>
                                
                                    <div>
                                        <Calendar 
                                            id="dateJoined" 
                                            value={new Date(record.datejoined)}
                                            onChange={(e) => onInputChange(e.value)}
                                            required
                                            showIcon                       
                                            className={`date-joined calendar`} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="center">
                                    <div>
                                        <label>Date Left:<span className={`req-ast`}></span></label>
                                    </div>
                                
                                    <div>
                                        <Calendar 
                                            id="dateLeft" 
                                            value={new Date(record.dateleft)}
                                            onChange={(e) => onInputChange(e.value)}                                    
                                            showIcon                       
                                            className={`date-left calendar`} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="center">
                                    <div>
                                        <label>Logo:<span className={`req-ast`}> *</span></label>
                                    </div>
                                
                                    <div>
                                        <InputText 
                                            id="logo" 
                                            value={record.logo} 
                                            onChange={(e) => onInputChange(e, 'logo')} 
                                            className={`logo`} 
                                        />
                                    </div>
                                </div>
                            </div>                            
                        </div>
                    </div> 
                    <div className={`${COMMIT_SOURCE}-content-editor`}>
                        <label>{`${columns[9].header}`}<span className={`req-ast`}> *</span></label>
                        
                        <AdminEditor 
                            id={`${columns[9].field}`} 
                            editorValue={record[columns[9].field]}
                            onTextChange={((e) => onEditorChange(e, `${columns[9].field}`))}
                        />
                    </div>                  
                </div>
            </Dialog>
        </div>
        
    );
  }

  export default Nodes