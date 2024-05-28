var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

var indexRouter = require("./routes/index");
const mahasiswaRouter = require("./routes/mahasiswa");
const adminRouter = require("./routes/admin");
const kajurRouter = require("./routes/kajur");
const dekanRouter = require("./routes/dekan");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./node_modules/preline/dist")));
app.use(express.static(path.join(__dirname, "./node_modules/sweetalert2/dist")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/mahasiswa", mahasiswaRouter);
app.use("/admin", adminRouter);
app.use("/kajur", kajurRouter);
app.use("/dekan", dekanRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
