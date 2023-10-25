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
import * as fn from './../../shared/fn';
//import * as fmt from './../../shared/formats';
import * as opts from './../../shared/options';

const EntityAlias = (props) => {

    const RECORD_SOURCE = 'entityaliases';
    const COMMIT_SOURCE = 'entityalias';
    const RECORD_PK = 'entityaliasid';

    const [records, setRecords] = useState(null);
    const [setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const [recordDialog, setRecordDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    const columns = [
        // {field: RECORD_PK, header: fn.capitalizeString(RECORD_PK)},
        {field: 'aliasname', header: 'Alias'},
        {field: 'shard', header: 'Shard'},
        {field: 'realm', header: 'Realm'},
        {field: 'num', header: 'Num'},
    ];
    
    let emptyRecord = {
        aliasname: '',
        shard: '',
        realm: '',
        num: '',
    };

    const [record, setRecord] = useState(emptyRecord);

    const accept = () => {
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: opts.TOAST_LIFE });
    }

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: opts.TOAST_LIFE });
    }

    const dynamicColumns = columns.map((col,i) => {
        return <Column 
            key={col.field} 
            field={col.field}
            className={col.field}
            header={fn.fieldNameToColumnName(col.header)}
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

    // const hidedeleteDialog = () => {
    //     setDeleteDialog(false);
    // }

    const getRecords = async() => {
        const { data } = await supabase
          .from(RECORD_SOURCE)
          .select()
          .order(RECORD_PK, { ascending: true })
          
          setRecords(data);
    }

    useEffect(() => {
        getRecords();
    });

    const handleResponse = (rec, err) => {
        if(err) {
            toast.current.show({ severity: 'error', summary: `Error: ${err.code}`, detail: `${err.message}`, life: opts.TOAST_LIFE });
        } else {
            setRecord(rec);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record updated', life: opts.TOAST_LIFE });
        }
        
        setRecordDialog(false);
        setRecord(emptyRecord);
        setSubmitted(true);
    }

    const upsertRecord = async(rowKey, aliasname, shard, realm, num) => {
        const upsertedRec = JSON.parse('{"' 
            + RECORD_PK + '":"' + rowKey + '", "' 
            + columns[0].field + '":"' + aliasname  + '", "'
            + columns[1].field + '":"' + shard  + '", "'
            + columns[2].field + '":"' + realm  + '", "'
            + columns[3].field + '":"' + num  + '", "'
            + '"}'
        );

        await supabase
            .from(COMMIT_SOURCE)
            .upsert(upsertedRec)
            .select();
    }

    const saveRecord = async(e) => {
        if (record[columns[0].field].trim()) {
            let _records = [...records];
            let _record = {...record};
            let pk;
            if (_record[RECORD_PK]) {       //update
                pk = _record[RECORD_PK];
                const newVal = _record[columns[1].field]
                const oldVal = _records.find(x => x[RECORD_PK]===pk)[columns[1].field];
                if(newVal===oldVal) {
                    handleResponse([]);
                    return;
                }                
                const error = await upsertRecord(pk, newVal);       
                handleResponse(_record, error);
            }
            else {  //insert
                const error = await upsertRecord(pk, null, _record);       
                handleResponse(_record, error);
            }

            setRecords(_records);
            setRecordDialog(false);
            setRecord(emptyRecord);
            setSubmitted(true);
        }
    }
    const onRefreshClick = () => {
        getRecords();
    }
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _record = {...record};
        _record[`${name}`] = val;

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

    // const deleteRecord = () => {
    //     let _records = records.filter(val => val.id !== record[RECORD_PK]);
    //     setRecords(_records);
    //     setDeleteDialog(false);
    //     setRecord(emptyRecord);
    //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
    // }

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
            
            <ConfirmDialog visible={deleteDialog} onHide={() => setDeleteDialog(false)} 
                message={`Confirm delete ${record[columns[0].field]}`}
                header={`Confirm delete`}
                icon="pi pi-exclamation-triangle" 
                accept={accept} 
                reject={reject}
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
                rowsPerPageOptions={[10,25,50, 9999]}
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
                    <div className={`entity-alias`}>
                        <div className="column">
                            <div className="center">
                                <div>
                                    <label>Alias: <span className={`req-ast`}>*</span></label>
                                </div>
                            
                                <div>
                                    <InputText 
                                        id={`${record[columns[0].field]}`} 
                                        value={record.aliasname} 
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
                                    <label>Shard:<span className={`req-ast`}></span></label>
                                </div>
                            
                                <div>
                                    <InputNumber  
                                        id="Shard" 
                                        value={record.shard} 
                                        onValueChange={(e) => onInputNumberChange(e, `${columns[1].field}`)}
                                        required
                                        useGrouping={false}                                        
                                        className={`${columns[1].field}`}
                                    />
                                </div>
                            </div>
                        </div>
                            
                        <div className="column">                                
                            <div className="center">
                                <div>
                                    <label>Realm:<span className={`req-ast`}></span></label>
                                </div>
                            
                                <div>
                                    <InputNumber  
                                        id="Realm" 
                                        value={record[columns[2].field.toString()]} 
                                        onValueChange={(e) => onInputNumberChange(e, `${columns[2].field}`)}
                                        required
                                        useGrouping={false}
                                        className={`${columns[2].field}`}
                                    />
                                </div>
                            </div>
                        </div>

                        
                        <div className="column">                                
                            <div className="center">
                                <div>
                                    <label>Num:<span className={`req-ast`}></span></label>
                                </div>                            
                                <div>
                                    <InputNumber 
                                        id="Num" 
                                        value={record[columns[3].field.toString()]} 
                                        onValueChange={(e) => onInputNumberChange(e, `${columns[3].field}`)}
                                        required
                                        useGrouping={false}
                                        className={`${columns[3].field}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>                  
                </div>
            </Dialog>
        </div>        
    );
  }

  export default EntityAlias