import {getCandleData} from '../services/candle-service/nse-service';

getCandleData({stock:'INFY'}).then(
    candle => console.dir(candle),
    error => console.log(error)
);