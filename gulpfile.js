/** npm install gulp --save-dev **/
var gulp = require('gulp');

/** gulp sass to css **/
var sass = require('gulp-sass');

/** auto-reload browser **/
var browserSync = require('browser-sync').create();

/** concatenates js **/
var useref = require('gulp-useref');

/** if **/
var gulpIf = require('gulp-if');

/** minifies js **/
var uglify = require('gulp-uglify');

/** minifies css **/
var cssnano = require('gulp-cssnano');

/** minifies imgs **/
var imagemin = require('gulp-imagemin');

/** caches imgs **/
var cache = require('gulp-cache');

/** cleans target files **/
var del = require('del');

/** runs tasks on sequence **/
var runSequence = require('run-sequence');


gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('app/src/**/*.scss', ['sass']);
    gulp.watch('app/src/**/*.html', browserSync.reload);
    gulp.watch('app/src/**/*.js', browserSync.reload);
});


gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
});

gulp.task('useref', function () {
    return gulp.src('app/src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('prod'))
});

gulp.task('sass', function () {
    return gulp.src('app/src/**/*.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('app/src/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app/src'
        }
    })
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('prod/images'))
});

gulp.task('fonts', function () {
    return gulp.src('app/src/global/resources/fonts/**/*')
        .pipe(gulp.dest('prod/fonts'))
});

gulp.task('clean:dist', function () {
    return del.sync('prod');
});

gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
});
