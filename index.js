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
  opts = { ...{ html: [], inline: 0, appendExt: 1, rename: null, fin: 1 }, ...opts };
  return new Transform({
    objectMode: true,
    transform(file, _, cb) {
      if (file.isNull()) return cb(null, file);
      if (file.isStream()) return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      try {
        let wrapped = `document.head.innerHTML+=\`<style>${file.contents.toString()}</style>\``, // 41
          jsCode = jcrush.code(wrapped, opts),
          parsed = path.parse(file.path),
          outFile = parsed.name + (opts.appendExt ? parsed.ext : '') + '.js',
          overhead = 41 + (opts.inline ? 17 : opts.appendExt ? 27 : 24) - 47 + (opts.rename ? outFile.length - opts.rename.length : 0);
        if (jsCode != wrapped && file.contents.toString().length - jsCode.length > overhead) {
          if (!opts.html.length) {
            let htmlGuess = path.join(path.dirname(file.path), '..', 'index.html');
            fs.existsSync(htmlGuess) && opts.html.push(htmlGuess);
          }
          let htmlUpdated = false;
          if (opts.html.length) {
            opts.html.forEach(htmlFilePath => {
              fs.writeFileSync(htmlFilePath, fs.readFileSync(htmlFilePath, 'utf-8')
                .replace(new RegExp(`<link[^>]*href=\\s*['"]?${file.basename}['"]?[^>]*>`, 'gi'), // 14 to 47
                  opts.inline ? `<script>${jsCode}</script>`: `<script src="${path.relative(path.dirname(htmlFilePath), file.path)}.js"></script>`) // 17, 27 or 24
              );
              opts.fin && console.log('✅ Updated HTML file:', htmlFilePath);
              htmlUpdated = true;
            });
          }
          if (!htmlUpdated) opts.fin && console.error("⚠️  No HTML file found.  CSS not processed.");
          else if (!opts.inline) fs.writeFileSync(path.join(parsed.dir, opts.rename ? opts.rename : outFile), jsCode);
        }
        else {
          opts.fin && console.log(`⚠️  After adding overhead JCrush CSS could not optimize code. Keeping original.`);
        }
        cb(null, file);
      }
      catch (err) {
        cb(new PluginError(PLUGIN_NAME, err, { fileName: file.path }));
      }
    }
  })
};