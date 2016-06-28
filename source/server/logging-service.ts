import * as moment from 'moment';
import * as winston from 'winston';

const timestamp = () => {
    return moment(new Date()).format('MM/DD HH:mm:ss');
};
const formatter = options => {
    return options.timestamp()+' | '+options.level.toUpperCase()+' | '+options.message;
};

const exceptionLogger = (()=>{
    return new winston.Logger({
        transports:[
            new winston.transports.File({
                filename:'./logs/exceptions.log',
                timestamp,
                handleExceptions:true,
                humanReadableUnhandledException:true,
                json:false,
                formatter:options => {
                    return options.timestamp()+' | '+options.level.toUpperCase()+' | '+options.meta.stack.join('\n');
                }
            })
        ]
    });
})();

export const functionalLogger = (()=>{
    return new winston.Logger({
        transports:[
            // new winston.transports.Console({timestamp,formatter})
            new winston.transports.File({filename:'./logs/functional.log',timestamp,formatter,json:false})
        ]
    });
})();


const processLogger = (()=>{
    return new winston.Logger({
        transports:[
            // new winston.transports.Console({timestamp,formatter})
            new winston.transports.File({filename:'./logs/process.log',timestamp,formatter,json:false})
        ]
    });
})();

export const logProcessedInfo = ({id,stock,count,lastDate,error,url}) => {
    processLogger.info(id+' | '+stock+' | '+count+' | '+lastDate+' | '+error+' | '+url);
};