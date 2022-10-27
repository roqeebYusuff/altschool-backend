const { Router } = require("express");

let router = Router();

// router.use("");

router.get("/", function (req, res) {
  res.json({
    routes: "User routes",
  });
});

module.exports = router;
