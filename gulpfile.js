'use strict';

const SRC_DIR = 'src';

const gulp = require('gulp');

const { series } = gulp;
const { src } = gulp;

const { delTree } = require('./scripts/deltree');

const mocha = require('gulp-mocha');

require('./scripts/build');

function clean()
{
    return delTree('./' + SRC_DIR);
}

/*
function runTests()
{
    return src(SRC_DIR + '/tests/index.js', {read: false})
        .pipe(mocha({ reporter: 'nyan' }));
}
*/

exports.clean = clean;
//exports.build = build;
//exports.rebuild = series(clean, build);
//exports.test = series(build, runTests);
//exports.default = build;