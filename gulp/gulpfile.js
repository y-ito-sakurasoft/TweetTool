const gulp = require('gulp');
const sass = require('gulp-sass');

// sassとcssの保存先
gulp.task('sass', function(){
    gulp.src('./sass/**/*.scss')
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(gulp.dest('./dist/css/'));
});

//自動監視
gulp.task('sass-watch', ['sass'], function(){
    var watcher = gulp.watch('./sass/**/*.scss', ['sass']);
    watcher.on('change', function(event) {
    });
});

gulp.task('default', ['sass-watch']);