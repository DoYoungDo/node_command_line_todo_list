const gulp = require('gulp');
const ts = require('gulp-typescript');
const typescript = require('typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const pk = require('./package.json');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webConfig = require('./webpack.config');
const tsProject = ts.createProject('./tsconfig.json', {
	typescript
});
const Transform = require('stream').Transform;

const {
	merge
} = require('webpack-merge');


const languages = [{
	folderName: 'zh_CN',
	id: 'zh_CN'
}, {
	folderName: 'en',
	id: 'en'
}];

const inlineMap = true;
const inlineSource = false;
const outDest = 'out';
const distDest = `./dist/${pk.name}`;
console.log(distDest);
const cleanTask = function () {
	return del(['out/**', './dist', 'package.nls.*.json']);
};

const cleanI18n = function () {
	return del(['out/**/', 'out/*.nls.metadata.json']);
};

const internalBundleCompileTask = function () {
	return doBundle();
};
const doCompile = function () {
	var r = tsProject.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject()).js

	if (inlineMap && inlineSource) {
		r = r.pipe(sourcemaps.write());
	} else {
		r = r.pipe(sourcemaps.write("../out", {
			// no inlined source
			includeContent: inlineSource,
			// Return relative source map root directories per file.
			sourceRoot: "../src"
		}));
	}

	return r.pipe(gulp.dest(outDest));
};

const doBundle = function () {
	var r = tsProject.src()
		.pipe(webpackStream(merge(webConfig, {
			mode: "production",
		}), webpack));
	return r.pipe(gulp.dest(outDest));
};

const move = function () {
	return gulp.src([
		'./package.*json',
		'./out/**',
		'./static/**'
	], {
		base: './',
		ignore: './package.json'
	})
		.pipe(gulp.dest(`./${distDest}`));
};

const updatePkg = function (type) {
	return () => {
		return gulp.src([
			'./package.json'
		], {
			base: './'
		})
			.pipe(new Transform({
				objectMode: true,
				transform(file, enc, callback) {
					if (file.isNull()) {
						return callback(null, file);
					}
					const result = String(file.contents);
					const resultJson = JSON.parse(result)
					// resultJson.version = `${resultJson.version}-${+new Date()}`
					resultJson.version = `${resultJson.version}-qualifier`
					resultJson.scripts = {}
					if (type === 'bundle') {
						resultJson.dependencies = {}
					}
					resultJson.devDependencies = {}
					file.contents = Buffer.from(JSON.stringify(resultJson, null, 2));
					callback(null, file);
				}
			})).pipe(gulp.dest(`./${distDest}`));
	}
};


const buildTask = gulp.series(cleanTask, doCompile, move, updatePkg('build'));
const bundleTask = gulp.series(cleanTask, internalBundleCompileTask, move, updatePkg('bundle'));

gulp.task('clean', cleanTask);

gulp.task('build', buildTask);

gulp.task('bundle', bundleTask);
