import { terser } from 'rollup-plugin-terser';
import sass from 'rollup-plugin-sass';

module.exports = {
    input: "./main.js",
    output: {
        file: "./dist/build.js",
        format: "esm",
        plugins: [
            terser(),
            sass()
        ]
    }
}