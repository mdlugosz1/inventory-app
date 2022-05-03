var express = require("express");
var router = express.Router();

const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");
const producer_controller = require("../controllers/producerController");

/* GET home page. */
router.get("/", item_controller.index);

/* GET item list */
router.get("/items", item_controller.item_list);

/* GET item detail */
router.get("/items/:id", item_controller.item_details);

/* GET categories list */
router.get("/categories", category_controller.categories_list);

/* GET category details */
router.get("/category/:id", category_controller.category_details);

/* GET categories list */
router.get("/producers", producer_controller.producers_list);

/* GET producer details */
router.get("/producer/:id", producer_controller.producer_details);

module.exports = router;
