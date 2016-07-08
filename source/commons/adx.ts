import {Candle,DateValue} from './models';
import {trueRange} from './atr';
import {sum} from './smoothen';

export const dmPlus = (candles:Candle[]) => {
    const result:DateValue[] = [];
    candles.forEach((candle,index) => {
        const resultNode:DateValue = {date:candle.date,value:null}; 
        if(index > 0){
            const previousCandle = candles[index-1];
            const highDiff = candle.high - previousCandle.high;
            if(highDiff < 0){
                resultNode.value = 0;
            }else{
                const lowDiff = previousCandle.low - candle.low;
                if(highDiff < lowDiff){
                    resultNode.value = 0
                }else{
                    resultNode.value = highDiff;
                }
            }
        }
        result.push(resultNode);
    });
    return result;
};

export const dmMinus = (candles:Candle[]) => {
    const result:DateValue[] = [];
    candles.forEach((candle,index) => {
        const resultNode:DateValue = {date:candle.date,value:null}; 
        if(index > 0){
            const previousCandle = candles[index-1];
            const lowDiff = previousCandle.low - candle.low;
            if(lowDiff < 0){
                resultNode.value = 0;
            }else{
                const highDiff = candle.high - previousCandle.high;
                if(lowDiff <= highDiff){
                    resultNode.value = 0;
                }else{
                    resultNode.value = lowDiff;
                }
            }
        }
        result.push(resultNode);
    });
    return result;
};

export const diPlus = (candles:Candle[],period:number) => {
    const result:DateValue[] = [];
    const smoothDmPlus = sum(dmPlus(candles).slice(1),period);
    smoothDmPlus.unshift({date:candles[0].date,value:null});
    const smoothTrueRange = sum(trueRange(candles).slice(1),period)
    smoothTrueRange.unshift({date:candles[0].date,value:null});
    for(let i=0;i<candles.length;i++){
        const resultNode:DateValue = {date:candles[i].date,value:null};
        if(smoothTrueRange[i].value!==null && smoothDmPlus[i].value!==null){
            resultNode.value = smoothDmPlus[i].value/smoothTrueRange[i].value*100;
        }
        result.push(resultNode);
    }
    return result;
};

export const diMinus = (candles:Candle[],period:number) => {
    const result:DateValue[] = [];
    const smoothDmMinus = sum(dmMinus(candles).slice(1),period);
    smoothDmMinus.unshift({date:candles[0].date,value:null});
    const smoothTrueRange = sum(trueRange(candles).slice(1),period)
    smoothTrueRange.unshift({date:candles[0].date,value:null});
    for(let i=0;i<candles.length;i++){
        const resultNode:DateValue = {date:candles[i].date,value:null};
        if(smoothTrueRange[i].value!==null && smoothDmMinus[i].value!==null){
            resultNode.value = smoothDmMinus[i].value/smoothTrueRange[i].value*100;
        }
        result.push(resultNode);
    }
    return result;
};

const data = [
    {date:'1',high:30.1983,low:29.4072,close:29.8720,open:null},
    {date:'2',high:30.2776,low:29.3182,close:30.2381,open:null},
    {date:'3',high:30.4458,low:29.9611,close:30.0996,open:null},
    {date:'4',high:29.3478,low:28.7443,close:28.9028,open:null},
    {date:'5',high:29.3477,low:28.5566,close:28.9225,open:null},
    {date:'6',high:29.2886,low:28.4081,close:28.4775,open:null},
    {date:'7',high:28.8334,low:28.0818,close:28.5566,open:null},
    {date:'8',high:28.7346,low:27.4289,close:27.5576,open:null},
    {date:'9',high:28.6654,low:27.6565,close:28.4675,open:null},
    {date:'10',high:28.8532,low:27.8345,close:28.2796,open:null},
    {date:'11',high:28.6356,low:27.3992,close:27.4882,open:null},
    {date:'12',high:27.6761,low:27.0927,close:27.2310,open:null},
    {date:'13',high:27.2112,low:26.1826,close:26.3507,open:null},
    {date:'14',high:26.8651,low:26.1332,close:26.3309,open:null},
    {date:'15',high:27.4090,low:26.6277,close:27.0333,open:null},
    {date:'16',high:26.9441,low:26.1332,close:26.2221,open:null},
    {date:'17',high:26.5189,low:25.4307,close:26.0144,open:null},
    {date:'18',high:26.5189,low:25.3518,close:25.4605,open:null},
    {date:'19',high:27.0927,low:25.8760,close:27.0333,open:null},
    {date:'20',high:27.6860,low:26.9640,close:27.4487,open:null},
    {date:'21',high:28.4477,low:27.1421,close:28.3586,open:null},
    {date:'22',high:28.5267,low:28.0123,close:28.4278,open:null},
    {date:'23',high:28.6654,low:27.8840,close:27.9530,open:null},
    {date:'24',high:29.0116,low:27.9928,close:29.0116,open:null},
    {date:'25',high:29.8720,low:28.7643,close:29.3776,open:null},
    {date:'26',high:29.8028,low:29.1402,close:29.3576,open:null},
    {date:'27',high:29.7529,low:28.7127,close:28.9107,open:null},
    {date:'28',high:30.6546,low:28.9290,close:30.6149,open:null},
    {date:'29',high:30.5951,low:30.0304,close:30.0502,open:null},
    {date:'30',high:30.7635,low:29.3863,close:30.1890,open:null}
];


// console.log(dmPlus(data));
// console.log(dmMinus(data));
// console.log(diPlus(data,14));
// console.log(diMinus(data,14));