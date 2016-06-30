import * as $ from 'jquery';
import * as d3 from 'd3';
import {Chart} from './models';
import {
    SVG_WIDTH,
    SVG_HEIGHT,
    PADDING,
    CHART_WIDTH,
    CANDLE_WIDTH_FACTOR,
    SLAB_TYPES
} from '../commons/constants';

$('body').addClass('loading');

$.ajax({url:'/api'+location.search}).then(
    data => {

        const {apiUrl,slabs,type,name} = data;

        console.log('api-url : '+apiUrl);

        const candles:any[] = data.candles.slice(-180);

        const chart = new Chart({
            svg : d3.select('#chart').append('svg'),
            width:SVG_WIDTH,
            height:SVG_HEIGHT,
            padding:PADDING,
            slabs,
            dateArray:candles.map(candle => candle.date)
        });

        slabs.forEach((slab,slabIndex) => {
            switch(slab.type){
                case SLAB_TYPES.CANDLE:chart.plotCandles(candles,slab.name,slabIndex);
            }
        });

        // chart.plotCandles(candles,'price-chart',0);
        
        $('body').removeClass('loading');

    },
    error => console.log(error)
);