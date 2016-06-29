import * as d3 from 'd3';

interface ChartPadding{
    left:number;
    right:number;
}

interface SlabPadding{
    top:number;
    bottom:number;
}

interface Slab{
    height:number;
    minValue:number;
    maxValue:number;
    padding:SlabPadding;
}

interface ChartConfig{
    svg:d3.Selection<any>;
    width:number;
    height:number;
    padding:ChartPadding;
    slabs:Slab[];
    dateArray:string[];
}

export class Chart{

    private svg:d3.Selection<any>;
    private width:number;
    private height:number;
    private chartWidth:number;
    private padding:ChartPadding;
    private dateScale:d3.scale.Ordinal<string,number>;
    private valueScales:d3.scale.Linear<number,number>[];
    private slabs:Slab[];



    constructor({svg,width,height,padding,slabs,dateArray}:ChartConfig){
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.svg.attr('width',width).attr('height',height);
        this.chartWidth = width - padding.left - padding.right;
        this.padding = padding;
        this.valueScales = [];
        this.slabs = slabs;
        var slabBase = 0;
        for(var i=0;i<slabs.length;i++){
            slabBase += slabs[i].height;
            this.valueScales[i] = d3.scale.linear()
                .domain([slabs[i].minValue,slabs[i].maxValue])
                .range([slabBase - slabs[i].padding.bottom,slabBase - slabs[i].height + slabs[i].padding.top])
        }
        this.dateScale = d3.scale.ordinal<string,number>()
            .domain(dateArray)
            .rangePoints([padding.left,width-padding.right]);
    }



    plotCandles(candles:any[],className:string,slabIndex:number){

        const {svg,dateScale,valueScales,chartWidth} = this;
        const valueScale = valueScales[slabIndex];
        const candleWidth = 0.6 * chartWidth / candles.length;
        svg.selectAll(className).remove();
        const element = svg.append('g').attr('class',className);
        
        const candleStems = element.selectAll('line.candle-stem').data(candles);
        candleStems.exit().remove();
        candleStems.enter().append('line').attr('class','candle-stem');
        candleStems
            .attr('x1',candle => dateScale(candle.date))
            .attr('y1',candle => valueScale(candle.high))
            .attr('x2',candle => dateScale(candle.date))
            .attr('y2',candle => valueScale(candle.low))
            .attr('stroke','black');
            
        const candleBodies = element.selectAll('rect.candle-body').data(candles);
        candleBodies.exit().remove();
        candleBodies.enter().append('rect').attr('class','candle-body');
        candleBodies
            .attr('x',candle => dateScale(candle.date) - 0.5 * candleWidth)
            .attr('y',candle => valueScale(d3.max([candle.open,candle.close])))
            .attr('width',_ => candleWidth)
            .attr('height',candle => ((valueScale(d3.min([candle.open,candle.close])) - valueScale(d3.max([candle.open,candle.close]))) || 0.01))
            .attr('stroke','black')
            .attr('fill',candle => candle.open > candle.close ? 'black' : 'white');

    }

}