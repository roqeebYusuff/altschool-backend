const { Router } = require("express");
const { signin, signup } = require("../../controllers/User");

let router = Router();

// router.use("");

router.post("/signin", signin);
router.post("/signup", signup);

router.get("/", function (req, res) {
  res.json({
    routes: "User routes",
  });
});

module.exports = router;
