var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const http = require("http");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
dotenv.config();

var indexRouter = require("./routes/index");
const mahasiswaRouter = require("./routes/mahasiswa");
const adminRouter = require("./routes/admin");
const lptikRouter = require("./routes/lptik");

var app = express();

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server);


// view engine setup
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/pic", express.static(path.join(__dirname, "pic")));
app.use(express.static(path.join(__dirname, "./node_modules/preline/dist")));
app.use(
  express.static(path.join(__dirname, "./node_modules/sweetalert2/dist"))
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "middleware")));
app.use(express.static(path.join(__dirname, "data")));

app.use("/", indexRouter);
app.use("/mahasiswa", mahasiswaRouter);
app.use("/admin", adminRouter);
app.use("/lptik", lptikRouter);

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

// Pass Socket.IO instance to controllers
app.set("io", io);

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("register", (userId) => {
    socket.join(userId.toString());
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

module.exports = app;
