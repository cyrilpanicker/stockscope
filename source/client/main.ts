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
        const {apiUrl,candles} = data;

        console.log('api-url : '+apiUrl);

        const slabs = [{
            height:PRICE_SLAB.height,
            padding:PRICE_SLAB.padding,
            minValue:d3.min(candles.map(candle => candle.low)),
            maxValue:d3.max(candles.map(candle => candle.high))
        }];

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
        chart.onMouseMove(date => {
            const candle = candles.filter(candle => candle.date===date)[0];
            const ohlcText = 'OPEN : '+candle.open+
                ', HIGH : '+candle.high+
                ', LOW : '+candle.low+
                ', CLOSE : '+candle.close;
            chart.plotInfo(ohlcText,'price-info',0);
        });

        chart.plotCrossHair();
        
        $('body').removeClass('loading');
    },
    error => console.log(error)
);