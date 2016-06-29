import * as express from 'express';
import {functionalLogger} from './logging-service';
import {getCandleData} from './yahoo-service';

const PORT = 6106;
const app = express();

app.use(express.static('./build/client-bundled'));

app.get('/api',(request,response) => {
    getCandleData({
        stock:request.query.stock,
        endDate:new Date()
    }).then(
        candles => response.send({candles}),
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