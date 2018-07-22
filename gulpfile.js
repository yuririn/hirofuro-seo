//ファイルパス
const path = {
  htdocs: 'htdocs/',
  src:    'src/common',
  dest:   'htdocs/common',
}

//gulpプラグイン
const gulp 					= require('gulp')
const browserSync 	= require('browser-sync').create()
const plumber 			= require('gulp-plumber')
const notify 				= require('gulp-notify')
const runSequence   = require('run-sequence');
//HTML系
const pug           = require('gulp-pug')
const minifyHTML    = require('gulp-minify-html')
//CSS系
const sass 					= require('gulp-sass')
const sourcemaps 		= require('gulp-sourcemaps')
const autoprefixer	= require('gulp-autoprefixer')
const mmq 					= require('gulp-merge-media-queries')
const cssmin				= require('gulp-cssmin')
//JS系
const webpack       = require('webpack-stream')

//Browsersync
gulp.task('browser-sync', () =>{
	browserSync.init({
		server: {
			baseDir: path.htdocs
		}
		//proxy: 'http://localhost/'
	})
})

gulp.task('browser-reload', () =>{
  browserSync.reload()
})



//HTMLの圧縮
gulp.task('html', () =>{
  gulp.src('src/**/*.html')
  .pipe(minifyHTML({ empty: true }))
  .pipe(gulp.dest(path.htdocs))
  .pipe(browserSync.stream())
})



//pugのコンパイル
gulp.task('pug', () =>{
  gulp.src('src/**/*.pug')
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest(path.htdocs))
  .pipe(browserSync.stream());
})



//Sassのコンパイル・圧縮・ベンダープレフィックスの付与
gulp.task('sass', () =>{
	gulp.src(path.src+'/scss/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(plumber({
		errorHandler: notify.onError('Error: <%= error.message %>')
	}))
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: [
			'last 2 versions'
		],
		cascade: false
	}))
	.pipe(mmq())
  .pipe(cssmin())
	.pipe(sourcemaps.write('map'))
	.pipe(gulp.dest(path.dest+'/css'))
	.pipe(browserSync.stream())
})



//JavaScriptのトランスパイルと結合・圧縮
gulp.task('js', () =>{
  gulp.src(path.src+'/js/**/!(_)*.js')
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(webpack({
    output: {
      filename: 'script.js'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:{
          presets: ['env']
        }
      }]
    },

  }))
  .pipe(gulp.dest(path.dest+'/js'))
  .pipe(browserSync.stream())
})



//watch
gulp.task('watch', () =>{
	gulp.watch('src/**/*.pug',['pug'])
	gulp.watch('src/**/*.html',['html'])
	gulp.watch(path.htdocs+'/**/*.html',['browser-reload'])
	gulp.watch(path.htdocs+'/**/*.php',['browser-reload'])
	gulp.watch(path.src+'/scss/**/*.scss',['sass'])
	gulp.watch(path.src+'/js/**/*.js',['js'])
  gulp.watch(path.src+'/img/**/*',['img'])
})



//デフォルト
gulp.task('default', ['pug','sass','js','browser-sync','watch'])
