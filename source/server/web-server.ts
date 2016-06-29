import * as express from 'express';
import {functionalLogger} from './logging-service';

const PORT = 6106;
const app = express();

app.use(express.static('./build/client-bundled'));

app.listen(PORT,error=>{
    if(error){
        functionalLogger.error(error);
    }else{
        functionalLogger.info('web server running at port '+PORT);
    }
});