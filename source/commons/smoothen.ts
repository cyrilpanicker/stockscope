import {Candle,DateValue} from './models';
import * as d3 from 'd3';

export const sum = (data:DateValue[],period:number) => {
    
    const result:DateValue[] = [];
    data.forEach((datum,index) => {
        const resultNode:DateValue = {date:datum.date,value:null};
        if(index === period-1){
            resultNode.value = d3.sum(data.slice(0,period).map(datum => datum.value));
        }else if(index > period-1){
            const previousValue = result[index-1].value;
            resultNode.value = previousValue - previousValue/period + datum.value;
        }
        result.push(resultNode);
    });
    return result;
    
};