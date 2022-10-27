const { Router } = require("express");

let router = Router();

router.get("/", function (req, res) {
  res.json({
    route: "Blog ROutes",
  });
});

module.exports = router;
