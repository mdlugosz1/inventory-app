var express = require("express");
var router = express.Router();

const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");
const producer_controller = require("../controllers/producerController");

/* GET home page. */
router.get("/", item_controller.index);

/* POST add category */
router.post("/category/create", category_controller.category_create_post);

/* GET add category */
router.get("/category/create", category_controller.category_create_get);

/* POST producer form */
router.post("/producer/create", producer_controller.producer_form_post);

/* GET producer form */
router.get("/producer/create", producer_controller.producer_form_get);

/* GET item list */
router.get("/items", item_controller.item_list);

/* GET item detail */
router.get("/item/:id", item_controller.item_details);

/* GET categories list */
router.get("/categories", category_controller.categories_list);

/* GET category details */
router.get("/category/:id", category_controller.category_details);

/* GET categories list */
router.get("/producers", producer_controller.producers_list);

/* GET producer details */
router.get("/producer/:id", producer_controller.producer_details);

/* GET item form */
router.get("/item/create", item_controller.item_form_get);

/* POST new item */
router.post("/item/create", item_controller.item_form_post);

/* GET delete category */
router.get("/category/:id/delete", category_controller.category_delete_get);

/* POST delete category */
router.post("/category/:id/delete", category_controller.category_delete_post);

/* GET delete producer */
router.get("/producer/:id/delete", producer_controller.producer_delete_get);

/* POST delete producer */
router.post("/producer/:id/delete", producer_controller.producer_delete_post);

/* GET delete item */
router.get("/item/:id/delete", item_controller.item_delete_get);

/* POST delete item */
router.post("/item/:id/delete", item_controller.item_delete_post);

module.exports = router;
