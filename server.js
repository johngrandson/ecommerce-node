const compression = require("compression");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

app.use("/public", express.static(`${__dirname}/public`));
app.use("/public/images", express.static(`${__dirname}/public`));

const db = require("./config/database.json");
const dbURI = isProduction ? db.dbProduction : db.dbTest;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to mongodb successfuly"))
  .catch((err) => console.log("mongodb error: ", err));

app.set("view engine", "ejs");

if (!isProduction) {
  app.use(morgan("dev"));
}

app.use(cors());
app.disable("x-powered-by");
app.use(compression());

const ONE_AND_A_HALF_MB = 1.5 * 1024 * 1024;

app.use(express.urlencoded({ extended: false, limit: ONE_AND_A_HALF_MB }));
app.use(express.json({ limit: ONE_AND_A_HALF_MB }));

require("./models");
app.use("/", require("./routes"));

app.use((req, res, next) => {
  const err = new Error("Page not found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  if (err.status !== 404) {
    console.warn("Error: ", err.message, new Date());
    res.json(err);
  }
});

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Running API on port http://localhost:${PORT}`);
});
