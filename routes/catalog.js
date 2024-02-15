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

router.get("/shoes/:id/delete", shoe_controller.shoe_delete_get);
router.post("/shoes/:id/delete", shoe_controller.shoe_delete_post);

//brand routes
router.get("/brand", brandController.brand_list_get);

router.get("/brand/create", brandController.brand_create_get);
router.post("/brand/create", brandController.brand_create_post);

router.get("/brand/:id", brandController.get_brand_detail);

router.get("/brand/:id/update", brandController.brand_update_get);
router.post("/brand/:id/update", brandController.brand_update_post);

router.get("/brand/:id/delete", brandController.brand_delete_get);
router.post("/brand/:id/delete", brandController.brand_delete_post);

//seller routes
router.get("/sellers", sellerController.sellers_list_get);

//instance routes
router.get("/instances", shoeinstanceController.shoeinstance_list_get);

module.exports = router;