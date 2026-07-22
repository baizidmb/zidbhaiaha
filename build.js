const fs = require('fs');
const path = require('path');
const https = require('https');

const BABEL_URL = 'https://unpkg.com/@babel/standalone/babel.min.js';
const BABEL_CACHE = path.join(__dirname, 'babel-standalone.js');

function getBabel(callback) {
  if (fs.existsSync(BABEL_CACHE)) {
    console.log('Using cached Babel standalone...');
    const code = fs.readFileSync(BABEL_CACHE, 'utf8');
    eval(code);
    callback(global.Babel);
    return;
  }
  console.log('Downloading Babel standalone for building...');
  https.get(BABEL_URL, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      fs.writeFileSync(BABEL_CACHE, data);
      eval(data);
      callback(global.Babel);
    });
  }).on('error', (err) => {
    console.error('Failed to download Babel:', err);
  });
}

getBabel((Babel) => {
  console.log('Babel loaded successfully! Version:', Babel.version);
});
