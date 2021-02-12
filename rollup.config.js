import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import versionInjector from 'rollup-plugin-version-injector'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'esm', sourcemap: true },
      {
        file: pkg.browser,
        format: 'umd',
        sourcemap: true,
        name: 'nuware.RPC',
      },
    ],
    plugins: [versionInjector(), resolve(), commonjs(), terser()],
  },
]
