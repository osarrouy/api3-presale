import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'
import scsss from 'rollup-plugin-scss'
const auto = require('svelte-preprocess')
const rootImport = require('rollup-plugin-root-import')
const autoprefixer = require('autoprefixer')
import { scss, postcss } from 'svelte-preprocess'

import { mdsvex } from 'mdsvex'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = !!process.env.SAPPER_LEGACY_BUILD

const onwarn = (warning, onwarn) =>
	(warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	onwarn(warning)

const preprocess = [
	mdsvex(),
	scss({
		includePaths: ['src/styles'],
		data: `@import 'src/styles/variables.scss';`
	}),
	postcss({
		plugins: [require('autoprefixer')]
	})
]

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			scsss({
				// update includePaths to what suits.
				// node_modules is probably only necessary if you need to import from a css library
				includePaths: ['src/styles'],
				output: 'static/global.css'
			}),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				dev,
				extensions: ['.svelte', '.svx'],

				hydratable: true,
				emitCss: true,
				preprocess
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),

			legacy &&
				babel({
					extensions: ['.js', '.mjs', '.html', '.svelte'],
					babelHelpers: 'runtime',
					exclude: ['node_modules/@babel/**'],
					presets: [
						[
							'@babel/preset-env',
							{
								targets: '> 0.25%, not dead'
							}
						]
					],
					plugins: [
						'@babel/plugin-syntax-dynamic-import',
						[
							'@babel/plugin-transform-runtime',
							{
								useESModules: true
							}
						]
					]
				}),

			!dev &&
				terser({
					module: true
				})
		],

		preserveEntrySignatures: false,
		onwarn
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			scsss({
				// update includePaths to what suits.
				// node_modules is probably only necessary if you need to import from a css library
				includePaths: ['src/styles'],
				output: 'static/global.css'
			}),
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				generate: 'ssr',
				hydratable: true,
				extensions: ['.svelte', '.svx'],

				dev,
				preprocess,

				hydratable: true,
				emitCss: true
			}),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),

		preserveEntrySignatures: 'strict',
		onwarn
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			commonjs(),
			!dev && terser()
		],

		preserveEntrySignatures: false,
		onwarn
	}
}
