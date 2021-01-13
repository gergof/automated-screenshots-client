const path = require('path');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: './src/index.ts',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		filename: 'bundle.umd.js',
		libraryTarget: 'umd',
		library: 'AutomatedScreenshotsClient',
		path: path.resolve(__dirname, 'build')
	}
};
