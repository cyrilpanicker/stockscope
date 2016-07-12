import * as moment from 'moment';
import * as winston from 'winston';
import {assign} from 'lodash';

const mode = process.env.NODE_ENV;

const timestamp = () => {
    return moment(new Date()).format('MM/DD HH:mm:ss');
};

const formatter = options => {
    return options.timestamp()+' | '+options.level.toUpperCase()+' | '+options.message;
};

const defaultLoggerTransportOptions = {
    timestamp,
    json:false,
    formatter
};

const exceptionLogger = (()=>{
    const transportOptions = assign({},defaultLoggerTransportOptions,{
        filename:'./logs/exceptions.log',
        handleExceptions:true,
        humanReadableUnhandledException:true,
        formatter:options => {
            return options.timestamp()+' | '+options.level.toUpperCase()+' | '+options.meta.stack.join('\n');
        }
    });
    let loggerOptions  = null;
    if(mode!=='PROD'){
        loggerOptions = {transports:[new winston.transports.Console(transportOptions)]};
    }else{
        loggerOptions = {transports:[new winston.transports.File(transportOptions)]};
    }
    return new winston.Logger(loggerOptions);
})();

export const functionalLogger = (()=>{
    const transportOptions = assign({},defaultLoggerTransportOptions,{
        filename:'./logs/functional.log'
    });
    let loggerOptions = null;
    if(mode!=='PROD'){
        loggerOptions = {transports:[new winston.transports.Console(transportOptions)]};
    }else{
        loggerOptions = {transports:[new winston.transports.File(transportOptions)]};
    }
    return new winston.Logger(loggerOptions);
})();


const processLogger = (()=>{
    const transportOptions = assign({},defaultLoggerTransportOptions,{
        filename:'./logs/process.log'
    });
    let loggerOptions = null;
    if(mode!=='PROD'){
        loggerOptions = {transports:[new winston.transports.Console(transportOptions)]};
    }else{
        loggerOptions = {transports:[new winston.transports.File(transportOptions)]};
    }
    return new winston.Logger(loggerOptions);
})();

export const logProcessedInfo = ({id,stock,count,lastDate,price,atr,vr,error,ss_url,quandl_url,nse_url}) => {
    processLogger.info(id+' | '+stock+' | '+count+' | '+lastDate+' | '+price+' | '+atr+' | '+vr+' | '+error+' | \n'+ss_url+' | \n'+nse_url+' | \n'+quandl_url);
};