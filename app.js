const config = require("./api/config/config");
const app = require("./index");
const initializeDb = require("./api/db");

/* Connect to db */
initializeDb().then(() => {
  // app.listen
  app.listen(config.PORT, () => {
    console.log(`Server started on http://localhost:${config.PORT}`);
  });
});
