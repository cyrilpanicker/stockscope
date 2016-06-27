import * as fs from 'fs';

export const readFile = (file:string) => {
    return new Promise((resolve,reject) => {
        fs.readFile(file,(error,data) => {
            if(error){
                reject(error);
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