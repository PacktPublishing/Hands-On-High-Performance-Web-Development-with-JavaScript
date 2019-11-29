import sass from 'rollup-plugin-sass';

module.exports = {
    input: "./main-sass.js",
    output: {
        file: "./template/css/main.css",
        format: "cjs"
    },
    plugins: [
        sass()
    ]
}