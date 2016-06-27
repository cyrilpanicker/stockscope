import * as express from 'express';
import {delay,readFile} from './util-services';
import {getCandleData} from './yahoo-service';
import {connectToDb,getFromDb,insertIntoDb} from './db-service';

let stocksList = [];
let stockPointer = 0;

// readFile('./data/stocks-list.json').then(
//     (data:string) => {
//         stocksList = JSON.parse(data);
//         processStocks();
//     },
//     error => {
//         console.log('error-reading-stocks-list');
//     }
// );

// const processStocks = () => {
    
//     getCandleData({
//         stock:stocksList[stockPointer].symbol,
//         endDate:new Date()
//     }).then(
//         (candles:any[]) => {
//             console.log(candles.length);
//             return delay(60000);
//         },
//         (error:string) => {
//             console.log(error);
//             return delay(60000);
//         }
//     ).then(
//         () => {
//             stockPointer++;
//             if(stockPointer<stocksList.length){
//                 processStocks();
//             }
//         }
//     )
    
// };

let i = 0;

const process = () => {
    insertIntoDb('test',{i}).then(
        () => {
            console.log('inserted '+i);
            return delay(5000);
        },
        error => {
            console.log(error);
            return delay(5000);
        }
    ).then(
        () => {
            i++;
            process();
        }
    );
};

connectToDb().then(
    process,
    error => console.log(error)    
);

