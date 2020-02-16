var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var app = express();

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var boxRouter = require("./routes/box");

/**
 * Enable CORS
 */
app.use(cors());

/**
 * Miscellaneous
 */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Routes
 */
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/boxes", boxRouter);

module.exports = app;
