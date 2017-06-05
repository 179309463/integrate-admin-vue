var gulp = require('gulp'),

    webpack = require('webpack'),
    postcssautoprefixer = require('autoprefixer'),
    postcssclean = require('postcss-clean'),
    extractTextPlugin = require('extract-text-webpack-plugin'),
    uglify = require('gulp-uglify'),

    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),

    copy = require('gulp-copy'),
    clean = require('gulp-clean'),

    util = require('gulp-util'),
    notify = require('gulp-notify'),

    path = require('path'),
    fs = require('fs'),
    crypto = require('crypto'),

    through = require('through2'),
    sequence = require('gulp-sequence'),
    _ = require('underscore'),
    q = require('q'),
    walk = require('walk'),

    webPackConfig = {
        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js',
            path: 'dev',
            publicPath: '../'
        },
        plugins: [
            //文件单独提取插件
            new extractTextPlugin('css/element-ui.css', {
                allChunks: true,
                disable: false
            }),
        ],
        module: {
            //加载器配置
            loaders: [
                //.js 文件使用 babel-loader 来编译处理
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loaders: ['es3ify-loader', 'babel-loader']
                },
                //less 文件先通过 less-load 处理成 css，然后再通过 css-loader 加载成 css 模块，最后由 extractTextPlugin 插件通过 style-loader 加载器提取出 css 文件
                {
                    test: /\.less$/,
                    loader: 'style-loader!css-loader!postcss-loader!less-loader'
                },
                //css 文件先通过 css-loader 加载成 css 模块，最后由 extractTextPlugin 插件通过 style-loader 加载器提取出 css 文件
                {
                    test: /\.css$/,
                    loader: extractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader')
                },
                //图片文件使用 file-loader 来处理
                {
                    test: /\.(png|jpg|gif)$/,
                    exclude: /src\/img/,
                    loader: 'file-loader?name=app-img/[name]-[hash].[ext]'
                },
                //字体文件使用 file-loader 来处理
                {
                    test: /\.(eot|svg|ttf|woff)\??.*$/,
                    loader: 'file-loader?name=font/[name].[ext]?[hash]'
                }
            ]
        },

        babel: {
            presets: ['es2015']//es2015 用于支持 ES6 语法
        },

        postcss: [postcssautoprefixer({browsers: [
            'last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
        ]}), postcssclean({
            compatibility: 'ie7'
        })],

        //其它解决方案配置
        resolve: {
            //查找 module 的话从这里开始查找
            root: __dirname + '\src',
            //自动扩展文件后缀名，意味着我们 require 模块可以省略不写后缀名
            extensions: ['', '.js', '.json', '.less'],
            //模块别名定义，方便后续直接引用别名，无须多写长长的地址
            alias: {
                'vue': path.resolve(__dirname, 'node_modules/vue/dist/vue.min.js'),
                'vue-resource': path.resolve(__dirname, 'node_modules/vue-resource/dist/vue-resource.js'),
                'q': path.resolve(__dirname, 'node_modules/q/q.js'),
                'element-style': path.resolve(__dirname, 'node_modules/element-ui/lib/theme-default/index.css')
            }
        }
    };

//控制台错误处理
function handleErrors () {
    var args = Array.prototype.slice.call(arguments);

    notify.onError({
        title : 'compile error',
        message : '<%= error.message %>'
    }).apply(this, args);//替换为当前对象

    this.emit();//提交
}

