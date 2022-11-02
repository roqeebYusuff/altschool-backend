const { Router } = require("express");
const {
  createBlog,
  allBlogs,
  deleteBlog,
  updateBlog,
  getOneBlog,
  authorBlogs,
} = require("../../controllers/blog");
const { authorize } = require("../../middleware/auth");

let router = Router();

router.get("/listOne/:id", getOneBlog); //Get one blog
router.get("/list", allBlogs); //Get all blog
router.get("/myBlogs", authorize, authorBlogs); //Author Blogs
router.post("/create", authorize, createBlog); //Create blog
router.patch("/update/:id", authorize, updateBlog); //Update blog
router.delete("/delete/:id", authorize, deleteBlog); //Delete blog

router.get("/", function (req, res) {
  res.json({
    route: "Blog Routes",
  });
});

module.exports = router;
