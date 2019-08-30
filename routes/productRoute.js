const router = require("express-promise-router")();
const ProductController = require("../controllers/productController");

router.get("/:storehash/:id/:limit?", ProductController.findByCategoryId);

module.exports = router;