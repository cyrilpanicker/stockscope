import {Candle,DateValue} from './models';

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
                    resultNode.value = highDiff
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

// const data = [
//     {date:'1',high:30.20,low:29.41,close:29.87,open:null},
//     {date:'2',high:30.28,low:29.32,close:30.24,open:null},
//     {date:'3',high:30.45,low:29.96,close:30.10,open:null},
//     {date:'4',high:29.35,low:28.74,close:28.90,open:null},
//     {date:'5',high:29.35,low:28.56,close:28.92,open:null},
//     {date:'6',high:29.29,low:28.41,close:28.48,open:null},
//     {date:'7',high:28.83,low:28.08,close:28.56,open:null},
//     {date:'8',high:28.73,low:27.43,close:27.56,open:null},
//     {date:'9',high:28.67,low:27.66,close:28.47,open:null},
//     {date:'10',high:28.85,low:27.83,close:28.28,open:null},
//     {date:'11',high:28.64,low:27.40,close:27.49,open:null},
//     {date:'12',high:27.68,low:27.09,close:27.23,open:null},
//     {date:'13',high:27.21,low:26.18,close:26.35,open:null},
//     {date:'14',high:26.87,low:26.13,close:26.33,open:null},
//     {date:'15',high:27.41,low:26.63,close:27.03,open:null},
//     {date:'16',high:26.94,low:26.13,close:26.22,open:null},
//     {date:'17',high:26.52,low:25.43,close:26.01,open:null},
//     {date:'18',high:26.52,low:25.35,close:25.46,open:null},
//     {date:'19',high:27.09,low:25.88,close:27.03,open:null},
//     {date:'20',high:27.69,low:26.96,close:27.45,open:null},
//     {date:'21',high:28.45,low:27.14,close:28.36,open:null},
//     {date:'22',high:28.53,low:28.01,close:28.43,open:null},
//     {date:'23',high:28.67,low:27.88,close:27.95,open:null},
//     {date:'24',high:29.01,low:27.99,close:29.01,open:null},
//     {date:'25',high:29.87,low:28.76,close:29.38,open:null},
//     {date:'26',high:29.80,low:29.14,close:29.36,open:null},
//     {date:'27',high:29.75,low:28.71,close:28.91,open:null},
//     {date:'28',high:30.65,low:28.93,close:30.61,open:null},
//     {date:'29',high:30.60,low:30.03,close:30.05,open:null},
//     {date:'30',high:30.76,low:29.39,close:30.19,open:null}
// ];
// const dmPlusData = dmPlus(data);
// const dmMinusData = dmMinus(data);

// dmPlusData.forEach((datum,index) => {
//     console.log(datum.date+' '+datum.value+' '+dmMinusData[index].value);
// });