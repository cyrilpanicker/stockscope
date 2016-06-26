import * as express from 'express';
import {readFile,getCandleData,delay} from './services';

let stocksList = [];
let stockPointer = 0;

readFile('./data/stocks-list.json').then(
    (data:string) => {
        stocksList = JSON.parse(data);
        processStocks();
    },
    error => {
        console.log('error-reading-stocks-list');
    }
);

const processStocks = () => {
    
    getCandleData({
        stock:stocksList[stockPointer].symbol,
        endDate:new Date()
    }).then(
        (candles:any[]) => {
            console.log(candles.length);
            return delay(60000);
        },
        (error:string) => {
            console.log(error);
            return delay(60000);
        }
    ).then(
        () => {
            stockPointer++;
            if(stockPointer<stocksList.length){
                processStocks();
            }
        }
    )
    
};


// getCandleData({
//     stock:'RELIANCE',
//     endDate:new Date()
// }).then((data:any[]) => console.log(data.length),console.log.bind(console));