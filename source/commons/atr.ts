import * as d3 from 'd3';
import {Candle,DateValue} from './models';
import {avg} from './smoothen';

export const trueRange = (candles:Candle[]) => {
    const result:DateValue[] = [];
    candles.forEach((candle,index)=>{
        const HLDiff = candle.high - candle.low;
        if(index === 0){
            result.push({date:candle.date,value:HLDiff});
        }else{
            const previousCandle = candles[index-1];
            const HCDiff = Math.abs(candle.high - previousCandle.close);
            const LCDiff = Math.abs(candle.low - previousCandle.close);
            result.push({date:candle.date,value:Math.max(HLDiff,HCDiff,LCDiff)});
        }
    });
    return result;
};

export const atr = (candles:Candle[],period:number) => {
    return avg(trueRange(candles),period);
};

// const candles = [
//     {high:48.70,low:47.79,close:48.16,open:0,date:'1',symbol:'',volume:0},
//     {high:48.72,low:48.14,close:48.61,open:0,date:'2',symbol:'',volume:0},
//     {high:48.90,low:48.39,close:48.75,open:0,date:'3',symbol:'',volume:0},
//     {high:48.87,low:48.37,close:48.63,open:0,date:'4',symbol:'',volume:0},
//     {high:48.82,low:48.24,close:48.74,open:0,date:'5',symbol:'',volume:0},
//     {high:49.05,low:48.64,close:49.03,open:0,date:'6',symbol:'',volume:0},
//     {high:49.20,low:48.94,close:49.07,open:0,date:'7',symbol:'',volume:0},
//     {high:49.35,low:48.86,close:49.32,open:0,date:'8',symbol:'',volume:0},
//     {high:49.92,low:49.50,close:49.91,open:0,date:'9',symbol:'',volume:0},
//     {high:50.19,low:49.87,close:50.13,open:0,date:'10',symbol:'',volume:0},
//     {high:50.12,low:49.20,close:49.53,open:0,date:'11',symbol:'',volume:0},
//     {high:49.66,low:48.90,close:49.50,open:0,date:'12',symbol:'',volume:0},
//     {high:49.88,low:49.43,close:49.75,open:0,date:'13',symbol:'',volume:0},
//     {high:50.19,low:49.73,close:50.03,open:0,date:'14',symbol:'',volume:0},
//     {high:50.36,low:49.26,close:50.31,open:0,date:'15',symbol:'',volume:0},
//     {high:50.57,low:50.09,close:50.52,open:0,date:'16',symbol:'',volume:0},
//     {high:50.65,low:50.30,close:50.41,open:0,date:'17',symbol:'',volume:0},
//     {high:50.43,low:49.21,close:49.34,open:0,date:'18',symbol:'',volume:0},
//     {high:49.63,low:48.98,close:49.37,open:0,date:'19',symbol:'',volume:0},
//     {high:50.33,low:49.61,close:50.23,open:0,date:'20',symbol:'',volume:0},
//     {high:50.29,low:49.20,close:49.24,open:0,date:'21',symbol:'',volume:0},
//     {high:50.17,low:49.43,close:49.93,open:0,date:'22',symbol:'',volume:0},
//     {high:49.32,low:48.08,close:48.43,open:0,date:'23',symbol:'',volume:0},
//     {high:48.50,low:47.64,close:48.18,open:0,date:'24',symbol:'',volume:0},
//     {high:48.32,low:41.55,close:46.57,open:0,date:'25',symbol:'',volume:0},
//     {high:46.80,low:44.28,close:45.41,open:0,date:'26',symbol:'',volume:0},
//     {high:47.80,low:47.31,close:47.77,open:0,date:'27',symbol:'',volume:0},
//     {high:48.39,low:47.20,close:47.72,open:0,date:'28',symbol:'',volume:0},
//     {high:48.66,low:47.90,close:48.62,open:0,date:'29',symbol:'',volume:0},
//     {high:48.79,low:47.73,close:47.85,open:0,date:'30',symbol:'',volume:0}
// ];
// const trueRangeData = trueRange(candles);
// const atrData = atr(candles,14);

// candles.forEach((candle,index)=>{
//     console.log(candle.date+' , '+trueRangeData[index].value+' , '+atrData[index].value);
// });