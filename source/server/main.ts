import * as express from 'express';
import {delay,readFile,logMessage,logProcessMessage} from './util-services';
import {getCandleData} from './yahoo-service';

let stocksList = [];
let stockPointer = 0;


readFile('./data/stocks-list.json').then(
    (data:string) => {
        stocksList = JSON.parse(data);
        logMessage('processing started')
        processStocks();
    },
    error => logMessage(error)
);

const processStocks = () => {
    getCandleData({
        stock:stocksList[stockPointer].symbol,
        endDate:new Date()
    }).then(
        (candles:any[]) => {
            logProcessMessage({
                id:stockPointer,
                stock:stocksList[stockPointer].symbol,
                count:candles.length,
                error:null
            });
        },
        error => {
            logProcessMessage({
                id:stockPointer,
                stock:stocksList[stockPointer].symbol,
                count:null,
                error:error
            });
        }
    ).then(
        () => {
            stockPointer++;
            if(stockPointer < stocksList.length){
                return delay(20000);
            }else{
                return delay(0);
            }
        }
    ).then(
        () => {
            if(stockPointer < stocksList.length){
                processStocks();
            }else{
                logMessage('processing finished');
            }
        }
    )
};