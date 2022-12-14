const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const routes = require("./src/api/v1/routes");

const app = express();

app.use(cors());
app.use(morgan(":method :url :status :user-agent - :response-time ms"));
app.use(bodyParser.json());

app.use("/v1", routes);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    route: "Blog API",
  });
});

app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Undefined Route",
  });
});

module.exports = app;
