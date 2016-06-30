import * as express from 'express';
import {functionalLogger} from './services/logging-service';
import {getCandleData} from './services/yahoo-service';

const PORT = 6106;
const app = express();

app.use(express.static('./build/client-public'));

app.get('/api',(request,response) => {
    const date = request.query.date ? new Date(request.query.date) : new Date();
    getCandleData({
        stock: request.query.stock,
        endDate: date
    }).then(
        candles => response.send({candles}),
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