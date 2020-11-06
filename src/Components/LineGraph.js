import React ,{useState,useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import numeral from "numeral";
const options = {
    legend:{
        display:false
    },
    elements:{
        point:{
            radius:0
        }
    },
    maintainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect: false,
        callbacks:{
            label: function(tooltipItem,data){
                return numeral(tooltipItem.value).format("+0,0");
            }
        }
    },
    scales: {
        xAxes: [{
            type:"time",
            time:{
                format: "MM/DD/YY",
                tooltipFormat:"ll"
            }
        }],
        yAxes: [{
            gridLines: {
                display: false,
            },
            ticks: {
                callback: function(value, index,values){
                    return numeral(value).format("0a");
                }
            }
        }
    ]
    }
}

function LineGraph({casesType,...props}) {
    const[data,setData] = useState({});
    const buildChartData = (data, casesType) => {
        let chartData=[];
        let lastDataPoint;
        for(let date in data.cases){
            if(lastDataPoint){
                let newDataPoint = {
                    x:date,
                    y:data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        };
        return chartData;
    };
    useEffect(() => {
        const fetchData = async () => {
        await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then((response) => {return response.json()})
        .then((data) => {
            let chartData = buildChartData(data,casesType);
            console.log("Chart",chartData);
            setData(chartData);
        });
        };
        fetchData();
    },[casesType]);
    
    const casesTypeColors = {
        cases: {
            hex: "#CC1034",
            back: "rgba(204,6,52,0.1)"
        },
        recovered: {
            hex: "#7dd71d",
            back: "rgba(6,204,52,0.1)"
        },
        deaths: {
            hex: "#fb4443",
            back: "rgba(204,52,6,0.1)"
        },
    };

    return (
        <div className={props.className}>
        {
            data?.length > 0 && (
                <Line 
                data = {
                    {
                        datasets:[{
                            backgroundColor:casesTypeColors[casesType].back,
                            borderColor: casesTypeColors[casesType].hex,
                            data: data,
                        }]
                    }
                }
                options ={options}
            />
            )
        }
            
        </div>
    )
}

export default LineGraph
