
import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import * as fn from './../../../shared/fn';
//import * as api from './../../../api/api';
import axios from 'axios';

const Matrix = () => {
    const[matrix, setMatrix] = useState([])
    //const[data, setData] = useState();
    
    const fetchInterval = 86400000;    
    const sectorsArr = [];

    useEffect(() => {
        const getNodes = async() => {
            const now = new Date().getTime();
            const item='sak-nodes'
            const itemFetch = item+'-fetch'
            const store = JSON.parse(sessionStorage.getItem(item));
            const lastFetch = sessionStorage.getItem(itemFetch) ? sessionStorage.getItem(itemFetch) : 0;
            let data;

            if((now - parseInt(lastFetch)) > fetchInterval || !store) {
                const resp=await axios(`/.netlify/functions/getNodes`)
                    .then(function (response) {                    
                        return response;
                })
                
                data = resp.data.data;
                sessionStorage.setItem(item, JSON.stringify(data));
                sessionStorage.setItem(itemFetch, new Date().getTime());
            } else {
                data=store;
            }
    
            const grouped = _.groupBy(data, ({ geolocation, sector }) => JSON.stringify({ geolocation, sector }));
            
            var rowData = [];      
            for (const [key, value] of Object.entries(grouped)) {
                let str = '';
                value.forEach((val) => str += val.owner +', ');
                rowData.push([JSON.parse(key)['geolocation'], JSON.parse(key)["sector"], str])
            }
            
            const sortedArray = fn.sortArray(rowData);
            var output = pivotArray(sortedArray, 0, 1, 2);
            
            setMatrix(output);
        }
    
        getNodes();
    },[]);

    
    function sumVerticalsArray() {
        sectorsArr.forEach(array => array.splice(0,1));
        const totals = [];        
        var vertLength = sectorsArr.length;
        var horizLength = sectorsArr[0].length;
        
        for(var h=0; h < horizLength; h++) {
            var val = 0;
            for(var v=0; v < vertLength; v++) {
                val += sectorsArr[v][h];
            }
            totals[h]=val;
        }
                      
        return totals;
    }

    function pivotArray(dataArray, rowIndex, colIndex, dataIndex) {
        var result = {}, 
        ret = [];
        var newCols = [];
        for (var i = 0; i < dataArray.length; i++) { 
            if (!result[dataArray[i][rowIndex]]) {
                result[dataArray[i][rowIndex]] = {};
            }
            
            result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];
 
            //Get column names
            if (newCols.indexOf(dataArray[i][colIndex])===-1) {
                newCols.push(dataArray[i][colIndex]);
            }
        }
 
        newCols.sort();
        var item = [];
 
        //Add Header Row
        item.push('');
        item.push.apply(item, newCols);
        ret.push(item);
 
        //Add content 
        for (var key in result) {
            item = [];
            item.push(key);
            
            for (i = 0; i < newCols.length; i++) {
                item.push(result[key][newCols[i]] || "");
            }
            item.push((item.join(',').split(',').filter(x => x).filter(y => y !== ' ').length-1).toString());            
            ret.push(item);
            const sectorArr = [];
            
            for(var x = 0; x < item.length-1; x++){
                sectorArr[x] = (x===0) ? item[x] : item[x].split(',').filter(x => x).filter(y => y !== ' ').length
            }
            sectorsArr.push(sectorArr);
        }

        const verticals = sumVerticalsArray();

        //push the vertical totals to ret array 
        item=[];
        for(var h=0; h < verticals.length; h++) {
            item[h] = verticals[h].toString();
        }

        ret.push(item);
        //add placeholder -1 for geolocation and totals columns
        ret[ret.length-1].push('Totals');
        ret[ret.length-1].unshift('');
        ret[0].push('');
        return ret;
    }

    const renderMatrix = () => {
        return  (
            <div className={`card-container`}>
                <div className={`card`}>
                    <div className={`md`}>
                        <div className={``}>
                            <div className={`accent nodes title`}>{`Matrix`}</div>
                            <div className={`items`}>
                                <table className={`matrix`}>
                                    <tbody>
                                        {matrix.map((subArray, index) => {
                                            return (
                                                <tr key={index} className={`table-row row-${index}`}>
                                                    {subArray.map((subitem, i) => {
                                                        return (                            
                                                            <td className={`row-cell row-cell-${i} ${i > 0 && index > 0 ? 'data-cell' : ''}`}  
                                                                key={i}>
                                                                    {subitem.replace(/,\s*$/, "")}
                                                            </td>                            
                                                        );
                                                    })} 
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    return (
        <div className={`card-container`}>
            <div className={`card`} style={{padding: '20px 10px'}}>
                { renderMatrix() }
            </div>
        </div>
    )
}

export default Matrix;
                 