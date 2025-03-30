import gulp from 'gulp';
import jcrushcss from './index.js';

gulp.task('jcrushcss', function () {
  return gulp.src('./test/*.css')
    .pipe(jcrushcss({ html: ['./test/test.html'], inline: true, }));
});

gulp.task('default', gulp.series(
  'jcrushcss',
));

gulp.watch(['./src/*'], gulp.series('default'));