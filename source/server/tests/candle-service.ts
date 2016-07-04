import {getCandles} from '../services/candle-service';

getCandles({stock:'INFY',endDate:new Date('2016-07-05')}).then(
    candles => console.dir(candles),
    error => console.log(error)
);