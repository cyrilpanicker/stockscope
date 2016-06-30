var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:{
        'main':'./build/client/main',
        'libs':[
        ]
    },
    output:{
        path:'./build/client-public',
        filename:'app.js'
    },
    devtool:[
        'source-map'
    ],
    resolve:{
        extensions:['','.js']
    },
    module:{
        loaders:[
            // {test:/\.css$/,loader:'style-loader!css-loader'}
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./build/client/templates/_index.html'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'libs',
            filename:'libs.js'
        })
    ]
};