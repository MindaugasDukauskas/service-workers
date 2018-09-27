var gulp = require("gulp");
var gutil = require("gulp-util");
var gulpCopy = require("gulp-copy");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var watchify = require("watchify");
var reactify = require("reactify");
var notifier = require("node-notifier");
var server = require("gulp-server-livereload");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var watch = require("gulp-watch");

var DESTINATION_DIR = "./dist/";

var notify = function(error) {
  var message = "In: ";
  var title = "Error: ";

  if (error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message;
  }

  if (error.filename) {
    var file = error.filename.split("/");
    message += file[file.length - 1];
  }

  if (error.lineNumber) {
    message += "\nOn Line: " + error.lineNumber;
  }

  notifier.notify({ title: title, message: message });
};

var bundler = watchify(
  browserify({
    entries: ["./src/app.jsx"],
    transform: [reactify],
    extensions: [".jsx"],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  })
);

function bundle() {
  return bundler
    .bundle()
    .on("error", notify)
    .pipe(source("main.js"))
    .pipe(gulp.dest(DESTINATION_DIR));
}
bundler.on("update", bundle);

gulp.task("bundle", function() {
  bundle();
});

gulp.task("build", ["bundle", "sass", "html"], function() {
  console.log("finished");
  return;
});

gulp.task("serve", function(done) {
  gulp.src("").pipe(
    server({
      livereload: {
        enable: true,
        filter: function(filePath, cb) {
          if (/main.js/.test(filePath)) {
            cb(true);
          } else if (/style.css/.test(filePath)) {
            cb(true);
          }
        }
      },
      open: true
    })
  );
});

gulp.task("sass", function() {
  gulp
    .src("./sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("style.css"))
    .pipe(gulp.dest(DESTINATION_DIR));
});

gulp.task("html", function() {
  return gulp.src(["index.html"]).pipe(gulpCopy(DESTINATION_DIR));
});

gulp.task("default", ["bundle", "serve", "sass", "html", "watch"]);

gulp.task("watch", function() {
  gulp.watch("./sass/**/*.scss", ["sass"]);
});
