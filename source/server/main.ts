import {assign} from 'lodash';
import {delay,readFile} from './services/util-services';
import {functionalLogger,logProcessedInfo} from './services/logging-service';
import {getCandles,getCandlesUrl as getQuandlUrl} from './services/quandl-service';
import {getCandleDataUrl as getNseUrl} from './services/nse-service';
import {atr} from '../commons/atr';

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
    const quandl_url = getQuandlUrl({stock,endDate:currentDate});
    const nse_url = getNseUrl({stock});
    const logParameters = {id:stockPointer,stock,quandl_url,nse_url};
    
    getCandles({stock,endDate:currentDate}).then(
        (candles:any[]) => {
            const atrData = atr(candles,14);
            const latestAtr = atrData[atrData.length-1].value;
            const price = candles[candles.length-1].close;
            const vr = price/latestAtr;
            logProcessedInfo(<any>assign({},logParameters,{
                count:candles.length,
                lastDate:candles[candles.length-1].date,
                error:null,
                ss_url:'http://163.172.131.187:6106?stock='+encodeURIComponent(stock),
                price,
                atr:Math.round(latestAtr*100)/100,
                vr:Math.round(vr*100)/100
            }));
        },
        error => logProcessedInfo(<any>assign({},logParameters,{
            count:null,
            lastDate:null,
            error,
            ss_url:null,
            price:null,
            atr:null,
            vr:null
        }))
    ).then(
        () => {
            stockPointer++;
            if(stockPointer < stocksList.length){
                return delay(5000);
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