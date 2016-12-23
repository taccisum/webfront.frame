/**
 * Created by lenovo on 2016/12/22.
 */
"use strict";
var gulp=require('gulp');
var jade=require('gulp-jade');

gulp.task('template',function () {
    var YOUR_LOCALS = {};

    gulp.src('./html/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty:true
        }))
        .pipe(gulp.dest('dist/'))
});


gulp.task('copy',function () {
    gulp.src('data/**/*')
        .pipe(gulp.dest('dist/data'));
    gulp.src('content/**/*')
        .pipe(gulp.dest('dist/content'));
});


gulp.task('default',['template','copy']);