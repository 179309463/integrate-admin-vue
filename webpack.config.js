/**
 * 配置的打包文件
 */
var path = require('path'),
    webpack = require('webpack'),
    htmlWebpackPlugin = require('html-webpack-plugin'),
    extractTextPlugin = require('extract-text-webpack-plugin'),
    babiliPlugin = require('babili-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    cssClean = require('postcss-clean'),
    vue = require('vue-loader');

module.exports = {
    //JS文件引用入口配置
    entry: {
        common: ['vue', 'vue-router', 'vuex', 'vuex-logger', 'vue-resource', 'q'],
        element: ['element-ui'],
        app: [
            path.resolve(__dirname, './src/js/app.js')
        ]
    },

    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, './dist/'), //指定生成文件的保存路径
        publicPath: '../', //更新 src、url 里的值，为其添加前缀（实际输出：publicPath + fileName）
        filename: 'js/[name].js?v=[hash:8]',
        chunkFilename: 'js/modules/[name].js?v=[hash:8]'
    },

    //插件项
    plugins: [
        //html 文件生成插件
        new htmlWebpackPlugin({
            title: 'admin-sys',
            filename: 'index.html',
            template: 'src/index.html',
            hash: true
        }),
        //文件单独提取插件
        new extractTextPlugin('css/style.css', {
            allChunks: true,
            disable: false
        }),
        //公共组件提取插件
        new webpack.optimize.CommonsChunkPlugin({
            name: ['common', 'element']
        }),
        //JS压缩插件
        new babiliPlugin()
    ],

    vue: {
        loaders: {
            css: extractTextPlugin.extract('css')
        }
    },

    postcss: [autoprefixer({browsers: [
        'last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
    ]}), cssClean({
        compatibility: 'ie7'
    })],

    module: {
        //指定没有依赖的模块，webpack将不再扫描这个文件中的依赖
        noParse: [],
        //加载器配置
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            //less 文件先通过 less-load 处理成 css，然后再通过 css-loader 加载成 css 模块，最后由 extractTextPlugin 插件通过 style-loader 加载器提取出 css 文件
            {
                test: /\.less$/,
                loader: extractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')
            },
            //css 文件先通过 css-loader 加载成 css 模块，最后由 extractTextPlugin 插件通过 style-loader 加载器提取出 css 文件
            {
                test: /\.css$/,
                loader: extractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader')
            },
            //图片文件使用 file-loader 来处理
            {
                test: /\.(png|jpg|gif)\??.*$/,
                loader: 'file-loader?name=img/[name].[ext]?[hash]'
            },
            //字体文件使用 file-loader 来处理
            {
                test: /\.(eot|svg|ttf|woff)\??.*$/,
                loader: 'file-loader?name=font/[name].[ext]?[hash]'
            }
        ]
    },

    //其它解决方案配置
    resolve: {
        //查找 module 的话从这里开始查找
        root: __dirname + '\src',
        //自动扩展文件后缀名，意味着我们 require 模块可以省略不写后缀名
        extensions: ['', '.js', '.json', '.less'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            'vue': path.resolve(__dirname, 'node_modules/vue/dist/vue.min.js'),
            'vue-router': path.resolve(__dirname, 'node_modules/vue-router/dist/vue-router.min.js'),
            'vuex': path.resolve(__dirname, 'node_modules/vuex/dist/vuex.min.js'),
            'vuex-logger': path.resolve(__dirname, 'node_modules/vuex/dist/logger.js'),
            'vue-resource': path.resolve(__dirname, 'node_modules/vue-resource/dist/vue-resource.js'),
            'q': path.resolve(__dirname, 'node_modules/q/q.js'),
            'element-style': path.resolve(__dirname, 'node_modules/element-ui/lib/theme-default/index.css')
        }
    }
};
