import * as $ from 'jquery';
import * as d3 from 'd3';
import './styles/main';

import {Chart} from './models';
import {
    SVG_WIDTH,
    PADDING,
    VALUE_WIDTH_FACTOR,
    SLAB_TYPES,
    VALUE_AXIS_TICKS,
    PRICE_SLAB
} from '../commons/constants';

import {atr} from '../commons/atr';
import {diPlus,diMinus} from '../commons/adx';

$('body').addClass('loading');

$.getJSON('/api'+location.search).then(
    data => {
        const {apiUrl} = data;
        let {candles} = data;

        console.log(apiUrl);
        
        let atrData = atr(candles,14);
        let diPlusData = diPlus(candles,14);
        let diMinusData = diMinus(candles,14);
        candles = candles.slice(-180);
        atrData = atrData.slice(-180);
        diPlusData = diPlusData.slice(-180);
        diMinusData = diMinusData.slice(-180);

        const slabs = [{
            height:PRICE_SLAB.height,
            padding:PRICE_SLAB.padding,
            minValue:d3.min(candles.map(candle => candle.low)),
            maxValue:d3.max(candles.map(candle => candle.high))
        },{
            height:110,
            minValue:d3.min(atrData.filter(atrDatum => atrDatum.value!==null).map(atrDatum => atrDatum.value)),
            maxValue:d3.max(atrData.filter(atrDatum => atrDatum.value!==null).map(atrDatum => atrDatum.value)),
            padding:{top:10,bottom:10}
        },{
            height:110,
            minValue:d3.min(diPlusData.map(datum => datum.value).concat(diMinusData.map(datum => datum.value))),
            maxValue:d3.max(diPlusData.map(datum => datum.value).concat(diMinusData.map(datum => datum.value))),
            padding:{top:10,bottom:10}
        },{
            height:110,
            minValue:d3.min(candles.map(candle => candle.volume)),
            maxValue:d3.max(candles.map(candle => candle.volume)),
            padding:{top:10,bottom:10}
        }];

// {
//             height:100,
//             minValue:d3.min(candles.map(candle => candle.volume)),
//             maxValue:d3.max(candles.map(candle => candle.volume)),
//             padding:{top:10,bottom:0}
//         }

        const height = d3.sum(slabs.map(slab => slab.height));

        const chart = new Chart({
            svg : d3.select('#chart').append('svg'),
            width:SVG_WIDTH,
            padding:PADDING,
            slabs,height,
            valueWidthFactor:VALUE_WIDTH_FACTOR,
            dateArray:candles.map(candle => candle.date)
        });

        chart.plotDateAxis('date-axis');


        chart.plotValueAxis('price-axis',VALUE_AXIS_TICKS,0);
        chart.plotCandles(candles,'price-chart',0);
        
        chart.plotValueAxis('atr-axis',5,1);
        chart.plotCurve(atrData,'atr','blue',1);
        
        chart.plotValueAxis('di-axis',5,2);
        chart.plotCurve(diPlusData,'diPlus','blue',2);
        chart.plotCurve(diMinusData,'diMinus','red',2);

        chart.plotValueAxis('volume-axis',5,3);
        chart.plotBars(candles.map(candle => {
            return {date:candle.date,value:candle.volume};
        }),'volume-chart',3);

        // chart.plotCurve(candles.map(candle => {
        //     return {date:candle.date,value:candle.high};
        // }),'high','red',0);

        // chart.plotCurve(candles.map(candle => {
        //     return {date:candle.date,value:candle.low};
        // }),'low','blue',0);

        chart.onMouseMove(date => {
            const candle = candles.filter(candle => candle.date===date)[0];
            const ohlcText = 'OPEN : '+candle.open+
                ', HIGH : '+candle.high+
                ', LOW : '+candle.low+
                ', CLOSE : '+candle.close;
            chart.plotInfo(ohlcText,'price-info',0);
            chart.plotInfo('ATR : '+atrData.find(atrDatum => atrDatum.date==date).value,'atr-info',1);
            chart.plotInfo('+DI : '+diPlusData.find(datum => datum.date==date).value
                +', -DI : '+diMinusData.find(datum => datum.date==date).value,'di-info',2);
            chart.plotInfo('VOLUME : '+candle.volume,'volume-info',3);
        });

        chart.plotCrossHair();
        
        $('body').removeClass('loading');
    },
    error => {
        console.log(error);
        $('#chart').text(error.responseText);
        $('body').removeClass('loading');
    }
);