//webPack构建封装
function webPackBuild (type) {
    var mainDef = q.defer(),
        readDirDef = q.defer(),
        entry = {},
        walker  = walk.walk('src/app/', {
            followLinks: false
        });

    walker.on('file', function (root, fileStat, next) {
        if (fileStat.name.indexOf('.main.js') != -1) {
            entry[root.split('src')[1]] = path.resolve(root, fileStat.name);
        }
        next();
    });

    walker.on('end', function () {
        readDirDef.resolve(entry);
    });

    walker.on('errors', function (root, nodeStatsArray, next) {
        nodeStatsArray.forEach(function (n) {
            console.error('[ERROR] ' + n.name);
            console.error(n.error.message || (n.error.code + ': ' + n.error.path));
        });
        next();
    });

    readDirDef.promise.then(function (entry) {
        var config = _.extend({
                entry: entry
            }, webPackConfig),
            flag = true;

        if (type == 'dev') {

            webpack(config).watch({
                aggregateTimeout: 300,
                poll: true
            }, function(err, stats) {
                console.log(stats.toString({
                    chunks: false, // Makes the build much quieter
                    colors: true
                }));

                if (err) {
                    mainDef.reject('webpack编译出错');
                }

                if (flag) {
                    mainDef.resolve();
                    flag = false;
                }
            });

        } else {
            webpack(config, function (err, stats) {
                console.log(stats.toString({
                    chunks: false, // Makes the build much quieter
                    colors: true
                }));
                mainDef.resolve();
            });
        }
    }, function () {
        mainDef.reject('遍历目录过程出错');
    });

    return mainDef.promise.then(function () {
        console.log('webpack 任务执行完毕');
    }, function (reason) {
        console.log(reason);
    });
}

