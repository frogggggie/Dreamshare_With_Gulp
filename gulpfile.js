const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const  rename = require("gulp-rename");

const image = require('gulp-image');
const {series} = require('gulp');

const browser = require('browser-sync').create();



const paths = {
    styles: {
        src: 'app/styles/**/*.scss',
        dest: 'build/css'
    },
    images: {
        src: 'app/assets/images/*.*',
        dest: 'build/images'
    },
    html: {
        src: 'app/*.html',
        dest: 'build/'
    }
}



function browserSync(done) {
    browser.init({
        server: {
            baseDir: "./build"
        },
        port: 4000
    })
    done()
}


function browserSyncReload(done) {
     browser.reload()
     done()
}


function styles() {
    return gulp.src(paths.styles.src)
       .pipe(sass())
       .pipe(autoprefixer())
       .pipe(cssnano())
       .pipe(rename({
           suffix: '.min'
     }))
       .pipe(gulp.dest(paths.styles.dest))
       .pipe(browser.stream())
   }

 
   function html() {
       return gulp.src(paths.html.src)
       .pipe(gulp.dest(paths.html.dest))
       .pipe(browser.stream())
   }

function images() {
    return gulp.src(paths.images.src)
    .pipe(image())
      .pipe(gulp.dest(paths.images.dest))
      .pipe(browser.stream())
}



function watch() {
    gulp.watch(paths.images.src, images)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.html.src, html)
    gulp.watch('./app/index.html', gulp.series(browserSyncReload))
}

const build = gulp.parallel(html, images, styles);

gulp.task('build', build)
gulp.task('default', gulp.parallel(watch, build, browserSync))
