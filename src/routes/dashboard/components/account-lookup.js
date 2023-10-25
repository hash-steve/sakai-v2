import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { MemberstackProtected } from '@memberstack/react';
import * as fn from '../../../shared/fn';
import * as cnst from '../../../shared/constants';
import * as svc from '../../../api/api';

const AccountsLookup = (props) => {
    const [shard1, setShard1] = useState(0);
    const [shard2, setShard2] = useState(0);
    const [shard3, setShard3] = useState(0);

    const [realm1, setRealm1] = useState(0);
    const [realm2, setRealm2] = useState(0);
    const [realm3, setRealm3] = useState(0);
    
    const [accountNum1, setAccountNum1] = useState(1369541);  //1369541
    const [accountNum2, setAccountNum2] = useState(0);
    const [accountNum3, setAccountNum3] = useState(0);
    
    const [loading, setLoading] = useState(false);

    const [accounts1, setAccounts1] = useState([]);
    const [accounts2, setAccounts2] = useState([]);
    const [accounts3, setAccounts3] = useState([]);
    
    const [account1CryptoAllow, setAccount1CryptoAllow] = useState([]);
    const [account2CryptoAllow, setAccount2CryptoAllow] = useState([]);
    const [account3CryptoAllow, setAccount3CryptoAllow] = useState([]);

    const [account1TokenAllow, setAccount1TokenAllow] = useState([]);
    const [account2TokenAllow, setAccount2TokenAllow] = useState([]);
    const [account3TokenAllow, setAccount3TokenAllow] = useState([]);

    const [account1Nft, setAccount1Nft] = useState([]);
    const [account2Nft, setAccount2Nft] = useState([]);
    const [account3Nft, setAccount3Nft] = useState([]);

    const [account1Rewards, setAccount1Rewards] = useState([]);
    const [account2Rewards, setAccount2Rewards] = useState([]);
    const [account3Rewards, setAccount3Rewards] = useState([]);

    const [account1Tokens, setAccount1Tokens] = useState([]);
    const [account2Tokens, setAccount2Tokens] = useState([]);
    const [account3Tokens, setAccount3Tokens] = useState([]);

    const [expandedTransactionRows, setExpandedTransactionRows] = useState(null);
    const [expandedTransferRows, setExpandedTransferRows] = useState(null);
    //const [currentPage, setCurrentPage] = useState(0);
    const isMounted = useRef(false);
    // const [nextLink1, setNextLink1] = useState('');
    // const [prevLink1, setPrevLink1] = useState('');
    // const [nextLink2, setNextLink2] = useState('');
    // const [prevLink2, setPrevLink2] = useState('');
    // const [nextLink3, setNextLink3] = useState('');
    // const [prevLink3, setPrevLink3] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [panelCollapsed, setPanelCollapsed] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);    
    const [accountNumbers, setAccountNumbers] = useState([]);

    // test account: 0.0.1369541
    useEffect(() => {

    });

    useEffect(() => {
        isMounted.current = true;
        sessionStorage.setItem('sak-acct-lookup-sel-tab', activeIndex);        
    });
    window.addEventListener('beforeunload', function (e) {
        clearAccounts();
    });

    // const collapseAll = () => {
    //     setExpandedTransactionRows(null);
    // }
    const allowTransactionExpansion = (rowData) => {
        return rowData.transactions.length > 0;
    };
    const allowTransfersExpansion = (rowData) => {
        return rowData.transfers.length > 0;
    };
    const consensusTemplate = (rowData) => {
        var dt=fn.tsToDate(rowData.consensus_timestamp);
        return dt;
    }
    const createdTemplate = (rowData) => {
        if(!rowData.created_timestamp) return;

        var dt=fn.tsToDate(rowData.created_timestamp);
        return dt;
    }
    const nameToPascalCaseTemplate = (rowData) => {
        if(!rowData.name) return;
        return rowData.name;
    }
    const resultToPascalCaseTemplate = (rowData) => {
        if(!rowData.result) return;
        return rowData.result;
    }
    const balanceToHbarTemplate = (rowData) => {
        if(!rowData.balance || !rowData.balance.balance ) return 0;
        return fn.formatHbar(rowData.balance.balance);
    }
    const transferAmountToHbarTemplate = (rowData) => {
        if(!rowData.amount || !rowData.amount ) return 0;
        return fn.formatHbar(rowData.amount);
    }
    const transactionFeeToHbarTemplate = (rowData) => {
        if(!rowData.charged_tx_fee || !rowData.charged_tx_fee ) return 0;
        return fn.formatHbar(rowData.charged_tx_fee);
    }
    const pendingRewardToHbarTemplate = (rowData) => {
        if(!rowData.pending_reward || !rowData.pending_reward ) return 0;
        return fn.formatHbar(rowData.pending_reward);
    }
    const approvalTemplate = (rowData) => {
        return rowData.is_approval===false ? 'No' : 'Yes'
    }
    const transactionsTemplate = (data) => {
        return (
            <div className="child-table">
                <DataTable 
                    value={data.transactions}                    
                    rowExpansionTemplate={transfersTemplate}
                    expandedRows={expandedTransferRows}
                    onRowToggle={(e) => setExpandedTransferRows(e.data)}
                    paginator 
                    rows={10}
                    rowsPerPageOptions={fn.getRowsPerPage()}
                    paginatorTemplate={fn.getPaginatorTemplate()}
                    >
                    <Column expander={allowTransfersExpansion} style={{ width: '3.1em' }} />
                    <Column field="consensus_timestamp" header="Consensus" body={consensusTemplate} sortable></Column>
                    <Column field="name" header="Type" body={nameToPascalCaseTemplate} sortable></Column>
                    <Column field="charged_tx_fee" header="Transaction Fee" body={transactionFeeToHbarTemplate} sortable></Column>
                    <Column field="node" header="Node" sortable></Column>
                    <Column field="result" header="Result" body={resultToPascalCaseTemplate} sortable></Column>
                    <Column field="transaction_id" header="Transaction Id" sortable></Column>                    
                </DataTable>
            </div>
        );
    }
    const transfersTemplate = (data) => {
        return (
            <div className="child-table">
                <DataTable value={data.transfers}>
                    <Column field="account" header="Account" sortable></Column>
                    <Column field="amount" header="Amount" body={transferAmountToHbarTemplate} sortable></Column>                    
                    <Column field="is_approval" header="Approval" body={approvalTemplate} sortable></Column>
                </DataTable>
            </div>
        );
    }
    const checkShard1 = (e) => {
        setShard1(e.value);
    }
    const checkShard2 = (e) => {
        setShard2(e.value);
    }
    const checkShard3 = (e) => {
        setShard3(e.value);
    }
    const checkRealm1 = (e) => {
        setRealm1(e.value);
    }
    const checkRealm2 = (e) => {
        setShard2(e.value);
    }
    const checkRealm3 = (e) => {
        setShard3(e.value);
    }
    const checkAccountNum1 = (e) => {
        setAccountNum1(e.value);        
    }
    const checkAccountNum2 = (e) => {
        setAccountNum2(e.value);        
    }
    const checkAccountNum3 = (e) => {
        setAccountNum3(e.value);
    }
    const loadAccounts1 = (data) => {
        //setNextLink1(data.links.next ? data.links.next.replace('/api/v1/', '') : null);
        setAccounts1([]);
        setAccounts1(accounts1 => [...accounts1, data]);
    }
    const loadAccounts2 = (data) => {
        //console.log(data.links.next);
        //setNextLink2(data.links.next ? data.links.next.replace('/api/v1/', '') : null);
        setAccounts2([]);
        setAccounts2(accounts2 => [...accounts2, data]);
    }
    const loadAccounts3 = (data) => {
        //console.log(data);

        //setNextLink3(data.links.next ? data.links.next.replace('/api/v1/', '') : null);
        setAccounts3([]);
        setAccounts3(accounts3 => [...accounts3, data]);
    }

    const loadAccount1CryptoAllow = (data) => {
        if(data.allowances.length===0) return;

        setAccount1CryptoAllow([]);
        setAccount1CryptoAllow(account1CryptoAllow => [...account1CryptoAllow, data.allowances]);
    }
    const loadAccount2CryptoAllow = (data) => {        
        if(data.allowances.length===0) return;

        setAccount2CryptoAllow([]);
        setAccount2CryptoAllow(account2CryptoAllow => [...account2CryptoAllow, data.allowances]);
    }
    const loadAccount3CryptoAllow = (data) => {        
        if(data.allowances.length===0) return;

        fn.formatData(data.allowances);
        setAccount3CryptoAllow([]);
        setAccount3CryptoAllow(account3CryptoAllow => [...account3CryptoAllow, data.allowances]);
    }
    const loadAccount1TokenAllow = (data) => {        
        if(data.allowances.length===0) return;
        
        fn.formatData(data.allowances);        
        setAccount1TokenAllow([]);
        setAccount1TokenAllow(account1TokenAllow => [...account1TokenAllow, data.allowances]);
    }
    const loadAccount2TokenAllow = (data) => {        
        if(data.allowances.length===0) return;

        fn.formatData(data.allowances);
        setAccount2CryptoAllow([]);
        setAccount2CryptoAllow(accountsCryptoAllow => [...accountsCryptoAllow, data.allowances]);
    }
    const loadAccount3TokenAllow = (data) => {        
        if(data.allowances.length===0) return;
        
        fn.formatData(data.allowances);        
        setAccount3CryptoAllow([]);
        setAccount3CryptoAllow(account3CryptoAllow => [...account3CryptoAllow, data.allowances]);
    }
    const loadAccount1Nft = (data) => {        
        if(data.nfts.length===0) return;
        
        fn.formatData(data.nfts);
        setAccount1Nft([]);
        setAccount1Nft(account1Nft => [...account1Nft, data.nfts]);
    }
    const loadAccount2Nft = (data) => {        
        if(data.nfts.length===0) return;

        fn.formatData(data.nfts);
        setAccount2Nft([]);
        setAccount2Nft(account2Nft => [...account2Nft, data.nfts]);
    }
    const loadAccount3Nft = (data) => {        
        if(data.nfts.length===0) return;

        fn.formatData(data.nfts);
        setAccount3Nft([]);
        setAccount3Nft(account3Nft => [...account3Nft, data.nfts]);
    }
    const loadAccount1Rewards = (data) => {        
        if(data.rewards.length===0) return;

        fn.formatData(data.rewards);
        setAccount1Rewards([]);
        setAccount1Rewards(account1Rewards => [...account1Rewards, data.rewards]);
    }
    const loadAccount2Rewards = (data) => {        
        if(data.rewards.length===0) return;

        fn.formatData(data.rewards);
        setAccount2Rewards([]);
        setAccount2Rewards(account2Rewards => [...account2Rewards, data.rewards]);
    }
    const loadAccount3Rewards = (data) => {        
        if(data.rewards.length===0) return;

        fn.formatData(data.rewards);
        setAccount3Rewards([]);
        setAccount3Rewards(account3Rewards => [...account3Rewards, data.rewards]);
    }
    const loadAccount1Tokens = (data) => {        
        if(data.tokens.length===0) return;

        fn.formatData(data.tokens);
        setAccount1Tokens([]);
        setAccount1Tokens(account1Tokens => [...account1Tokens, data.tokens]);
    }
    const loadAccount2Tokens = (data) => {        
        if(data.tokens.length===0) return;

        fn.formatData(data.tokens);
        setAccount2Tokens([]);
        setAccount2Tokens(account2Tokens => [...account2Tokens, data.tokens]);
    }
    const loadAccount3Tokens = (data) => {
        if(data.tokens.length===0) return;

        fn.formatData(data.tokens);
        setAccount3Tokens([]);
        setAccount3Tokens(account3Tokens => [...account3Tokens, data.tokens]);
    }    
    // const isFetched= (accountNum) => {
    //     var result = accounts1.filter(obj => {
    //         return obj.account===accountNum
    //     })
    //     var result2 = accounts2.filter(obj => {
    //         return obj.account===accountNum
    //     })
    //     var result3 = accounts3.filter(obj => {
    //         return obj.account===accountNum
    //     })

    //     return result.length > 0 || result2.length > 0 || result3.length > 0;
    // }
    const clearShardRealmAccountNum = () => {
        setShard1(0);
        setShard2(0);
        setShard3(0);
        
        setRealm1(0);
        setRealm2(0);
        setRealm3(0);

        setAccountNum1(0);
        setAccountNum2(0);
        setAccountNum3(0);
    }
    const clearAccountData = () => {
        setAccounts1([]);
        setAccounts2([]);
        setAccounts3([]);

        setAccount1CryptoAllow([]);
        setAccount2CryptoAllow([]);
        setAccount3CryptoAllow([]);

        setAccount1TokenAllow([]);
        setAccount2TokenAllow([]);
        setAccount3TokenAllow([]);

        setAccount1Nft([]);
        setAccount2Nft([]);
        setAccount3Nft([]);

        setAccount1Rewards([]);
        setAccount2Rewards([]);
        setAccount3Rewards([]);

        setAccount1Tokens([]);
        setAccount2Tokens([]);
        setAccount3Tokens([]);
    }
    const clearAccounts = () => {
        clearAccountData();
        clearShardRealmAccountNum();
    }
    const getEndpoint = (accountNumber, x) => {
        if(!x) x = '';
        return 'accounts/'+accountNumber+'/'+x+'?limit=100';
    }
    const getAccountInfo = async () => {
        setLoading(true);
        //clearAccountData();

        let endpt = '';

        setAccountNumbers([]);
        const arr = [];
        var accountNumber;
        
        if(accountNum1 > 0) {   
            accountNumber = fn.concatShardReamAccountNum(shard1, realm1, accountNum1);
            if(!arr.includes(accountNumber)) {
                arr.push(accountNumber);
                
            }
        }        
        if(accountNum2 > 0){
            accountNumber = fn.concatShardReamAccountNum(shard2, realm2, accountNum2);
            if(!arr.includes(accountNumber)) {
                arr.push(accountNumber);
            }
        }
        if(accountNum3 > 0){           
            accountNumber = fn.concatShardReamAccountNum(shard3, realm3, accountNum3);
            if(!arr.includes(accountNumber)) {
                arr.push(accountNumber);
            }
        }

        arr.forEach((item) => {
            setAccountNumbers(accountNumbers => [...accountNumbers, item]);
        });

        
        if(arr[0]) {            // && !isFetched(arr[0])
            try {
                endpt = getEndpoint(arr[0])
                await svc.fetchEndpoint(endpt).then(response => loadAccounts1(response.data)); 
                
                endpt = getEndpoint(arr[0], 'allowances/crypto')
                await svc.fetchEndpoint(endpt).then(response => loadAccount1CryptoAllow(response.data));

                endpt = getEndpoint(arr[0], 'allowances/tokens')
                await svc.fetchEndpoint(endpt).then(response => loadAccount1TokenAllow(response.data));
                
                endpt = getEndpoint(arr[0], 'nfts')
                await svc.fetchEndpoint(endpt).then(response => loadAccount1Nft(response.data));
                
                endpt = getEndpoint(arr[0], 'rewards')
                await svc.fetchEndpoint(endpt).then(response => loadAccount1Rewards(response.data));

                endpt = getEndpoint(arr[0], 'tokens')
                await svc.fetchEndpoint(endpt).then(response => loadAccount1Tokens(response.data));

            } catch(ex) {
                setLoading(false);
            }
        }
        
        if(arr[1]) {                                  // && !isFetched(arr[1])
            try {
                endpt = getEndpoint(arr[1])
                await svc.fetchEndpoint(endpt).then(response => loadAccounts2(response.data)); 
                
                endpt = getEndpoint(arr[1], 'allowances/crypto')
                await svc.fetchEndpoint(endpt).then(response => loadAccount2CryptoAllow(response.data));

                endpt = getEndpoint(arr[1], 'allowances/tokens')
                await svc.fetchEndpoint(endpt).then(response => loadAccount2TokenAllow(response.data));
                
                endpt = getEndpoint(arr[1], 'nfts')
                await svc.fetchEndpoint(endpt).then(response => loadAccount2Nft(response.data));
                
                endpt = getEndpoint(arr[1], 'rewards')
                await svc.fetchEndpoint(endpt).then(response => loadAccount2Rewards(response.data));

                endpt = getEndpoint(arr[1], 'tokens')
                await svc.fetchEndpoint(endpt).then(response => loadAccount2Tokens(response.data));
            
            } catch(ex) {
                setLoading(false);
            }
        }

        if(arr[2]) {                                // && !isFetched(arr[2])
            try {
                endpt = getEndpoint(arr[2])
                await svc.fetchEndpoint(endpt).then(response => loadAccounts3(response.data));

                endpt = getEndpoint(arr[2], 'allowances/crypto')
                await svc.fetchEndpoint(endpt).then(response => loadAccount3CryptoAllow(response.data));

                endpt = getEndpoint(arr[2], 'allowances/tokens')
                await svc.fetchEndpoint(endpt).then(response => loadAccount3TokenAllow(response.data));
                
                endpt = getEndpoint(arr[2], 'nfts')
                await svc.fetchEndpoint(endpt).then(response => loadAccount3Nft(response.data));
                
                endpt = getEndpoint(arr[2], 'rewards')
                await svc.fetchEndpoint(endpt).then(response => loadAccount3Rewards(response.data));

                endpt = getEndpoint(arr[2], 'tokens')
                await svc.fetchEndpoint(endpt).then(response => loadAccount3Tokens(response.data));
            
            } catch(ex) {
                setLoading(false);
            }
        }

        setLoading(false);
    }

    const handleButtonClick = (e) => {
        setShowDialog(true)
        setActiveIndex(1);
        //clearAccounts();
    }
      
    const handleDialogClose = (e) => { 
        setShowDialog(false);
        clearAccounts();
    }
    
    const allowanceColumns = [
        {field: 'amount_granted', header: 'amount_granted'},
        {field: 'owner', header: 'owner'},
        {field: 'spender', header: 'spender'},
        {field: 'timestamp.from', header: 'timestamp.from'},
        {field: 'timestamp.to', header: 'timestamp.to'}
    ];

    const allowancesColumns = allowanceColumns.map((col,i) => {
        return <Column key={col.field} field={col.field} header={fn.fieldNameToColumnName(col.header)} />;
    });

    const nftColumns = [
        {field: 'account_id', header: 'account_id'},
        {field: 'created_timestamp', header: 'created_timestamp'},
        {field: 'delegating_spender', header: 'delegating_spender'},
        {field: 'deleted', header: 'deleted'},
        //{field: 'metadata', header: 'metadata'},
        {field: 'modified_timestamp', header: 'modified_timestamp'},
        {field: 'spender_id', header: 'spender_id'},
        {field: 'token_id', header: 'token_id'}
    ];

    const nftsColumns = nftColumns.map((col,i) => {
        return <Column 
                    key={col.field} 
                    field={col.field} 
                    header={fn.fieldNameToColumnName(col.header)} 
               />;
    });

    const rewardColumns = [
        {field: 'account_id', header: 'account_id'},
        {field: 'amount', header: 'amount'},
        {field: 'timestamp', header: 'timestamp'}
    ];

    const rewardsColumns = rewardColumns.map((col,i) => {
        return <Column key={col.field} field={col.field} header={fn.fieldNameToColumnName(col.header)} />;
    });

    const tokenColumns = [
        {field: 'automatic_association', header: 'automatic_association'},
        {field: 'balance', header: 'balance'},
        {field: 'created_timestamp', header: 'created_timestamp'},
        {field: 'freeze_status', header: 'freeze_status'},
        {field: 'kyc_status', header: 'kyc_status'},
        {field: 'token_id', header: 'token_id'}
    ];

    const tokensColumns = tokenColumns.map((col,i) => {
        return <Column 
            key={col.field} 
            field={col.field} 
            header={fn.fieldNameToColumnName(col.header)} 
        />;
    });

    const handleTabChange = (tabIndex) => {
        //sessionStorage.setItem('sak-acct-lookup-sel-tab', tabIndex);
        setActiveIndex(tabIndex);
    }
    return (
        <div className={`card-container`}>
            <div className={`card`}>
                <div className={`sm`}>
                    <div className={`text-align-center`}>  
                        <div className={``} style={{padding: '11.5px 0'}}>
                            <Button 
                                label="Account Lookup"
                                className="sak-button sak-button-xxlg"
                                onClick={handleButtonClick}                   
                            />            

                            <Dialog
                                visible={showDialog}
                                className={`account-lookup`}
                                header="Account Lookup"
                                footer={<></>}
                                showHeader={true}
                                draggable
                                minY={1}
                                position="center"
                                onHide={handleDialogClose}
                                style={{width:'auto', height: 'auto'}}
                            >
                                <div className={`col-12 xl:col-12 mt-4`}>                    
                                    <Panel 
                                        header={<></>} 
                                        toggleable 
                                        collapsed={panelCollapsed} 
                                        onToggle={(e) => setPanelCollapsed(e.value)}>
                                        <div className={`mw-100-pct`}>
                                            <div className={`mw-100-pct nowrap`}>
                                                <span className="">
                                                <InputNumber 
                                                    id="shard1" 
                                                    className={`bigint shard`} 
                                                    format={false} 
                                                    size={10}
                                                    min={0}                                
                                                    maxFractionDigits={0}
                                                    allowEmpty={false}
                                                    required={true}
                                                    placeholder="0"
                                                    value={shard1}
                                                    onChange={(e) => checkShard1(e)}
                                                />
                                                <span className={`account-delim`}> . </span>
                                                
                                                <InputNumber 
                                                    id="realm1" 
                                                    className={`bigint realm`} 
                                                    format={false}
                                                    size={10}
                                                    min={0}                                
                                                    maxFractionDigits={0}
                                                    allowEmpty={false}
                                                    required={true}
                                                    placeholder="0"
                                                    value={realm1}
                                                    onChange={(e) => checkRealm1(e)}
                                                />
                                                <span className={`account-delim`}> . </span>
                                                
                                                <InputNumber 
                                                    id="accountnum1" 
                                                    className={`bigint accountnum`} 
                                                    format={false}
                                                    size={10}
                                                    min={0}                                
                                                    maxFractionDigits={0}
                                                    allowEmpty={false}
                                                    required={true}
                                                    placeholder={0}
                                                    autoFocus={false}
                                                    value={accountNum1}
                                                    onChange={(e) => checkAccountNum1(e)}
                                                />                        
                                            </span>
                                        </div>
                                        <MemberstackProtected
                                            allow={{
                                                permissions:fn.getFullAccessPermissions()
                                            }}>
                                            <div className={`mw-100-pct nowrap`}>
                                                <span className="">
                                                    <InputNumber 
                                                        id="shard2" 
                                                        className={`bigint shard`} 
                                                        format={false} 
                                                        size={10}
                                                        min={0}                                    
                                                        maxFractionDigits={0}
                                                        allowEmpty={true}
                                                        required={false}
                                                        placeholder="0"
                                                        value={shard2}
                                                        onChange={(e) => checkShard2(e)}
                                                    />
                                                    <span className={`account-delim`}> . </span>
                                                    
                                                    <InputNumber 
                                                        id="realm2" 
                                                        className={`bigint realm`} 
                                                        format={false}
                                                        size={10}
                                                        min={0}                                    
                                                        maxFractionDigits={0}
                                                        allowEmpty={true}
                                                        required={false}
                                                        placeholder="0"
                                                        value={shard2}
                                                        onChange={(e) => checkRealm2(e)}
                                                    />
                                                    <span className={`account-delim`}> . </span>
                                                    
                                                    <InputNumber 
                                                        id="accountnum2" 
                                                        className={`bigint accountnum`} 
                                                        format={false}
                                                        size={10}
                                                        min={0}                                    
                                                        maxFractionDigits={0}
                                                        allowEmpty={true}
                                                        required={true}
                                                        placeholder={0}
                                                        autoFocus={false}
                                                        value={accountNum2}
                                                        onChange={(e) => checkAccountNum2(e)}
                                                    />                        
                                                </span>
                                            </div>
                                            <div className={`mw-100-pct nowrap`}>
                                                <span className="">
                                                    <InputNumber 
                                                        id="shard3" 
                                                        className={`bigint shard`} 
                                                        format={false} 
                                                        size={10}
                                                        min={0}                                    
                                                        maxFractionDigits={0}
                                                        allowEmpty={true}
                                                        required={false}                                
                                                        placeholder="0"
                                                        value={shard3}
                                                        onChange={(e) => checkShard3(e)}
                                                    />
                                                    <span className={`account-delim`}> . </span>
                                                    
                                                    <InputNumber 
                                                        id="realm3" 
                                                        className={`bigint realm`} 
                                                        format={false}
                                                        size={10}
                                                        min={0}                                    
                                                        maxFractionDigits={0}
                                                        allowEmpty={true}
                                                        required={false}
                                                        placeholder="0"
                                                        value={realm3}
                                                        onChange={(e) => checkRealm3(e)}
                                                    />
                                                    <span className={`account-delim`}> . </span>
                                                    
                                                    <InputNumber 
                                                        id="accountnum3" 
                                                        className={`bigint accountnum`} 
                                                        format={false}
                                                        size={10}
                                                        min={0}
                                                        
                                                        maxFractionDigits={0}
                                                        allowEmpty={true}
                                                        required={true}
                                                        placeholder={0}
                                                        autoFocus={false}
                                                        value={accountNum3}
                                                        onChange={(e) => checkAccountNum3(e)}
                                                    />                        
                                                </span>                   
                                            </div>
                                        </MemberstackProtected>
                                        <div className={`mw-100-pct`}>
                                            <Button 
                                                label = "Lookup" 
                                                className={`sak-button sak-button-sm mt-2 ml-2`}
                                                onClick={(e) => getAccountInfo(e)}
                                            />
                                            <Button 
                                                label = "Clear" 
                                                className={`sak-button sak-button-sm mt-2 ml-2`}
                                                onClick={(e) => clearAccounts(e)}
                                            />
                                        </div>
                                        </div>
                                    </Panel>

                                    <TabView
                                        activeIndex={activeIndex}
                                        onTabChange={(e) => handleTabChange(e.index)}
                                        className={`${accounts1.length > 0 || 
                                            accounts2.length > 0 || 
                                            accounts3.length > 0 ? '' : 'hidden'}`
                                        }
                                    >
                                        <TabPanel 
                                            header="Transactions"
                                        >
                                            <Panel
                                                header={`Account Id: ${accountNumbers[0]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[0]  ? '' : 'hidden'}`}                               
                                                style={{width: '100%'}}
                                            >
                                                <DataTable 
                                                    value={accounts1}
                                                    expandedRows={expandedTransactionRows} 
                                                    onRowToggle={(e) => setExpandedTransactionRows(e.data)}                                
                                                    rowExpansionTemplate={transactionsTemplate} 
                                                    dataKey="key.key"
                                                    stripedRows 
                                                    resizableColumns 
                                                    columnResizeMode="fit"
                                                    selectionMode="single"
                                                    loading={loading}
                                                    className={`${accountNumbers[0]  ? '' : 'hidden'}`}
                                                >
                                                    <Column expander={allowTransactionExpansion} style={{ width: '3.1em' }} />
                                                    <Column field="account" header="Account" sortable />
                                                    <Column field="alias" header="Alias"  sortable/>
                                                    <Column field="created_timestamp" header="Created" body={createdTemplate} sortable />
                                                    <Column field="balance.balance" header="Balance" body={balanceToHbarTemplate} sortable />
                                                    <Column field="pending_reward" header="Pending Reward" body={pendingRewardToHbarTemplate} sortable />
                                                </DataTable>                               
                                            </Panel>

                                            <Panel
                                                header={`Account Id: ${accountNumbers[1]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[1]  ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                            >
                                                <DataTable 
                                                    value={accounts2}
                                                    expandedRows={expandedTransactionRows} 
                                                    onRowToggle={(e) => setExpandedTransactionRows(e.data)}                   
                                                    rowExpansionTemplate={transactionsTemplate} 
                                                    dataKey="key.key"                                    
                                                    stripedRows 
                                                    resizableColumns 
                                                    columnResizeMode="fit"
                                                    loading={loading}
                                                    className={``}
                                                >
                                                    <Column expander={allowTransactionExpansion} style={{ width: '3.1em' }} />
                                                    <Column field="account" header="Account" sortable />
                                                    <Column field="alias" header="Alias"  sortable/>
                                                    <Column field="created_timestamp" header="Created" body={createdTemplate} sortable />
                                                    <Column field="balance.balance" header="Balance" body={balanceToHbarTemplate} sortable />
                                                    <Column field="pending_reward" header="Pending Reward" body={pendingRewardToHbarTemplate} sortable />
                                                </DataTable>
                                            </Panel>
                                            
                                            <Panel
                                                header={`Account Id: ${accountNumbers[2]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[2] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                            >
                                                <DataTable 
                                                    value={accounts3}
                                                    expandedRows={expandedTransactionRows} 
                                                    onRowToggle={(e) => setExpandedTransactionRows(e.data)}                                
                                                    rowExpansionTemplate={transactionsTemplate} 
                                                    dataKey="key.key"
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    className={``}
                                                >
                                                    <Column expander={allowTransactionExpansion} style={{ width: '3.1em' }} />
                                                    <Column field="account" header="Account" sortable />
                                                    <Column field="alias" header="Alias"  sortable/>
                                                    <Column field="created_timestamp" header="Created" body={createdTemplate} sortable />
                                                    <Column field="balance.balance" header="Balance" body={balanceToHbarTemplate} sortable />
                                                    <Column field="pending_reward" header="Pending Reward" body={pendingRewardToHbarTemplate} sortable />
                                                </DataTable>
                                            </Panel>
                                        </TabPanel>
                                        
                                        {/* //Crypto Allowances */}
                                        <TabPanel
                                            header="Crypto Allowances"
                                        >
                                            <Panel
                                                header={`Account Id: ${accountNumbers[0]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[0] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account1CryptoAllow[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={`${accountNumbers[0] ? '' : 'hidden'}`}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator 
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {allowancesColumns}
                                                </DataTable>
                                            </Panel>
                                            
                                            <Panel
                                                header={`Account Id: ${accountNumbers[1]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[1] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account2CryptoAllow[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator 
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {allowancesColumns}
                                                </DataTable>
                                            </Panel>
                                            
                                            <Panel
                                                header={`Account Id: ${accountNumbers[2]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[2] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account3CryptoAllow[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator 
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {allowancesColumns}
                                                </DataTable>
                                            </Panel>
                                        </TabPanel>

                                        {/* //Token Allowances */}
                                        <TabPanel
                                            header="Token Allowances"
                                        >
                                            <Panel
                                                header={`Account Id: ${accountNumbers[0]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[0] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account1TokenAllow[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    paginator
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                        
                                                    {allowancesColumns}
                                                </DataTable>
                                            </Panel>
                                            
                                            <Panel
                                                header={`Account Id: ${accountNumbers[1]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[1] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account2TokenAllow[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    paginator
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {allowancesColumns}
                                                </DataTable>
                                            </Panel>
                                            
                                            <Panel
                                                header={`Account Id: ${accountNumbers[2]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[2] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account3TokenAllow[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator 
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {allowancesColumns}
                                                </DataTable>
                                            </Panel>
                                        </TabPanel>

                                        {/* //NFTs */}
                                        <TabPanel
                                            header="NFTs"
                                        >
                                            <Panel
                                                header={`Account Id: ${accountNumbers[0]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[0] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account1Nft[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator  
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {nftsColumns}
                                                </DataTable>
                                            </Panel>                            
                                            <Panel
                                                header={`Account Id: ${accountNumbers[1]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[1] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account2Nft[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator  
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {nftsColumns}
                                                </DataTable>
                                            </Panel>                            
                                            <Panel
                                                header={`Account Id: ${accountNumbers[2]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[2] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account3Nft[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator  
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {nftsColumns}
                                                </DataTable>
                                            </Panel>                            
                                        </TabPanel>
                                        
                                        {/* //Rewards */}
                                        <TabPanel
                                            header="Rewards"
                                        >
                                            <Panel
                                                header={`Account Id: ${accountNumbers[0]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[0] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account1Rewards[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator  
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {rewardsColumns}
                                                </DataTable>
                                            </Panel>                            
                                            <Panel
                                                header={`Account Id: ${accountNumbers[1]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[1] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account2Rewards[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator  
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {rewardsColumns}
                                                </DataTable>
                                            </Panel>                            
                                            <Panel
                                                header={`Account Id: ${accountNumbers[2]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[2] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account3Rewards[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator  
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {rewardsColumns}
                                                </DataTable>
                                            </Panel>                            
                                        </TabPanel>

                                        {/* //Tokens */}
                                        <TabPanel
                                            header="Tokens"
                                        >
                                            <Panel
                                                header={`Account Id: ${accountNumbers[0]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[0] ? '' : 'hidden'}`}
                                                style={{width: '100%'}}
                                                >
                                                <DataTable 
                                                    value={account1Tokens[0]}
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator  
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {tokensColumns}
                                                </DataTable>
                                            </Panel>
                                            <Panel
                                                header={`Account Id: ${accountNumbers[1]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[1] ? '' : 'hidden'}`}                                
                                                >
                                                <DataTable 
                                                    value={account2Tokens[0]}                                    
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator  
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {tokensColumns}
                                                </DataTable>
                                            </Panel>
                                            <Panel
                                                header={`Account Id: ${accountNumbers[2]}`}
                                                toggleable
                                                className={`col-12 xl:col-12 ${accountNumbers[2] ? '' : 'hidden'}`}
                                                >
                                                <DataTable 
                                                    value={account3Tokens[0]}                  
                                                    emptyMessage={cnst.LBL_NO_RECORDS_MESSAGE}
                                                    className={``}
                                                    stripedRows resizableColumns columnResizeMode="fit"
                                                    loading={loading}
                                                    paginator  
                                                    rows={10}
                                                    rowsPerPageOptions={fn.getRowsPerPage()}
                                                    paginatorTemplate={fn.getPaginatorTemplate()}
                                                    >
                                                    {tokensColumns}
                                                </DataTable>
                                            </Panel>                            
                                        </TabPanel>
                                    </TabView>
                                </div>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  export default AccountsLookup