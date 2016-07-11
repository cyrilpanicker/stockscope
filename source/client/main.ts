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
    PRICE_SLAB,
    ADX_SLAB,
    ATR_SLAB
} from '../commons/constants';

import {atr} from '../commons/atr';
import {diPlus,diMinus,adx} from '../commons/adx';
import {getCrosses} from '../commons/geometry';

$('body').addClass('loading');

$.getJSON('/api'+location.search).then(
    data => {
        const {apiUrl} = data;
        let {candles} = data;

        console.log(apiUrl);
        
        let atrData = atr(candles,14);
        let diPlusData = diPlus(candles,14);
        let diMinusData = diMinus(candles,14);
        let adxData = adx(candles,14);
        candles = candles.slice(-180);
        atrData = atrData.slice(-180);
        diPlusData = diPlusData.slice(-180);
        diMinusData = diMinusData.slice(-180);
        adxData = adxData.slice(-180);

        const slabs = [{
            height:PRICE_SLAB.height,
            padding:PRICE_SLAB.padding,
            minValue:d3.min(candles.map(candle => candle.low)),
            maxValue:d3.max(candles.map(candle => candle.high))
        },{
            height:ADX_SLAB.height,
            padding:ADX_SLAB.padding,
            minValue:d3.min(diPlusData.map(datum => datum.value).concat(diMinusData.map(datum => datum.value)).concat(adxData.map(datum=>datum.value))),
            maxValue:d3.max(diPlusData.map(datum => datum.value).concat(diMinusData.map(datum => datum.value)).concat(adxData.map(datum=>datum.value)))
        },{
            height:ATR_SLAB.height,
            padding:ATR_SLAB.padding,
            minValue:d3.min(atrData.map(datum=>datum.value)),
            maxValue:d3.max(atrData.map(datum=>datum.value))
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
        
        chart.plotValueAxis('di-axis',5,1);
        chart.plotCrosses(
            getCrosses(adxData,diPlusData,chart.dateScale,chart.valueScales[1]),
            'cross-diPlus',
            '#6666FF',
            1
        );
        chart.plotCrosses(
            getCrosses(adxData,diMinusData,chart.dateScale,chart.valueScales[1]),
            'cross-diMinus',
            '#FF6666',
            1
        );
        chart.plotCurve(diPlusData,'diPlus','#9999FF',1);
        chart.plotCurve(diMinusData,'diMinus','#FF9999',1);
        chart.plotCurve(adxData,'adx','black',1);
        
        chart.plotValueAxis('atr-axis',5,2);
        chart.plotCurve(atrData,'atr-chart','red',2);


        chart.onMouseMove(date => {
            const candle = candles.filter(candle => candle.date===date)[0];
            const ohlcText = 'OPEN : '+candle.open+
                ', HIGH : '+candle.high+
                ', LOW : '+candle.low+
                ', CLOSE : '+candle.close;
            chart.plotInfo(ohlcText,'price-info',0);
            chart.plotInfo('ADX : '+adxData.find(datum=>datum.date==date).value+', +DI : '+diPlusData.find(datum => datum.date==date).value
                +', -DI : '+diMinusData.find(datum => datum.date==date).value,'di-info',1);
            chart.plotInfo('ATR : '+atrData.find(datum=>datum.date==date).value,'atr-info',2);
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