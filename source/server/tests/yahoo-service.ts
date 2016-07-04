import {getCandleData} from '../services/candle-service/yahoo-service';

getCandleData({stock:'INFY',endDate:new Date('2016-07-05')}).then(
    candles => console.dir(candles),
    error => console.log(error)
);