const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
dotenv.config();

const indexRouter = require("./routes/index");
const mahasiswaRouter = require("./routes/mahasiswa");
const adminRouter = require("./routes/admin");
const lptikRouter = require("./routes/lptik");

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

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
app.use(express.static(path.join(__dirname, "document")));

app.use("/", indexRouter);
app.use("/mahasiswa", mahasiswaRouter);
app.use("/admin", adminRouter);
app.use("/lptik", lptikRouter);

app.use(function (req, res, next) {
  next(createError(404));
});
app.use((req, res, next) => {
  res.locals.encrypt = encrypt; 
  next();
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("register", (userId) => {
    socket.join(userId.toString());
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

module.exports = { app, server };
