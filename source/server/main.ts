import * as express from 'express';
import {getCandleData} from './yahooService';

getCandleData({
    stock:'RELIANCE',
    endDate:new Date()
}).then(console.log.bind(console),console.log.bind(console));