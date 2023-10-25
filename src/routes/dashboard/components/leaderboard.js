import React, {useEffect, useState, useCallback} from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import * as fn from '../../../shared/fn';
import axios from 'axios';
// import * as cnst from '../../../shared/constants';

const Leaderboard = (props) => {    
    //const [xxx, setXxx] = useState(0);    
    const [data, setData] = useState([]);
    const fetchInterval = 3600000;

    const getLeaderboardData = useCallback(async() => {
        const now = new Date().getTime();
        const item='sak-dblb'
        const itemFetch = item+'-fetch'        
        const store = JSON.parse(sessionStorage.getItem(item));
        const lastFetch = sessionStorage.getItem(itemFetch) ? sessionStorage.getItem(itemFetch) : 0;
        let recs;

        if ((now - parseInt(lastFetch)) > fetchInterval || !store) {
            const resp=await axios(`/.netlify/functions/getLeaderboard`)
                .then(function (response) {                    
                     return response;
            })

            recs=resp.data.data;
            setData(recs);

            sessionStorage.setItem(item, JSON.stringify(recs));
            sessionStorage.setItem(itemFetch, new Date().getTime());
        } else {
            recs=store
        }

        setData(recs);
    }, [])

    useEffect(() => {        
        getLeaderboardData();
    }, [getLeaderboardData]);
    
    const numberTemplate = (rowData) => {
        return <InputNumber value={rowData.sum} readOnly />;
    }

    const getColumnTemplate = (column) => {
        let template;

        switch (column) {
            case "sum":
                template = numberTemplate;
                break;
            default:
        }

        return template
    }

    const columns = [
        // {field: RECORD_PK, header: fn.capitalizeString(RECORD_PK)},
        {field: 'aliasname', header: 'Owner'},
        {field: 'sum', header: 'Messages'},        
    ];

    const dynamicColumns = columns.map((col,i) => {
        return <Column 
            key={col.field} 
            field={col.field} 
            header={fn.fieldNameToColumnName(col.header)}
            body={getColumnTemplate(col.field)}
            className={`${col.field}`}
        />;
    });

    return (
        <div className={`card-container leaderboard`}>
        <div className={`card`}>
            <div className={`lg`}>
                <div className={``}>
                    <div className={`accent network title`}>{'Use Case Leaderboard'}</div>
                    <ScrollPanel className={`items`}>
                        <DataTable 
                            value={data}
                            dataKey= "topicid"
                            rows={10}
                            resizableColumns ={false}                            
                            responsiveLayout="stack" 
                            breakpoint="960px"
                            stripedRows
                        >
                            {dynamicColumns}
                        </DataTable>
                    </ScrollPanel>
                </div>                   
            </div>               
        </div>
    </div>               
    );
  }

  export default Leaderboard