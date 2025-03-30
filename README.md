[![npm](https://img.shields.io/npm/dt/gulp-jcrushcss.svg)](#)

Gulp JCrush CSS
========================

Deduplicates a CSS file using Javascript.

> It creates a compressed Javascript file (or inline code) that sets your styles and then modifies your HTML file to use that instead of your original CSS.

Uses [JCrush](https://www.npmjs.com/package/jcrush), see that project for more info (and an in-built plugin for compressing Javascript files).


## Installation

This is a Node.JS module available from the Node Package Manager (NPM).

https://www.npmjs.com/package/gulp-jcrushcss

Here's the command to download and install from NPM:

`npm install gulp-jcrushcss -S`

or with Yarn:

`yarn add gulp-jcrushcss`

## Usage

In your `gulpfile.mjs`, use **JCrush CSS** as a Gulp plugin:

#### Step 1: Import **JCrush CSS**

```javascript
import jcrushCSS from 'gulp-jcrushcss';
```

#### Step 2: Create a Gulp Task for JCrush


```javascript
gulp.task('jcrushcss', () => {
  return gulp.src('styles.min.css')
    .pipe(jcrushCSS({
      html: ['index.html'], // This part is important
    }));
});
```

#### Step 3: Run **JCrush CSS** After Minification

To run **JCrush CSS** after your minification tasks, add JCrush CSS in series after other tasks, such as in this example:

```javascript
gulp.task('default', gulp.series(
  gulp.parallel('minify-css', 'minify-js', 'minify-html'), // Run your minification tasks first
  'jcrushcss' // Then run JCrush CSS
));
```

Alternatively you can mix it in with your existing minification task, after your CSS is minified and renamed as usual.

---

## Parameters

### `opts` (Object, optional)

A configuration object with the following properties:

- `html` (Boolean, default: `[]`): An array of HTML filenames (usually just one), where JCrush CSS will do its business.
You SHOULD put this in, or the plugin will have a guess at which file to change, or just fail.

- `inline` (Boolean, default: `false`):
  - If `true`, **JCrush CSS** will inline its code into the HTML instead of referencing a file.  Your code should definitely be minified first as it cannot contain line breaks.
  - If `false`, **JCrush CSS** will point to a file.

- `appendExt` (Boolean, default: `true`):
  - If `true`, **JCrush CSS** will create a js with the ".js" appended to the name of your CSS file.
  - If `false`, **JCrush CSS** will replace the ".css" extension with ".js" - more likely to conflict with an existing file?

- `eval` (Boolean, default: `true`):
  - If `true`, **JCrush CSS** will use `eval()` for executing code strings, which has shorter output.
  - If `false`, **JCrush CSS** will use `new Function()` instead, which may be more secure in some environments.

- `let` (Boolean, default: `false`):
  - If `true`, **JCrush CSS** will use the `let` keyword for variable declarations.
  - If `false`, it will create global variables without preceeding with any keyword, for shorter output.

- `semi` (Boolean, default: `false`):
  - If `true`, **JCrush CSS** will put a semi-colon at the end of the file.
  - If `false`, no semi-colon, for shorter output.

- `strip` (Boolean, default: `true`):
  - If `true`, **JCrush CSS** will strip escaped newlines and any adjacent whitespace from input.
  - If `false`, will retain the input as-is.

- `reps` (Number, default: 0):
  - Used to set a maximum number of compression replacements.

- `prog` (Boolean, default: `true`):
  - If `true`, **JCrush CSS** will output console messages about each replacement.
  - If `false`, will work silently.

- `fin` (Boolean, default: `true`):
  - If `true`, **JCrush CSS** will output final console messages about bytes saved or failure.
  - If `false`, will remain silent.

Additionally, you can alter compression behavior:

- `maxLen` (Number, default: 40): The maximum length of substrings to consider.  Setting this higher will slow things down.
- `omit` (Array, default: `[]`): An array of substrings to omit from deduplication. Can be used to ignore accepted long/frequent words.
- `clean` (Boolean, default: `false`): If `true`, Strips symbols from input.  Keep it `false` to dedupe all code, set it to `true` to focus only on words.
- `words` (Boolean, default: `false`): If `true`, matches whole words which speeds up processing.  When `false` finds more compression opportunities but performs very poorly.
- `trim` (Boolean, default: `false`): If `true`, won't dedupe white space.  When `false` finds more compression opportunities.
- `break` (Array, default: `[]`): An array of substrings *by* which to split input. The break substring won't be matched. This can be used to concatenate an array of texts with a special char.
- `split` (Array, default: `[':', ';', ' ', '"', '.', ',', '{', '}', '(', ')', '[', ']', '=']`): Splits input after specified
strings and may include them in matches as well as any whitespace afterwards. Setting these up properly for your particular input is key
to balancing the effectiveness of compression vs the efficiency of execution time.  The more splits in input the more compression
opportunities are found, whereas fewer splits executes much faster but won't compress as much.
- `escSafe` (Boolean, default: `true`): Will take extra care around escaped characters.  You'll probably want to keep this.

---

## Contributing

https://github.com/braksator/gulp-jcrushcss

In lieu of a formal style guide, take care to maintain the existing coding
style.
