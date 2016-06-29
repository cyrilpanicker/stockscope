import * as $ from 'jquery';
import * as d3 from 'd3';
import {Chart} from './models';

$.ajax({url:'/api?'+location.hash.substring(1)}).then(
    data => {

        const candles:any[] = data.candles.slice(-180);
        const width = 1333;
        const height = 700;
        const padding = {left:10,right:60};
        const chartWidth = width - padding.left - padding.right;
        const candleWidth = 0.6 * chartWidth/candles.length;

        const chart = new Chart({
            svg : d3.select('#chart').append('svg'),
            width,height,padding,
            dateArray:candles.map(candle => candle.date),
            slabs:[{
                height:300,
                minValue:d3.min(candles.map(candle => candle.low)),
                maxValue:d3.max(candles.map(candle => candle.high)),
                padding:{top:30,bottom:0}
            },{
                height:100,
                minValue:d3.min(candles.map(candle => candle.volume)),
                maxValue:d3.max(candles.map(candle => candle.volume)),
                padding:{top:10,bottom:0}
            }]
        });

        chart.plotCandles(candles,'price-chart',0);

    },
    error => console.log(error)
);