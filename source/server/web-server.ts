import * as express from 'express';
import * as d3 from 'd3';
import {functionalLogger} from './services/logging-service';
import {getCandleData,getCandleDataUrl} from './services/yahoo-service';
import {PORT} from '../commons/constants'; 

const app = express();

app.use(express.static('./build/client-public'));

app.get('/api',(request,response) => {
    const stock = request.query.stock;
    const endDate = request.query.date ? new Date(request.query.date) : new Date();
    const apiUrl = getCandleDataUrl({stock,endDate});
    getCandleData({stock,endDate}).then(
        (candles:any[]) => {
            candles = candles.slice(-180);
            response.send({
                apiUrl,
                candles,
                indicators:[]
            });
        },
        error => response.status(500).send({error})
    );
});

app.listen(PORT,error=>{
    if(error){
        functionalLogger.error(error);
    }else{
        functionalLogger.info('web server running at port '+PORT);
    }
});