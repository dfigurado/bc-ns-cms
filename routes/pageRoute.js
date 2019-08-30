const router = require("express-promise-router")();
const PageController = require("../controllers/pageController");

router.get('/',PageController.findAll);
/**
router.get('/:id',PageController.findById)
router.post('/',PageController.create)
router.put('/:id',PageController.update)
router.delete('/',PageController.delete)
**/
module.exports = router;
