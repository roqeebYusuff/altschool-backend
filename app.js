const config = require("./api/config/config");
const app = require("./index");
const initializeDb = require("./api/db");
const { seeders } = require("./api/seeder");

/* Connect to db */
initializeDb().then(() => {
  // app.listen
  app.listen(config.PORT, () => {
    console.log(`Server started on http://localhost:${config.PORT}`);
  });

  // run seeders
  seeders()
});
