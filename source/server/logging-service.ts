import * as moment from 'moment';

export const logMessage = (message:string) => {
    const stamp = moment(new Date()).format('MM/DD HH:mm');
    console.log(stamp+' | '+message);
}

export const logProcessMessage = ({id,stock,count,error,url}) => {
    const stamp = moment(new Date()).format('MM/DD HH:mm');
    const message = stamp+' | '+id+' | '+stock+' | '+count+' | '+error+' | '+url;
    console.log(message);
}