//静态资源添加版本号插件
function addAssetVer (options) {
    var ASSET_REG = {
            SCRIPT: /(<script[^>]+src=)['"]([^'"]+)["']/ig,
            STYLESHEET: /(<link[^>]+href=)['"]([^'"]+)["']/ig,
            IMAGE: /(<img[^>]+src=)['"]([^'"]+)["']/ig,
            BACKGROUND: /(url\()(?!data:|about:)([^)]*)/ig
        },
        createHash = function (file, len) {
            return crypto.createHash('md5').update(file).digest('hex').substr(0, len);
        };

    return through.obj(function (file, enc, cb) {

        options = options || {};

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new util.PluginError('addAssetVer', 'Streaming not supported'));
            return cb();
        }

        var content = file.contents.toString();

        var filePath = path.dirname(file.path);

        for (var type in ASSET_REG) {
            if ( !(type === 'BACKGROUND' && !/\.(css|scss|less)$/.test(file.path)) ) {

                content = content.replace(ASSET_REG[type], function (str, tag, src) {

                    src = src.replace(/\?[\s\S]+$/, '').replace(/(^['"]|['"]$)/g, '');

                    if (!/\.[^\.]+$/.test(src)) {
                        return str;
                    }

                    if (options.verStr) {
                        src += options.verStr;
                        return tag + '"' + src + '"';
                    }

                    // remote resource
                    if (/^https?:\/\//.test(src)) {
                        return str;
                    }

                    var assetPath = null;

                    if (type === 'IMAGE') {
                        assetPath = path.join(typeof options.tplImgPathBase != 'undefined' ? options.tplImgPathBase : filePath, src);
                    } else {
                        assetPath = path.join(filePath, src);
                    }

                    if (src.indexOf('/') == 0) {
                        if (options.resolvePath && typeof options.resolvePath === 'function') {
                            assetPath = options.resolvePath(src);
                        } else {
                            assetPath = (options.rootPath || '') + src;
                        }
                    }

                    if (fs.existsSync(assetPath)) {

                        var buf = fs.readFileSync(assetPath),
                            md5 = createHash(buf, options.hashLen || 12),
                            verStr = (options.verConnecter || '') + md5;

                        src = src + '?v=' + verStr;
                    } else {
                        return str;
                    }

                    return tag + '"' + src + '"';
                });
            }
        }

        file.contents = new Buffer(content);
        this.push(file);
        cb();
    });
}

gulp.task('addAssetVer', function () {
    var stream = gulp.src('dist/view/**/*')
        .pipe(addAssetVer())
        .on('error', handleErrors)
        .pipe(gulp.dest('dist/view'))

    return stream;
});

gulp.task('commonStyle', function () {
    var stream = gulp.src('src/common/less/*.less')
        .pipe(less())
        .on('error', handleErrors)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .on('error', handleErrors)
        .pipe(addAssetVer())
        .on('error', handleErrors)
        .pipe(gulp.dest('dev/common/css'))
        .pipe(cleancss())
        .pipe(gulp.dest('dist/common/css'));

    return stream;
});

gulp.task('commonScript', function () {
    var stream = gulp.src('src/common/js/*.js')
        .pipe(gulp.dest('dev/common/js'))
        .pipe(uglify())
        .on('error', handleErrors)
        .pipe(gulp.dest('dist/common/js'));

    return stream;
});

gulp.task('copy:dev', function () {
    var stream = gulp.src(['src/img/common/**/*', 'src/lib/**/*', 'src/font/**/*', 'src/view/**/*', 'src/data/**/*'])
        .pipe(copy('dev', {
            prefix : 1
        }));

    return stream;
});

gulp.task('copy:dist', function () {
    var stream = gulp.src(['src/img/common/**/*', 'src/lib/**/*', 'src/font/**/*', 'src/view/**/*', 'src/data/**/*'])
        .pipe(copy('dist', {
            prefix : 1
        }));

    return stream;
});

gulp.task('clean', function () {
    var stream = gulp.src(['dev', 'dist'])
        .pipe(clean({
            force: true
        }));
    return stream;
});

gulp.task('webpack:watch', function () {
    return webPackBuild('dev');
});

gulp.task('webpack:compile', function () {
    return webPackBuild();
});

gulp.task('webpack:uglify', function () {
    var stream = gulp.src('dev/app/**/*')
        .pipe(uglify())
        .on('error', handleErrors)
        .pipe(gulp.dest('dist/app/'));

    return stream;
});

gulp.task('webpack:copy', function () {
    var stream = gulp.src(['dev/app-img/**/*', 'dev/css/**/*', 'dev/font/**/*'])
        .pipe(copy('dist', {
            prefix : 1
        }));

    return stream;
});

gulp.task('webpack:build', ['webpack:compile'], function (cb) {
    sequence(['webpack:uglify', 'webpack:copy'])(cb);
});

gulp.task('watch:copy', function () {
    gulp.watch(['src/img/common/*', 'src/lib/**/*', 'src/font/**/*', 'src/view/**/*', 'src/data/**/*'], function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running commonStyle tasks...');
        gulp.start(['copy:dev', 'copy:dist']);
    });
});

gulp.task('watch:script', function () {
    gulp.watch('src/common/js/**/*', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running commonStyle tasks...');
        gulp.start('commonScript');
    });
});

gulp.task('watch:style', function () {
    gulp.watch(['src/common/less/**/*', 'style-config/public.less'], function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running commonStyle tasks...');
        gulp.start('commonStyle');
    });
});

gulp.task('watch:webpack-script', function () {
    gulp.watch('dev/app/**/*', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running webpack:uglify tasks...');
        gulp.start('webpack:uglify');
    });
});

gulp.task('watch:webpack-img', function () {
    gulp.watch('dev/app-img/**/*', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running webpack:copy tasks...');
        gulp.start('webpack:copy');
    });
});

gulp.task('watch:webpack-css', function () {
    gulp.watch('dev/css/**/*', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running webpack:copy tasks...');
        gulp.start('webpack:copy');
    });
});

gulp.task('watch', ['watch:copy', 'watch:script', 'watch:style', 'webpack:watch', 'watch:webpack-script', 'watch:webpack-img']);

gulp.task('build', function (cb) {
    sequence('clean', ['copy:dev', 'copy:dist', 'commonStyle', 'commonScript', 'webpack:build'], 'addAssetVer')(cb);
});

gulp.task('default', function () {
    gulp.start('build');
});
