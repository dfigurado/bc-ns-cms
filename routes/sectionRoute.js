const router = require("express-promise-router")();
const SectionController = require("../controllers/sectionController");

router.get('/',SectionController.findAll);
/**
router.get('/:id',SectionController.findById)
router.post('/',SectionController.create)
router.put('/:id',SectionController.update)
router.delete('/',SectionController.delete)
**/
module.exports = router;