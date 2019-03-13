const gulp = require('gulp');

const DIST_DIR = 'src';

const { series, parallel } = gulp;
const { src, dest } = gulp;
const { promisify } = require('util');

const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

const less = require('gulp-less');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');

const path = require('path');
const fs = require('fs');

const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

function makeDistDir()
{
    let fullName = path.join('./', DIST_DIR);

    return exists(fullName)
        .then(found => found ? Promise.resolve() : mkdir(fullName));
}

function copy_webfonts()
{
    return src(
        'node_modules/material-design-icons/iconfont/*.+(eot|woff|woff2|ttf)',
        { sense: gulp.lastRun(copy_webfonts) }
    ).pipe(dest(DIST_DIR + '/webfonts'));
}

function copy_resources()
{
    return src(
        ['lib/**/*', '!lib/less', '!lib/less/**/*', '!lib/**/*.less', '!lib/**/*.ts'],
        { sense: gulp.lastRun(copy_resources) }
    ).pipe(dest(DIST_DIR));
}

var copy_static = parallel(copy_webfonts, copy_resources);

function less_build()
{
    return src(['lib/ui/less/tau.less'])
        .pipe(less({
            paths: [ 'lib/ui/less' ]
        }))
        .pipe(concat('css/style.css'))
        .pipe(cleanCSS({ level: 2, format: 'beautify' }))
        .pipe(dest(DIST_DIR))
};

function tsc_build()
{
    let project = tsc.createProject('tsconfig.json');

    return src('lib/**/*.ts', { sense: gulp.lastRun(tsc_build) })
        .pipe(project())
        .pipe(dest(DIST_DIR));
}

gulp.task('build', series(makeDistDir, copy_static, tsc_build, less_build));
