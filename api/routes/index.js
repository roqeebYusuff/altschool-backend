const { Router } = require("express");
const userRoutes = require("./user");
const blogRoutes = require("./blog");

let router = Router();

router.use("/user", userRoutes);
router.use("/blog", blogRoutes);
router.get("/", (req, res) => {
  res.json({
    route: "Routes",
    timestamp: Date.now(),
  });
});

module.exports = router;
