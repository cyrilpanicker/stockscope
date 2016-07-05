// import * as moment from 'moment';

// import {functionalLogger} from '../logging-service';
// import * as yahoo from './yahoo-service';
// import * as nse from './nse-service';

// export const getYahooUrl = yahoo.getCandleDataUrl;
// export const getNseUrl = nse.getCandleDataUrl;

// export const getCandles = ({stock,endDate}) => {
//     const today = new Date();
//     let nseCall = Promise.resolve(null);
//     let candles = [];
//     let latestCandle = null;
//     if(!moment(endDate).isBefore(today,'day')){
//         nseCall = nse.getCandleData({stock}).then(
//             candle => latestCandle = candle,
//             error => Promise.reject(error)
//         );
//     }
//     const yahooCall = yahoo.getCandleData({stock,endDate}).then(
//         (_candles:any[]) => candles = _candles,
//         error => Promise.reject(error)
//     );
//     return Promise.all([nseCall,yahooCall]).then(
//         () => {
//             if(latestCandle!==null && candles[candles.length-1].date !== latestCandle.date){
//                 candles.push(latestCandle);
//             }
//             return Promise.resolve(candles);
//         },
//         error => Promise.reject(error)
//     );
// };