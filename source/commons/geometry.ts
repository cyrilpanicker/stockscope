import {DateValue,Point,Line} from './models'
import * as d3 from 'd3';

// import {getCandles} from '../server/services/quandl-service';
// import {diPlus,diMinus,adx} from './adx';
// import {ADX_SLAB,SVG_WIDTH,PADDING} from './constants';

export const getPoint = (
    datum:DateValue,
    dateScale:d3.scale.Ordinal<string,number>,
    valueScale:d3.scale.Linear<number,number>
) => {
    const point:Point ={x:null,y:null};
    point.x = dateScale(datum.date);
    point.y = -valueScale(datum.value);
    return point;
};

export const getLine = (
    point1:Point,
    point2:Point
) => {
    const line:Line = {slope:null,intercept:null};
    line.slope = (point2.y - point1.y)/(point2.x - point1.x);
    line.intercept = point1.y - line.slope*point1.x;
    return line;
};

export const getLineIntersection = (
    line1:Line,
    line2:Line
) => {
    const point:Point = {x:null,y:null};
    point.x = (line2.intercept - line1.intercept)/(line1.slope - line2.slope);
    point.y = (line2.slope*line1.intercept - line1.slope*line2.intercept)/(line2.slope - line1.slope);
    return point;
};

export const getCrosses = (
    data1:DateValue[],
    data2:DateValue[],
    dateScale:d3.scale.Ordinal<string,number>,
    valueScale:d3.scale.Linear<number,number>
) => {
    const result:Point[] = [];
    for(let i=1;i<data1.length;i++){
        const point11 = getPoint(data1[i-1],dateScale,valueScale);
        const point12 = getPoint(data1[i],dateScale,valueScale);
        const point21 = getPoint(data2[i-1],dateScale,valueScale);
        const point22 = getPoint(data2[i],dateScale,valueScale);
        const line1 = getLine(point11,point12);
        const line2 = getLine(point21,point22);
        const intersection = getLineIntersection(line1,line2);
        if(point11.x < intersection.x && intersection.x <= point12.x){
            result.push(intersection);
        }
    }
    return result;
};


// getCandles({stock:'RELIANCE',endDate:new Date()}).then(
//     (candles:any) => {
//         let diPlusData = diPlus(candles,14);
//         let diMinusData = diMinus(candles,14);
//         let adxData = adx(candles,14);
//         candles = candles.slice(-180);
//         diPlusData = diPlusData.slice(-180);
//         diMinusData = diMinusData.slice(-180);
//         adxData = adxData.slice(-180);
//         const valueScale = d3.scale.linear()
//             .domain([
//                 d3.min(diPlusData.map(datum => datum.value).concat(diMinusData.map(datum => datum.value)).concat(adxData.map(datum=>datum.value))),
//                 d3.max(diPlusData.map(datum => datum.value).concat(diMinusData.map(datum => datum.value)).concat(adxData.map(datum=>datum.value)))
//             ])
//             .range([ADX_SLAB.height - ADX_SLAB.padding.bottom, ADX_SLAB.padding.top]);
//         const dateScale = d3.scale.ordinal<string,number>()
//             .domain(adxData.map(datum=>datum.date))
//             .rangePoints([PADDING.left,SVG_WIDTH-PADDING.right]);
            
//         const point1 = getPoint(adxData[adxData.length-3],dateScale,valueScale);
//         const point2 = getPoint(adxData[adxData.length-2],dateScale,valueScale);
//         const point3 = getPoint(adxData[adxData.length-1],dateScale,valueScale);
//         console.log(point1);
//         console.log(point2);
//         console.log(point3);
        
//         const line1 = getLine(point1,point2);
//         const line2 = getLine(point2,point3);
//         console.log(line1);
//         console.log(line2);
        
//         const intersection = getLineIntersection(line1,line2);
//         console.log(intersection);
        
//         console.log(getCrosses(adxData.slice(-25),diPlusData.slice(-25),dateScale,valueScale));

//     },
//     error => {
//         console.log(error);
//     }
// );