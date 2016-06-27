import {Db,MongoClient} from 'mongodb';

const HOST = 'localhost';
const PORT = 27017;
const DATABASE = 'stockscope';

const CONNECTION_STRING = 'mongodb://<HOST>:<PORT>/<DATABASE>'
    .replace('<HOST>',HOST)
    .replace('<PORT>',PORT.toString())
    .replace('<DATABASE>',DATABASE);
    
let DB:Db = null;

export const connectToDb = () => {
    return new Promise((resolve,reject) => {
        MongoClient.connect(CONNECTION_STRING,(error,db) => {
            if(error){
                reject('db-connection-error');
            }else{
                DB = db;
                resolve();
            }
        });
    });
};

export const disconnectFromDb = () => {
    DB.close();
}

export const getFromDb = (collection:string,pattern) => {
    return new Promise((resolve,reject) => {
        DB.collection(collection).find(pattern).toArray((error,result) => {
            if(error){
                reject('db-query-error');
            }else{
                resolve(result);
            }
        });
    });
};

export const insertIntoDb = (collection:string,document) => {
    return new Promise((resolve,reject) => {
        DB.collection(collection).insertOne(document,error => {
            if(error){
                reject('db-insertion-error');
            }else{
                resolve();
            }
        });
    });
};