import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './../../api/dbclient';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import * as fn from './../../shared/fn';
//import * as fmt from './../../shared/formats';
import * as opts from './../../shared/options';

const AdminData = (props) => {

    const RECORD_SOURCE = 'admindata';
    const COMMIT_SOURCE = 'admindata';
    const RECORD_PK = RECORD_SOURCE + 'id';

    const [records, setRecords] = useState(null);
    const [setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const [recordDialog, setRecordDialog] = useState(false);

    const columns = [
        {field: 'dataname', header: 'Setting'},
        {field: 'datavalue', header: 'Value'},
    ];
    
    let emptyRecord = {
        datavalue: '',
    };

    const [record, setRecord] = useState(emptyRecord);

    const dynamicColumns = columns.map((col,i) => {
        return <Column 
            key={col.field} 
            field={col.field}
            className={col.field}
            header={fn.fieldNameToColumnName(col.header)}
            
        />;
    });

    const hideDialog = () => {
        setSubmitted(false);
        setRecordDialog(false);
    }

    const getRecords = async() => {
        const { data } = await supabase
          .from(RECORD_SOURCE)
          .select()
          .order(RECORD_PK, { ascending: true })
          
          setRecords(data);
    }

    const upsertRecord = async(rowKey, datavalue) => {
        const upsertedRec = JSON.parse('{"' 
            + RECORD_PK + '":"' + rowKey + '", "' 
            + columns[1].field + '":"' + datavalue + '"}'
        );
        const { error } = await supabase
            .from(COMMIT_SOURCE)
            .upsert(upsertedRec);

            return error;
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

    const saveRecord = async(e) => {
        if (record[columns[0].field].trim()) {
            let _records = [...records];
            let _record = {...record};
            
            if (_record[RECORD_PK]) {
                const pk = _record[RECORD_PK];
                const newVal = _record[columns[1].field]
                const oldVal = _records.find(x => x[RECORD_PK]===pk)[columns[1].field];
                if(newVal===oldVal) {
                    handleResponse([]);
                    return;
                }                
                const error = await upsertRecord(pk, newVal);       
                handleResponse(_record, error);
            }

            return;
        }
    }
    const onRefreshClick = () => {
        getRecords();
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
                {/* <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} /> */}
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
            </React.Fragment>
        );
    }

    const editRecord = (record) => {
        setRecord({...record});
        setRecordDialog(true);
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
                    <div className={`editable`}>
                        <div className="column">
                            <div className="center">
                                <div>
                                    <label>{`${record[columns[0].field]}`}</label>
                                </div>
                            
                                <div>
                                    <InputText 
                                        id={`${record[columns[1].field]}`} 
                                        value={`${record[columns[1].field]}`} 
                                        onChange={(e) => onInputChange(e, `${columns[1].field}`)} 
                                        required
                                        autoFocus
                                        className={`${columns[1].field}`}
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

  export default AdminData