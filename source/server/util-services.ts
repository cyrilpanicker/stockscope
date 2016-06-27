import * as fs from 'fs';
import * as moment from 'moment';

export const readFile = (file:string) => {
    return new Promise((resolve,reject) => {
        fs.readFile(file,(error,data) => {
            if(error){
                reject('file-read-error');
            }else{
                resolve(data.toString());
            }
        });
    });
};

export const delay = (time:number) => {
    return new Promise((resolve,reject) => {
        setTimeout(resolve,time);
    });
};

export const log = (message:string) => {
    const stamp = moment(new Date()).format('MM/DD HH:mm')+' | ';
    console.log(stamp+message);
}