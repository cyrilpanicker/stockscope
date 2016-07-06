import * as request from 'request';
import * as moment from 'moment';

const URI = 'https://www.quandl.com/api/v3/datasets/NSE/<STOCK>.json';
const API_KEY = 'kxeEoL4RejR54Ae4VPPg';
const CANDLES_TO_DISPLAY = 180;
const MA1 = 8;
const MA2 = 21;
const MA3 = 55;
const CANDLES_TO_FETCH = CANDLES_TO_DISPLAY + MA3 - 1;
const CANDLES_TO_FETCH_WITH_OFFSET = CANDLES_TO_FETCH * 1.5;
//const START_DATE_OFFSET = CANDLES_TO_FETCH * 1.5;
    
const transformCandleData = (symbol) => {
    return (datum) => {
        return {
            symbol,
            date:datum[0],
            open:datum[1],  
            high:datum[2],
            low:datum[3],
            close:datum[5],
            volume:datum[6]
            // turnover:datum[7]
        }
    };
};

export const getCandles = ({stock,endDate}) => {
    const quandlStock = stock.replace(/-/g,'_').replace(/&/g,'');
    return new Promise((resolve,reject) => {
        request({
            uri:URI.replace('<STOCK>',quandlStock),
            qs:{
                'limit':CANDLES_TO_FETCH_WITH_OFFSET,
                'api_key':API_KEY,
                'end_date':moment(endDate).format('YYYY-MM-DD')
            },
            json:true
        },(error, response, body) => {
            if(error){
                console.dir(error);
                reject('quandl-unexpected-error');
            } else if(body.quandl_error){
                reject('quandl-stock-invalid');
            } else if(!body.dataset || !body.dataset.data) {
                reject('quandl-data-not-foud');
            } else if(body.dataset.data.length < CANDLES_TO_FETCH){
                reject('quandl-insufficient-data');
            } else{
                if(body.dataset.data.some(datum => !datum[6])){
                    reject('quandl-zero-volume-candle-found');
                } else {
                    resolve(
                        body.dataset.data
                            .map(transformCandleData(stock))
                            .reverse()
                    );
                }
            }
        });
    });
};

export const getCandlesUrl = ({stock,endDate}) => {
    const quandlStock = stock.replace(/-/g,'_').replace(/&/g,'');
    return URI.replace('<STOCK>',quandlStock)+
        '?limit='+CANDLES_TO_FETCH+
        '&api_key='+API_KEY+
        '&end_date='+moment(endDate).format('YYYY-MM-DD');
};

// console.log(getCandlesUrl({stock:'M&M',endDate:new Date()}));

// getCandles({
//     stock:'RELIANCE',
//     endDate:new Date()
// }).then(
//     (candles:any[])=>{
//         console.log(candles);
//     },
//     console.log
// );