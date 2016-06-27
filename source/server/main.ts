import * as express from 'express';
import {delay,readFile,log} from './util-services';
import {getCandleData} from './yahoo-service';

let stocksList = [];
let stockPointer = 0;


readFile('./data/stocks-list.json').then(
    (data:string) => {
        stocksList = JSON.parse(data);
        log('processing started');
        processStocks();
    },
    error => log(error)
);

const processStocks = () => {
    getCandleData({
        stock:stocksList[stockPointer].symbol,
        endDate:new Date()
    }).then(
        (candles:any[]) => {
            log(
                'pointer : '+stockPointer
                +' | stock : '+stocksList[stockPointer].symbol
                +' | count : '+candles.length
            );
        },
        error => {
            log(
                'pointer : '+stockPointer
                +' | stock : '+stocksList[stockPointer].symbol
                +' | error : '+error
            );
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
                log('processing finished');
            }
        }
    )
};