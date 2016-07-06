import * as d3 from 'd3';
import {DateValue} from './models';

export const avg = (numbers:number[]) => {
    return d3.sum(numbers)/numbers.length;
};

export const sma = (data:DateValue[],period:number) => {
    const result:DateValue[] = [];
    data.forEach((datum,index) => {
        const resultNode:DateValue = {
            date:datum.date,
            value:null
        };
        if(index >= period-1){
            resultNode.value = avg(data.slice(index+1-period,index+1).map(datum => datum.value));
        }
        result.push(resultNode);
    });
    return result;
};

export const ema = (data:DateValue[],period:number) => {
    const result:DateValue[] = [];
    const multiplier = 2/(period+1);
    data.forEach((datum,index) => {
        const resultNode:DateValue = {
            date:datum.date,
            value:null
        };
        if(index === period-1){
            resultNode.value = avg(data.slice(0,period).map(datum => datum.value));
        }else if(index > period-1){
            const previousEma = result[index-1].value;
            resultNode.value = previousEma + (datum.value - previousEma)*multiplier;
        }
        result.push(resultNode);
    });
    return result;
};


// const data = [
//     {date:'1',value:22.27},
//     {date:'2',value:22.19},
//     {date:'3',value:22.08},
//     {date:'4',value:22.17},
//     {date:'5',value:22.18},
//     {date:'6',value:22.13},
//     {date:'7',value:22.23},
//     {date:'8',value:22.43},
//     {date:'9',value:22.24},
//     {date:'10',value:22.29},
//     {date:'11',value:22.15},
//     {date:'12',value:22.39},
//     {date:'13',value:22.38},
//     {date:'14',value:22.61},
//     {date:'15',value:23.36},
//     {date:'16',value:24.05},
//     {date:'17',value:23.75},
//     {date:'18',value:23.83},
//     {date:'19',value:23.95},
//     {date:'20',value:23.63},
//     {date:'21',value:23.82},
//     {date:'22',value:23.87},
//     {date:'23',value:23.65},
//     {date:'24',value:23.19},
//     {date:'25',value:23.10},
//     {date:'26',value:23.33},
//     {date:'27',value:22.68},
//     {date:'28',value:23.10},
//     {date:'29',value:22.40},
//     {date:'30',value:22.17}
// ];

// const smaData = sma(data,10);
// const emaData = ema(data,10);

// smaData.forEach((smaDatum,index)=>{
//     console.log(smaDatum.date+'  '+smaDatum.value+' '+emaData[index].value);
// });