import {assign} from 'lodash';
import {delay,readFile} from './services/util-services';
import {functionalLogger,logProcessedInfo} from './services/logging-service';
import {getCandles,getNseUrl,getYahooUrl} from './services/candle-service';

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
    const yql_url = getYahooUrl({stock,endDate:currentDate});
    const nse_url = getNseUrl({stock});
    const logParameters = {id:stockPointer,stock,yql_url,nse_url};
    
    getCandles({stock,endDate:currentDate}).then(
        candles => logProcessedInfo(<any>assign({},logParameters,{
            count:candles.length,
            lastDate:candles[candles.length-1].date,
            error:null,
            ss_url:'http://163.172.131.187:6106?stock='+stock,
            price:candles[candles.length-1].close
        })),
        error => logProcessedInfo(<any>assign({},logParameters,{
            count:null,
            lastDate:null,
            error,
            ss_url:null,
            price:null
        }))
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
    );

};