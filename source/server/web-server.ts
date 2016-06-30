import * as express from 'express';
import * as d3 from 'd3';
import {functionalLogger} from './services/logging-service';
import {getCandleData,getCandleDataUrl} from './services/yahoo-service';
import {SLAB_TYPES,SLAB_0} from '../commons/constants';

const PORT = 6106;
const app = express();

app.use(express.static('./build/client-public'));

app.get('/api',(request,response) => {
    const stock = request.query.stock;
    const endDate = request.query.date ? new Date(request.query.date) : new Date();
    const apiUrl = getCandleDataUrl({stock,endDate});
    getCandleData({stock,endDate}).then(
        (candles:any[]) => {
            const slabs = [{
                type:SLAB_TYPES.CANDLE,
                name:'price-chart',
                height:SLAB_0.height,
                padding:SLAB_0.padding,
                minValue:d3.min(candles.map(candle => candle.low)),
                maxValue:d3.max(candles.map(candle => candle.high))
            }];
            response.send({
                apiUrl,
                candles,
                slabs
            });
        },
        error => response.status(500).send(error)
    );
});

app.listen(PORT,error=>{
    if(error){
        functionalLogger.error(error);
    }else{
        functionalLogger.info('web server running at port '+PORT);
    }
});