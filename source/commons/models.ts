export interface Candle{
    date:string;
    symbol?:string;
    open:number;
    high:number;
    low:number;
    close:number;
    volume?:number;
}

export interface DateValue{
    date:string;
    value:number;
}

export interface Point{
    x:number;
    y:number;
}

export interface Line{
    slope:number,
    intercept:number
}