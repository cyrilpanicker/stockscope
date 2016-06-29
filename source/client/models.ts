import * as d3 from 'd3';

import * as moment from 'moment';

interface ChartPadding{
    right:number;
    left:number;
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

export interface ValuePlotData{
    date:string,
    value:number
}

// interface Point{
//     x:number;
//     y:number;
// }


export class Chart{

    private svg:d3.Selection<any>;
    private width:number;
    private height:number;
    private chartWidth:number;
    private padding:ChartPadding;
    private dateScale:d3.scale.Ordinal<string,number>;
    private valueScales:d3.scale.Linear<number,number>[];
    private slabs:Slab[];
    private crossHair:d3.Selection<any>;
    private mouseMoveHandler:(date:string)=>void;

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
                .domain([slabs[i].minValue, slabs[i].maxValue])
                .range([slabBase - slabs[i].padding.bottom, slabBase - slabs[i].height + slabs[i].padding.top]);
            
        }
        this.dateScale = d3.scale.ordinal<string,number>().domain(dateArray)
            .rangePoints([padding.left,width-padding.right]);

        this.trackMouseMovement();
    }
    
    onMouseMove(handler:(date:string)=>void){
        this.mouseMoveHandler = handler;
    }
    
    private trackMouseMovement(){
        const {svg,dateScale,valueScales,width,height,padding,slabs} = this;
        const self = this;
        svg.on('mousemove',function(){
            if(self.mouseMoveHandler || self.crossHair){
                const [x,y] = d3.mouse(this);
                const date1 = dateScale.domain()[d3.bisect(dateScale.range(),x)];
                const date2 = dateScale.domain()[d3.bisect(dateScale.range(),x) - 1];
                const date = (dateScale(date1) - x) < (x - dateScale(date2)) ? date1 : date2;
                if(date){
                    if(self.mouseMoveHandler){
                        self.mouseMoveHandler(date);
                    }
                    if(self.crossHair){
                        const valueScale = valueScales.filter(scale => {
                            const [max,min] = scale.range();
                            return max >= y && y >= min;
                        })[0];
                        let value = valueScale ? Math.round(valueScale.invert(y)*100)/100  : '';
                        self.crossHair.select('.y-cross-hair').attr('x1',dateScale(date)).attr('x2',dateScale(date));
                        self.crossHair.select('.x-cross-hair').attr('y1',y).attr('y2',y);
                        self.crossHair.select('.y-value').attr('y',y).text(value);
                        self.crossHair.select('.x-value').attr('x',x).text(moment(date).format('M/D'));
                    }
                }
            }
        });
    }
    
    plotCrossHair(){
        const {svg,dateScale,height,width,padding,slabs} = this;
        svg.selectAll('.cross-hair').remove();
        this.crossHair = this.svg.append('g').attr('class','cross-hair')
        this.crossHair.append('line')
            .attr('class','x-cross-hair')
            .attr('x1',0).attr('x2',width);
        this.crossHair.append('line')
            .attr('class','y-cross-hair')
            .attr('y1',0).attr('y2',height);
        this.crossHair.append('text').attr('class','x-value')
            .attr('stroke','black')
            .attr('y',slabs[0].padding.top+5)
            .attr('font-size',10);
        this.crossHair.append('text').attr('class','y-value')
            .attr('stroke','black')
            .attr('x',width-padding.right+20)
            .attr('font-size',10);
    }
    
    plotInfo(text:string,className:string,slabIndex:number){
        const {svg,width,padding,slabs} = this;
        let textElement;
        const offset = d3.sum(
            slabs
                .filter((slab,index)=>index<slabIndex)
                .map(slab => slab.height)
        );
        if(svg.select('.'+className).empty()){
            textElement = svg.append('g').attr('class',className).append('text')
                .attr('font-size',10)
                .attr('x',width-padding.right)
                .attr('y',offset+slabs[slabIndex].padding.top)
                .attr('text-anchor','end');
        } else{
            textElement = svg.select('.'+className+' text');
        }
        textElement.text(text);
    }
    
    plotDateAxis(className:string){
        const {svg,dateScale} = this;
        svg.selectAll(className).remove();
        const element = svg.append('g').attr('class',className);
        const dateAxis =  d3.svg.axis()
            .scale(dateScale)
            .tickValues(dateScale.domain().filter((_,index,array) => !(index%5) || index == array.length-1))
            .tickFormat(dateString => moment(dateString).format('M/D'));
        dateAxis(element);
    }
    
    plotValueAxis(className:string,ticks:number,slabIndex:number){
        const {svg,valueScales} = this;
        const valueScale = valueScales[slabIndex];
        const translate = this.padding.left + this.chartWidth + 10;
        svg.selectAll(className).remove();
        const element = svg.append('g')
            .attr('class',className)
            .attr('transform','translate('+translate+',0)');
        const valueAxis = d3.svg.axis()
            .scale(valueScale)
            .orient('right')
            .ticks(ticks);
        valueAxis(element);
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
    
    plotCurve(data:ValuePlotData[],className:string,color:string,slabIndex:number){

        const {svg,dateScale,valueScales} = this;
        const valueScale = valueScales[slabIndex];
        svg.selectAll(className).remove();
        const element = svg.append('g').attr('class',className);
        
        const pathGenerator = d3.svg.line().interpolate('linear');
        
        const pathMapper = () => {
            const coOrdinatesArray = data.map(datum => {
                const coOrdinates:[number,number]=[0,0];
                coOrdinates[0] = dateScale(datum.date);
                coOrdinates[1] = valueScale(datum.value);
                return coOrdinates;
            });
            return pathGenerator(coOrdinatesArray);
        };
        
        element.append('path')
            .attr('stroke',color)
            .attr('fill','none')
            .attr('d',pathMapper);

    }
    
    plotBars(bars:ValuePlotData[],className:string,slabIndex:number){
        const {svg,chartWidth,dateScale,valueScales,slabs} = this;
        const valueScale = valueScales[slabIndex];
        const barWidth = 0.6 * chartWidth / bars.length;
        let slabBase = 0;
        for(var i=0;i<=slabIndex;i++){slabBase += slabs[i].height;}
        svg.selectAll(className).remove();
        const element = svg.append('g').attr('class',className);
        const barSet = element.selectAll('.bar').data(bars);
        const min = d3.min(bars.map(bar=>bar.value));
        const max = d3.max(bars.map(bar=>bar.value));
        const delta = (max-min)/3;
        const oneThird = min + delta;
        const twoThirds = oneThird + delta;
        const colorScale = d3.scale.linear<string>()
            .domain([min,oneThird,twoThirds,max])
            .range(['yellow','orange','red','brown']);
        barSet.enter().append('rect').attr('class','bar');
        barSet
            .attr('x',datum => dateScale(datum.date)-0.5*barWidth)
            .attr('y',datum => valueScale(datum.value))
            .attr('width',barWidth)
            .attr('height',datum => slabBase - slabs[slabIndex].padding.bottom - valueScale(datum.value))
            .attr('stroke',datum=>colorScale(datum.value))
            .attr('fill',datum=>colorScale(datum.value));
    }
    
    plotPivots(candles:any[],className:string,color:string,property:string,candleWidth:number,slabIndex:number){
        const {svg,dateScale,valueScales,chartWidth} = this;
        const valueScale = valueScales[slabIndex];
        svg.selectAll(className).remove();
        const element = svg.append('g').attr('class',className);
        const lines = element.selectAll('line').data(candles);
        lines.enter().append('line');
        lines
            .attr('y1',datum => valueScale(datum[property]))
            .attr('y2',datum => valueScale(datum[property]))
            .attr('x1',datum => dateScale(datum.date)-2.5*candleWidth)
            .attr('x2',datum => dateScale(datum.date)+2.5*candleWidth)
            .attr('stroke',color)
            .style('stroke-dasharray',('3,3'));
    }
    

    
    // getPoint(date:string,value:number,slab:number){
    //     return {
    //         x:this.dateScale(date),
    //         y:-this.valueScales[slab](value)
    //     };
    // }
    
    // getLine(point1:Point,point2:Point){
    //     const slope = (point2.y - point1.y)/(point2.x - point1.x);
    //     return {
    //         slope,
    //         intercept: point1.y - slope*point1.x
    //     };
    // }
    

    
    

    

    

    

    
    // plotResistanceLines(candles:Candle[],slab:number){
    //     for(let i = 0; i<candles.length-1 ; i++){
    //         const point1 = this.getPoint(candles[i].date,candles[i].low,slab);
    //         for(let j=i+1; j<candles.length; j++){
    //             let point2 = this.getPoint(candles[j].date,candles[j].low,slab);
    //             let line = this.getLine(point1,point2);
    //             for(let k=i+1;k<=j-1;k++){
    //                 let point12 = this.getPoint(candles[k].date,candles[k].low,slab);
    //                 let distance = (point12.x*line.slope+line.intercept) - point12.y;
    //                 if(distance > -0.0001 && distance < 0.0001){
    //                     let point3;
    //                     if(line.slope === 0){
    //                         console.log(candles[i].date+', '+candles[k].date+', '+candles[j].date);
    //                         point3 = {x:this.width,y:line.intercept};
    //                         this.plotLine(point1,point3,'support','black');
    //                     } else if (line.slope > 0 ) {
    //                         point3 = {x:-line.intercept/line.slope,y:0};
    //                         this.plotLine(point1,point3,'up-trend','#DCD9CD');
    //                     } else {
    //                         point3 = {x:(-this.height+this.padding.bottom-line.intercept)/line.slope,y:-this.height+this.padding.bottom};
    //                         //this.plotLine(point1,point3,'down-trend','cyan');
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    
    // plotSupportLines(candles:Candle[],slab:number){
    //     const lines = [];

    //     for(let i = 0; i<candles.length-1 ; i++){
    //         const point1 = this.getPoint(candles[i].date,candles[i].low,slab);
    //         for(let j=i+1; j<candles.length; j++){

    //             let point3;
    //             let point2 = this.getPoint(candles[j].date,candles[j].low,slab);
    //             let line = this.getLine(point1,point2);
    //             for(let k=i+1;k<=j-1;k++){
    //                 let point12 = this.getPoint(candles[k].date,candles[k].low,slab);
    //                 let delta = (point12.x*line.slope+line.intercept) - point12.y;
    //                 if(delta > -0.00001 && delta < 0.00001){
    //                     if(line.slope === 0){
    //                         point3 = {x:this.width,y:line.intercept};
    //                         lines.push({point1,point12,point3});
    //                     } else if (line.slope > 0 ) {
    //                         point3 = {x:-line.intercept/line.slope,y:0};
    //                         lines.push({point1,point12,point3});
    //                     }
    //                 }
    //                 // if(distance > -0.00001 && distance < 0.00001){
    //                 //     let point3;
    //                 //     if(line.slope === 0){
    //                 //         point3 = {x:this.width,y:line.intercept};
    //                 //         this.plotLine(point1,point3,'support','black');
    //                 //     } else if (line.slope > 0 ) {
    //                 //         point3 = {x:-line.intercept/line.slope,y:0};
    //                 //         this.plotLine(point1,point3,'support-trend','#DCD9CD');
    //                 //     } else {
    //                 //         // point3 = {x:(-this.height+this.padding.bottom-line.intercept)/line.slope,y:-this.height+this.padding.bottom};
    //                 //         // this.plotLine(point1,point3,'down-trend','#DCD9CD');
    //                 //     }
    //                 // }
    //             }
                
    //             point2 = this.getPoint(candles[j].date,candles[j].high,slab);
    //             line = this.getLine(point1,point2);
    //             for(let k=i+1;k<=j-1;k++){
    //                 let point12 = this.getPoint(candles[k].date,candles[k].low,slab);
    //                 let distance = (point12.x*line.slope+line.intercept) - point12.y;
    //                 if(distance > -0.00001 && distance < 0.00001){
    //                     if(line.slope === 0){
    //                         point3 = {x:this.width,y:line.intercept};
    //                         lines.push({point1,point12,point3});
    //                     } else if (line.slope > 0 ) {
    //                         point3 = {x:-line.intercept/line.slope,y:0};
    //                         lines.push({point1,point12,point3});
    //                     }
    //                 }
    //             }


    //         }
    //     }
        
    //     for(let i = 0; i<lines.length ; i++){
    //         let priority;
    //         let color;
    //         var {point1,point12,point3} = lines[i];
    //         if(point1.y === point3.y){
    //             priority = 3;
    //         } else {
    //             priority = lines.filter(function(line){
    //                 return line.point1.x === point1.x &&
    //                 line.point1.y === point1.y &&
    //                 line.point3.x === point3.x &&
    //                 line.point3.y === point3.y;
    //             }).length;
    //         }
    //         lines[i].priority = priority;
    //     }
    //     // lines.filter(line => line.priority===1).forEach(line => {
    //     //     const {point1,point3} = line;
    //     //     this.plotLine(point1,point3,'support','#DCD9CD');
    //     // });
    //     lines.filter(line => line.priority!==1).forEach(line => {
    //         const {point1,point3} = line;
    //         this.plotLine(point1,point3,'support','black');
    //         console.log(line);
    //     });
    // }
    
    // plotLine(point1:Point,point2:Point,className:string,color:string){
    //     this.svg.append('g')
    //         .attr('class',className)
    //         .append('line')
    //             .attr('x1',point1.x)
    //             .attr('y1',-point1.y)
    //             .attr('x2',point2.x)
    //             .attr('y2',-point2.y)
    //             .attr('stroke',color)
    //             .style('stroke-dasharray',('3,3'))
    //             .style('stroke-opacity', 0.9);
    // }
    

    
}