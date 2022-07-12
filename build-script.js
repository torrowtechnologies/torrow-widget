const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/widget2/runtime.js',
    './dist/widget2/polyfills.js',
    './dist/widget2/main.js'
  ]

  await fs.ensureDir('dist')

  await concat(files, 'dist/torrow-widget.min.js')
})()
