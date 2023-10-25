import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
//import * as api from './../../api/api';
//import * as fn from './../../shared/fn';
import { supabase } from '../../api/dbclient';

const AccountGroups = (props) => {
    const [accounts, setAccounts] = useState(JSON.parse(sessionStorage.getItem('accountgroups')) ?? []);
    const [expandedRows, setExpandedRows] = useState([]);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'owner.name', order: 1 }]);
    
    const getAccountGroups = async () => {
        const { data } = await supabase
            .from('accountgroups')
            .select()
            .order('accountgroupname', { ascending: true })
            .order('accountnum', { ascending: true });
        
            //console.log(data)
            setAccounts(data);
            sessionStorage.setItem('accountgroups', JSON.stringify(data));
    }

    useEffect(() => {   
        if(accounts.length > 0) return;
        getAccountGroups();
    });
   
    const calcGroupCount = (name) => {
        let total = 0;

        if (accounts) {
            for (let account of accounts) {
                if (account.accountgroupname===name) {
                    total++;
                }
            }
        }

        return total;
    }

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <span className={`rowgroup-head-name`}>{data.accountgroupname}</span>
                <span className={`rowgroup-head-count`}>{`Count:`} {calcGroupCount(data.accountgroupname)}</span>
            </React.Fragment>
        );
    }

    return (
            <div className="">
                <DataTable
                    id="AccountGroups"
                    dataKey="accountgroupid"                    value={accounts} 
                    rowGroupMode="subheader" 
                    groupRowsBy="accountgroupname"
                    sortMode="multiple" 
                    sortField="accountgroupname" 
                    sortOrder={1} 
                    responsiveLayout="scroll"
                    expandableRowGroups 
                    expandedRows={expandedRows} 
                    onRowToggle={(e) => setExpandedRows(e.data)}                    
                    rowGroupHeaderTemplate={headerTemplate}
                    multiSortMeta={multiSortMeta} 
                    onSort={(e) => setMultiSortMeta(e.multiSortMeta)}
                >
                    <Column field="accountnum" header="Account Id"></Column>                    
                </DataTable>
            </div>
    );
  }

  export default AccountGroups