import * as express from 'express';
import {delay,readFile} from './util-services';
import {logMessage,logProcessMessage} from './logging-service';
import {getCandleData,getCandleDataUrl} from './yahoo-service';

let stocksList = [];
let stockPointer = 0;

readFile('./data/stocks-list.test.json').then(
    (data:string) => {
        stocksList = JSON.parse(data);
        logMessage('processing started')
        processStocks();
    },
    error => logMessage(error)
);

const processStocks = () => {
    const url = getCandleDataUrl({stock:stocksList[stockPointer].symbol,endDate:new Date()});
    getCandleData({
        stock:stocksList[stockPointer].symbol,
        endDate:new Date()
    }).then(
        (candles:any[]) => {
            logProcessMessage({
                id:stockPointer,
                stock:stocksList[stockPointer].symbol,
                count:candles.length,
                error:null,
                url
            });
        },
        error => {
            logProcessMessage({
                id:stockPointer,
                stock:stocksList[stockPointer].symbol,
                count:null,
                error:error,
                url
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