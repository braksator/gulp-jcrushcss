#!/usr/bin/env node
'use strict';

/**
 * @file
 * JCrush CSS - A Javascript based CSS deduplicator & compressor.
 */

var fs = require('fs');
var path = require('path');
var jcrush = require('jcrush');

/**
 * Gulp-compatible transform stream.
 * @param {object} opts - (optional) Options for customization.
 * @returns {Transform} - A transform stream for Gulp.
 */
module.exports = (opts = {}) => {
  let { Transform } = require('stream'), PluginError = require('plugin-error');
  const PLUGIN_NAME = 'gulp-jcrushcss';
  opts = { ...{ html: [], inline: 0, appendExt: 1 }, ...opts };
  return new Transform({
    objectMode: true,
    transform(file, _, cb) {
      if (file.isNull()) return cb(null, file);
      if (file.isStream()) return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      try {
        let wrapped = `document.head.innerHTML+=\`<style>${file.contents.toString()}</style>\``,
          jsCode = jcrush.code(wrapped, opts),
          parsed = path.parse(file.path);
        if (jsCode != wrapped) {
          if (!opts.html.length) {
            let htmlGuess = path.join(path.dirname(file.path), '..', 'index.html');
            fs.existsSync(htmlGuess) && opts.html.push(htmlGuess);
          }
          let htmlUpdated = false;
          if (opts.html.length) {
            opts.html.forEach(htmlFilePath => {
              fs.writeFileSync(htmlFilePath, fs.readFileSync(htmlFilePath, 'utf-8')
                .replace(new RegExp(`<link[^>]*href=\\s*['"]?${file.basename}['"]?[^>]*>`, 'gi'),
                  opts.inline ? `<script>${jsCode}</script>`: `<script src="${path.relative(path.dirname(htmlFilePath), file.path)}.js"></script>`)
              );
              console.log('✅ Updated HTML file:', htmlFilePath);
              htmlUpdated = true;
            });
          }
          if (!htmlUpdated) console.error("⚠️  No HTML file found.  CSS not processed.");
          else if (!opts.inline) fs.writeFileSync(path.join(parsed.dir, parsed.name + (opts.appendExt ? parsed.ext : '') + '.js'), jsCode);
        }
        cb(null, file);
      }
      catch (err) {
        cb(new PluginError(PLUGIN_NAME, err, { fileName: file.path }));
      }
    }
  })
};