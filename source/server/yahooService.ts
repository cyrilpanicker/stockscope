import * as request from 'request';
import * as moment from 'moment';

const uri = 'https://query.yahooapis.com/v1/public/yql';
const env = 'store://datatables.org/alltableswithkeys';
const format = 'json';
const query = 'select * from yahoo.finance.historicaldata'+
    ' where symbol = "<STOCK>.NS"'+
    ' and startDate = "<START-DATE>"'+
    ' and endDate = "<END-DATE>"';
    
const CANDLES_TO_DISPLAY = 180;
const MA1 = 8;
const MA2 = 21;
const MA3 = 55;
const CANDLES_TO_FETCH = CANDLES_TO_DISPLAY + MA3 - 1;
const START_DATE_OFFSET = CANDLES_TO_FETCH * 1.7;
    
const transformCandleData = ({Symbol,Date,Open,High,Low,Close,Volume}) => {
    return {
        symbol:Symbol.substring(0,Symbol.indexOf('.NS')),
        date:Date,
        open:parseFloat(Open),
        high:parseFloat(High),
        low:parseFloat(Low),
        close:parseFloat(Close),
        volume:parseFloat(Volume)
    };
};

export const getCandleData = ({stock,endDate}) => {

    const q = query
        .replace('<STOCK>',stock)
        .replace('<END-DATE>',moment(endDate).format('YYYY-MM-DD'))
        .replace('<START-DATE>',moment(endDate).subtract(START_DATE_OFFSET,'days').format('YYYY-MM-DD'));

    return new Promise((resolve,reject) => {
        request({uri,qs:{env,format,q},json:true},(error, response, body) => {
            if(error){
                reject(error);
            } else if(!body.query || typeof body.query.count === 'undefined' || body.query.count === null){
                reject('unexpected-error');
            } else if(body.query.count === 0){
                resolve([]);
            } else {
                const data = body.query.results.quote.filter(datum => !!parseFloat(datum.Volume));
                if(data.length < CANDLES_TO_FETCH){
                    reject('insufficient-data');
                } else {
                    resolve(data.map(datum => transformCandleData(datum)).reverse());
                }
            }
        });
    });

};