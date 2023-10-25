import React, {useEffect, useState} from 'react';
import { Chart } from 'primereact/chart';
// import * as fn from '../../../shared/fn';
// import * as cnst from '../../../shared/constants';
// import * as api from '../../../api/api';

const HbarDist = (props) => {    
    //const [value, setValue] = useState([]);
    
    function calcDecile(n) {
        const arr = [];
        arr.sort(function(a, b){return a-b})

        for (var x=0; x< 10; x++) {
              var decile = (((x+1)*n) * 1) / 10;
              arr.push(decile);              
        }

        return arr.sort(function(a, b){return b-a});
    }
    
    const [chartData] = useState({
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
            type: 'line',
            label: 'Median Account Balance',
            borderColor: '#ff6361',
            borderWidth: 3,
            fill: true,
            tension: .3,
            data: [2131123,1511335,1332245,664478,366778,966897,1263345,123e4, 1144567, 323345],            
        }, {
            type: 'bar',
            label: 'Decile',
            backgroundColor: '#ffa600',
            data: calcDecile(2463508),
            borderColor: '#ffa600',
            borderWidth: 0
        }]
    });

    const getChartOptions = () => {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: 5,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: true
                },
                legend: {
                    
                    labels: {
                        color: '#fff',
                        font: {
                            family: 'Jost',
                            size: 14,
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#fff',
                        font: {
                            family: 'Jost',
                            size: 13,
                            weight: 100
                        }
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#fff',
                        font: {
                            family: 'Jost',
                            size: 13
                        }
                    },
                    grid: {
                        color: '#eee'
                    }
                }
            }
        };

        return {
            basicOptions,
        }
    }
    const { basicOptions } = getChartOptions();
    useEffect(() => {
        
    })

    return (
        <div className={`chart`}>
            <div className={`card`}>
                <div className={`ml`}>
                    <div className={`items`}>
                        <div className={`accent distribution title`}>{`HBAR Distribution`}</div>                    
                        <div className={`item`}>
                            <Chart type="bar" data={chartData} options={basicOptions} />
                        </div>     
                    </div>                   
                </div>
            </div>
        </div>
    );
  }

  export default HbarDist