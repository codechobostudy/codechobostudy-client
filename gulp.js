"use strict";

var gulp = require('gulp');

gulp.task('coffee-lint', function(){

    var coffeelint = require('gulp-coffeelint');

    return gulp.src(['./src/coffee/**/*.coffee'])
        .pipe(coffeelint())
        .pipe(coffeelint.reporter('coffeelint-stylish'));
});

gulp.task('coffee', function(){

    var coffee = require('gulp-coffee');

    return gulp.src(['./src/coffee/**/*.coffee'])
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest('./src/js'));
});

gulp.task('less', function(){

    var less = require('gulp-less');

    return gulp.src('./src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./src/js/*.css'));
});

gulp.task('jshint',['coffee'], function(){

    var jshint = require('gulp-jshint');

    return gulp.src(['./src/js/*.js','./src/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    return gulp.src('src/view/**/*.html')
        .pipe(wiredep({
            directory: 'bower_components'
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('connect', function () {
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(serveStatic('app'))
        .use(serveIndex('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:9000.');
        });
});

gulp.task('server', ['less','coffee','connect'], function () {
    var livereload = require('gulp-livereload');

    livereload.listen();

    require('opn')('http://localhost:9000');

    gulp.watch([
        'src/view/**/*.html',
        'src/less/**/*.less',
        'src/js/**/*.js',
        'src/coffee/**/*.coffee'
    ],['less','coffee']).on('change', livereload.changed);

    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build',['coffee-lint','jshint','less']);
gulp.task('default',['server']);