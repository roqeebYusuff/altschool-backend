const config = require("./src/config/config");
const app = require("./index");
const initializeDb = require("./src/db");
const { seeders } = require("./src/api/v1/seeder");

/* Connect to db */
initializeDb().then(() => {
  // app.listen
  app.listen(config.PORT, () => {
    console.log(`Server started on http://localhost:${config.PORT}`);
  });

  // run seeders
  seeders()
});
