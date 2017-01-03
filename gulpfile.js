var gulp = require('gulp');
var less = require('gulp-less');
var gulpif = require('gulp-if');
var merge = require('merge-stream');
var spritesmith = require('gulp.spritesmith');
var templates = require('spritesheet-templates');

var path = {
  css: 'assets/css',
  js: 'assets/js',
  images: 'assets/images',
  components: 'assets/components',
  res: 'assets/res'
};


// 默认监听
gulp.task('default', function () {
  gulp.watch('public/less/**/*.less', ['less']);

  browserSync.init({
    proxy: 'http://localhost:15340/',
    port: 15340,
    reloadDelay: 1000,
    host: 'dev.36b.me',
    open: 'external'
  });

  gulp.watch(['models/**/*', 'public/**/*', 'routes/**/*', 'views/**/*', '*.js'], browserSync.reload);
});


// 编译less
gulp.task('less', function () {
  return gulp.src('public/less/base/spr.less')
    .pipe(less())
    .pipe(gulp.dest('public/css/base'));
  // return gulp.src('public/less/sidebar/*.less')
  //   .pipe(less())
  //   .pipe(gulp.dest('public/css/sidebar'));

  // return gulp.src('public/less/main.less')
  //   .pipe(less())
  //   .pipe(gulp.dest('public/css'));
});

gulp.task('sprites', function () {
  var spriteData = gulp.src('public/images/bfx/sprites/*')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.less',
      imgPath: '../images/sprite.png',
      // cssOpts: {
      //   cssSelector: function (sprite) {
      //     return '.spr-' + sprite.name;
      //   }
      // },
      cssTemplate: 'less.template.handlebars',
      cssVarMap: function (sprite) {
        var nameArr = sprite.name.split('_');
        sprite.name = 'spr-' + nameArr.join('-');
        if (sprite.name.indexOf('-hover') !== -1) {
          sprite.name = sprite.name.replace('-hover', ':hover');
        }
        
      },
      // cssOpts: {
      //   functions: false
      // }
    }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    // .pipe(buffer())
    // .pipe(imagemin())
    .pipe(gulp.dest('public/images/bfx/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    // .pipe(csso())
    .pipe(gulp.dest('public/less/bfx/'));

  return merge(imgStream, cssStream);

  // return gulp.src('public/images/bfx/sprites/*')
  //   .pipe(spritesmith({
  //     imgName: 'sprite.png',
  //     cssName: 'sprite.css',
  //     imgPath: '../images/sprite.png',
  //     cssOpts: {
  //       cssSelector: function (sprite) {
  //         return '.spr-' + sprite.name;
  //       }
  //     },
  //     cssVarMap: function (sprite) {
  //       var nameArr = sprite.name.split('_');
  //       sprite.name = nameArr.join('-');
  //     }
  //   }))
  //   .pipe(gulp.dest('public/images/bfx/'));
});

// 打包images
gulp.task('images', function () {
  return gulp.src('public/images/**')
    .pipe(imagemin())
    .pipe(gulp.dest(path.images));
});

gulp.task('dist', function (cb) {
  runSequence('clean', 'less', ['css', 'js', 'components', 'images', 'res'], cb);
});