const path = require('path');
const TerserPlugin = require("terser-webpack-plugin")


module.exports = {
	target: 'node',
	entry: {
		index: './src/index.ts',
	},
	output: {
		path: path.resolve(__dirname, './out'),
		filename: '[name].js',
		libraryTarget: 'commonjs',
		devtoolModuleFilenameTemplate: "../[resource-path]"
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [{
			test: /\.ts$/,
			exclude: [/node_modules/],
			use: [{
					loader: 'vscode-nls-dev/lib/webpack-loader',
					options: {
						base: path.join(__dirname, 'src')
					}
				},
				{
					loader: 'ts-loader'
				},
			],
		}],
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({
			extractComments: false,
		})],
	},
};
