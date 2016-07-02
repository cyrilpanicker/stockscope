import * as request from 'request';
import * as moment from 'moment';
import {functionalLogger} from './logging-service';

const uri = 'https://www.nseindia.com/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp';
const headers = {
    'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36',
    'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' 
}

export const getCandleData = ({stock}) => {
    return new Promise((resolve,reject) => { 
        request({uri,qs:{symbol:stock},headers},(error,reponse,body) => {
            if(error){
                reject('unexpected-error');
            }else{
                const data = JSON.parse(body.match(/({"futLink".*"optLink".*)/)[1]).data[0];
                resolve({
                    symbol:data.symbol,
                    date:moment(new Date(data.secDate)).format('YYYY-MM-DD'),
                    open:parseFloat(data.open.replace(/,/g,'')),
                    high:parseFloat(data.dayHigh.replace(/,/g,'')),
                    low:parseFloat(data.dayLow.replace(/,/g,'')),
                    close:parseFloat(data.closePrice.replace(/,/g,'')),
                    volume:parseFloat(data.totalTradedVolume.replace(/,/g,''))
                });
            }
        });
    });
};

export const getCandleDataUrl = ({stock}) => {
    return uri+'?symbol='+stock;
}; 