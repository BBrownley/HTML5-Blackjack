const gulp = require("gulp");
const watch = require("gulp-watch")

gulp.task("default", function() {
  console.log(
    `List of gulp commands for this project:\n
    gulp watch - watches all files for refresh
    `);
});

gulp.task("html", function() {
  console.log("Watching HTML file...");
});

gulp.task("css", function() {
  console.log("Watching CSS file...");
});

gulp.task("js", function() {
  console.log("Watching JS file...");
});

gulp.task("watch", function() {
  watch("./index.html", function() {
    gulp.start(html);
  });
  watch("./styles.css", function() {
    gulp.start("css");
  });
  watch("./game.js", function() {
    gulp.start("js");
  });
});
