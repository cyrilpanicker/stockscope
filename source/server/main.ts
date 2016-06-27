import * as express from 'express';
import {delay,readFile,log} from './util-services';
import {getCandleData} from './yahoo-service';
import {connectToDb,disconnectFromDb,getFromDb,insertIntoDb} from './db-service';

let stocksList = [];
let stockPointer = 0;



(()=>{
    connectToDb().then(
        () => readFile('./data/stocks-list.json'),
        error => Promise.reject(error)
    ).then(
        (data:string) => stocksList = JSON.parse(data),
        error => Promise.reject(error)
    ).then(
        () => {
            log('processing started');
            processStocks();
        },
        error => {
            if(error === 'file-read-error'){
                disconnectFromDb();
            }
            log(error);
        }
    );
})();



const processStocks = () => {
    getCandleData({
        stock:stocksList[stockPointer].symbol,
        endDate:new Date()
    }).then(
        (candles:any[]) => {},
        error => {
            log(stocksList[stockPointer].symbol+'" : '+error);
            insertIntoDb('errors',{stock:stocksList[stockPointer].symbol,error})
        }
    ).then(
        () => {
            stockPointer++;
            if(stockPointer < stocksList.length){
                return delay(10000);
            }else{
                return delay(0);
            }
        }
    ).then(
        () => {
            if(stockPointer < stocksList.length){
                processStocks();
            }else{
                disconnectFromDb();
                log('processing finished');
            }
        }
    );
};