const express = require('express');
const router = express.Router();

const shoe_controller = require("../controllers/shoeController");
const brandController = require("../controllers/brandController");
const sellerController = require("../controllers/sellerController");
const shoeinstanceController = require("../controllers/shoeinstanceController");

router.get("/", shoe_controller.index);

//shoe routes
router.get("/shoes", shoe_controller.shoe_list_get);

router.get("/shoes/create", shoe_controller.shoe_create_get);
router.post("/shoes/create", shoe_controller.shoe_create_post);

router.get("/shoes/:id", shoe_controller.get_shoe_detail);

router.get("/shoes/:id/update", shoe_controller.shoe_update_get);
router.post("/shoes/:id/update", shoe_controller.shoe_update_post);

//brand routes
router.get("/brands", brandController.brand_list_get);

//seller routes
router.get("/sellers", sellerController.sellers_list_get);

//instance routes
router.get("/instances", shoeinstanceController.shoeinstance_list_get);

module.exports = router;