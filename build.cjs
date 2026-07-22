const fs = require('fs');
const path = require('path');
const https = require('https');
const VM = require('vm');

const BABEL_URL = 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.24.0/babel.min.js';
const BABEL_CACHE = path.join(__dirname, 'babel-standalone.js');

function fetchUrl(url, callback) {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      let redirectUrl = res.headers.location;
      if (!redirectUrl.startsWith('http')) {
        redirectUrl = new URL(redirectUrl, url).href;
      }
      fetchUrl(redirectUrl, callback);
      return;
    }
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => callback(null, data));
  }).on('error', err => callback(err));
}

function getBabel(callback) {
  if (fs.existsSync(BABEL_CACHE)) {
    console.log('Using cached Babel standalone...');
    const data = fs.readFileSync(BABEL_CACHE, 'utf8');
    const context = {};
    context.window = context;
    context.self = context;
    context.global = context;
    VM.runInNewContext(data, context);
    callback(context.Babel);
    return;
  }
  console.log('Downloading Babel standalone from cdnjs...');
  fetchUrl(BABEL_URL, (err, data) => {
    if (err) {
      console.error('Failed to download Babel:', err);
      return;
    }
    fs.writeFileSync(BABEL_CACHE, data);
    const context = {};
    context.window = context;
    context.self = context;
    context.global = context;
    VM.runInNewContext(data, context);
    callback(context.Babel);
  });
}

function processDirectory(dir, Babel) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath, Babel);
    } else if (entry.name.endsWith('.jsx')) {
      console.log('Transpiling JSX:', fullPath);
      const code = fs.readFileSync(fullPath, 'utf8');
      
      const transformed = Babel.transform(code, {
        presets: ['react'],
        plugins: []
      }).code;

      // Replace .jsx import paths with .js
      const jsCode = transformed.replace(/(from\s+['"].*?)\.jsx(['"])/g, '$1.js$2');

      const jsPath = fullPath.replace(/\.jsx$/, '.js');
      fs.writeFileSync(jsPath, jsCode, 'utf8');
      console.log('Saved JS:', jsPath);
    }
  }
}

getBabel((Babel) => {
  if (!Babel || !Babel.transform) {
    console.error('Babel transform function not found!');
    return;
  }
  console.log('Transpiling all JSX files in src/...');
  processDirectory(path.join(__dirname, 'src'), Babel);
  console.log('SUCCESS: All JSX files transpiled to standard JS!');
});
