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
//     {date:'1',value:22.2734},
//     {date:'2',value:22.1940},
//     {date:'3',value:22.0847},
//     {date:'4',value:22.1741},
//     {date:'5',value:22.1840},
//     {date:'6',value:22.1344},
//     {date:'7',value:22.2337},
//     {date:'8',value:22.4323},
//     {date:'9',value:22.2436},
//     {date:'10',value:22.2933},
//     {date:'11',value:22.1542},
//     {date:'12',value:22.3926},
//     {date:'13',value:22.3816},
//     {date:'14',value:22.6109},
//     {date:'15',value:23.3558},
//     {date:'16',value:24.0519},
//     {date:'17',value:23.7530},
//     {date:'18',value:23.8324},
//     {date:'19',value:23.9516},
//     {date:'20',value:23.6338},
//     {date:'21',value:23.8225},
//     {date:'22',value:23.8722},
//     {date:'23',value:23.6537},
//     {date:'24',value:23.1870},
//     {date:'25',value:23.0976},
//     {date:'26',value:23.3260},
//     {date:'27',value:22.6805},
//     {date:'28',value:23.0976},
//     {date:'29',value:22.4025},
//     {date:'30',value:22.1725}
// ];

// const smaData = sma(data,10);
// const emaData = ema(data,10);

// smaData.forEach((smaDatum,index)=>{
//     console.log(smaDatum.date+'  '+smaDatum.value+' '+emaData[index].value);
// });