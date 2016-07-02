import {getCandleData,getCandleDataUrl} from './services/nse-service';
import {functionalLogger} from './services/logging-service';

getCandleData({stock:'acc'}).then(
    (data:string) => {
        console.log(data);
    },
    error => console.log(error)
)

console.log(getCandleDataUrl({stock:'acc'}));