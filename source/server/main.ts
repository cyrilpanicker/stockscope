import * as express from 'express';
import {delay,readFile} from './util-services';
import {functionalLogger,logProcessedInfo} from './logging-service';
import {getCandleData,getCandleDataUrl} from './yahoo-service';

let stocksList = [];
let stockPointer = 0;

console.log(process.env.NODE_ENV);
functionalLogger.error('Hi | message');
logProcessedInfo({id:1,count:123,error:null,stock:'INFY',lastDate:'08-06-2016',url:'asdkg.com'});
console.log(stocksList[9].ads);

// const mode = process.env.NODE_ENV;
// const stocksListFile = mode === 'PROD' ? './data/stocks-list.json' : './data/stocks-list.test.json';

// readFile(stocksListFile).then(
//     (data:string) => {
//         stocksList = JSON.parse(data);
//         logMessage('processing started')
//         processStocks();
//     },
//     error => logMessage(error)
// );

// const processStocks = () => {
//     const url = getCandleDataUrl({stock:stocksList[stockPointer].symbol,endDate:new Date()});
//     getCandleData({
//         stock:stocksList[stockPointer].symbol,
//         endDate:new Date()
//     }).then(
//         (candles:any[]) => {
//             logProcessMessage({
//                 id:stockPointer,
//                 stock:stocksList[stockPointer].symbol,
//                 count:candles.length,
//                 lastDate:candles[candles.length-1].date,
//                 error:null,
//                 url
//             });
//         },
//         error => {
//             logProcessMessage({
//                 id:stockPointer,
//                 stock:stocksList[stockPointer].symbol,
//                 count:null,
//                 lastDate:null,
//                 error:error,
//                 url
//             });
//         }
//     ).then(
//         () => {
//             stockPointer++;
//             if(stockPointer < stocksList.length){
//                 return delay(20000);
//             }else{
//                 return delay(0);
//             }
//         }
//     ).then(
//         () => {
//             if(stockPointer < stocksList.length){
//                 processStocks();
//             }else{
//                 logMessage('processing finished');
//             }
//         }
//     )
// };