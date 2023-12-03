const express = require("express");
const router = express.Router();
const controller = require("../controllers/product_controller");
const { authentication, isAdmin } = require("../middlewares/authentication");

router.use(authentication);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id/stock", controller.updateStock);

router.use(isAdmin);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
