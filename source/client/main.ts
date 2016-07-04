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

$('body').addClass('loading');

$.getJSON('/api'+location.search).then(
    data => {
        const {apiUrls,candles} = data;

        console.log(apiUrls.nse);
        console.log(apiUrls.yahoo);

        const slabs = [{
            height:PRICE_SLAB.height,
            padding:PRICE_SLAB.padding,
            minValue:d3.min(candles.map(candle => candle.low)),
            maxValue:d3.max(candles.map(candle => candle.high))
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

        chart.plotValueAxis('volume-axis',5,1);
        chart.plotBars(candles.map(candle => {
            return {date:candle.date,value:candle.volume};
        }),'volume-chart',1);

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
            chart.plotInfo('VOLUME : '+candle.volume,'volume-info',1);
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