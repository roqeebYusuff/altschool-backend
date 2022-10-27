const { Router } = require("express");
const { signin } = require("../../controllers/User");

let router = Router();

// router.use("");

router.get("/signin", signin);

router.get("/", function (req, res) {
  res.json({
    routes: "User routes",
  });
});

module.exports = router;
