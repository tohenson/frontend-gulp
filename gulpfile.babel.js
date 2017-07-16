'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import browsersync from 'browser-sync';
import concat from 'gulp-concat';
import uglifyjs from 'gulp-uglifyjs';
import babel from 'gulp-babel';
import cssnano from 'gulp-cssnano';
import cssmin from 'gulp-minify-css';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import del from 'del';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import cache from 'gulp-cache';
import autoprefixer from 'gulp-autoprefixer';
import rigger from 'gulp-rigger';
import notify from 'gulp-notify';
import importCss from 'gulp-cssimport';
//Import path
import gulpConfig from './gulp_config';

gulp.task('sass', () => {
  return gulp.src(gulpConfig.path.src.sass)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .on('error', notify.onError((error) => {
          return {
              title: 'SASS',
              message: error.message
          };
      }))
      .pipe(autoprefixer(
          [
              'Last 15 versions',
              '> 1%',
              'ie 8',
              'ie 7'
          ],
          {
              cascade: true
          }
      ))
      .pipe(importCss())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(gulpConfig.path.build.css))
      .pipe(browsersync.reload({stream: true}))
});

gulp.task('css-libs', ['sass'], () => {
    return gulp.src(gulpConfig.path.src.cssLib)
        .pipe(sourcemaps.init())
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(gulpConfig.path.build.css))
});

gulp.task('js-lib', () => {
  return gulp.src(['app/libs/jquery/dist/jquery.min.js', `${gulpConfig.path.src.bootstrap}/javascript/bootstrap/bootstrap.min.js`])
      .pipe(concat('scripts.min.js'))
      .pipe(uglifyjs())
      .pipe(gulp.dest(gulpConfig.path.build.js))
});

gulp.task('js', ['js-lib'], () => {
    return gulp.src([gulpConfig.path.src.jsLib])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', notify.onError((error) => {
            return {
                title: 'JS',
                message: error.message
            };
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(gulpConfig.path.build.js))
        .pipe(browsersync.reload({stream: true}));
});

gulp.task('browser-sync', () => {
  browsersync({
    server: {
      baseDir: gulpConfig.path.output
    },
    notify: false,
      host: 'localhost',
      port: 3000,
      logPrefix: "BrowserSync"
  })
});

gulp.task('html', () => {
    gulp.src(gulpConfig.path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(gulpConfig.path.build.html))
        .pipe(browsersync.reload({stream: true}));
});

gulp.task('fonts', () => {
    gulp.src([gulpConfig.path.src.fonts, `${gulpConfig.path.src.bootstrap}/fonts/**`, `${gulpConfig.path.src.fontAwesome}/fonts/**`])
        .pipe(gulp.dest(gulpConfig.path.build.fonts))
});

gulp.task('img', () => {
    return gulp.src(gulpConfig.path.src.img)
        .pipe(cache(imagemin(
            {
                interlaced: true,
                progressive: true,
                svgoPlugins: [
                    {
                        removeViewBox: false
                    }
                ],
                use: [pngquant()]
            }
        )))
        .pipe(gulp.dest(gulpConfig.path.build.img))
});

//Clean 'dist'
gulp.task('clean', () => {
    return del.sync(gulpConfig.path.clean);
});

//Clear cache
gulp.task('clear-cache', () => {
    return cache.clearAll();
});

//Gulp watch
gulp.task('watch', ['browser-sync', 'html', 'css-libs', 'js', 'img', 'fonts'], () => {
    gulp.watch([gulpConfig.path.watch.sass], (event) => {
        gulp.start('sass');
    });
    gulp.watch([gulpConfig.path.watch.html], (event) => {
        gulp.start('html');
    });
    gulp.watch([gulpConfig.path.watch.js], (event) => {
        gulp.start('js');
    });
    gulp.watch([gulpConfig.path.watch.img], (event) => {
        gulp.start('img');
    });
    gulp.watch([gulpConfig.path.watch.fonts], (event) => {
        gulp.start('fonts');
    });
});
//Gulp build
gulp.task('build', ['html', 'css-libs', 'js', 'img', 'fonts']);

