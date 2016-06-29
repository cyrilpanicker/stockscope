import {assign} from 'lodash';
import {delay,readFile} from './util-services';
import {functionalLogger,logProcessedInfo} from './logging-service';
import {getCandleData,getCandleDataUrl} from './yahoo-service';

let stocksList = [];
let stockPointer = 0;

const mode = process.env.NODE_ENV;
const stocksListFile = mode !== 'PROD' ? './data/stocks-list.test.json' : './data/stocks-list.json' ;

functionalLogger.info('reading from file "'+stocksListFile+'"');

readFile(stocksListFile).then(
    (data:string) => {
        stocksList = JSON.parse(data);
        functionalLogger.info('processing started');
        processStocks();
    },
    error => functionalLogger.error(error)
);

const processStocks = () => {
    const stock = stocksList[stockPointer].symbol;
    const currentDate = new Date();
    const url = getCandleDataUrl({stock,endDate:currentDate});
    const logParameters = {id:stockPointer,stock,url};
    getCandleData({stock,endDate:currentDate}).then(
        (candles:any[]) => {
            logProcessedInfo(<any>assign({},logParameters,{
                count:candles.length,
                lastDate:candles[candles.length-1].date,
                error:null
            }));
        },
        error => {
            logProcessedInfo(<any>assign({},logParameters,{
                count:null,
                lastDate:null,
                error
            }));
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
                functionalLogger.info('processing finished');
            }
        }
    )
};