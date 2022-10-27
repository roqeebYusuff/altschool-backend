const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const initializeDb = require("./api/db");

const routes = require("./api/routes");
const config = require("./api/config/config");

const app = express();

app.use(cors());
app.use(morgan(":method :url :status :user-agent - :response-time ms"));
app.use(bodyParser.json());

app.use("/", routes);

/* Connect to db */
initializeDb().then(() => {
  // app.listen
  app.listen(config.PORT, () => {
    console.log(`Server started on http://localhost:${config.PORT}`);
  });
});
