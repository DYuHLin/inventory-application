const express = require('express');
const router = express.Router();

const shoe_controller = require("../controllers/shoeController");
const brandController = require("../controllers/brandController");
const sellerController = require("../controllers/sellerController");
const shoeinstanceController = require("../controllers/shoeinstanceController");

router.get("/", shoe_controller.index);

//shoe routes
router.get("/shoes", shoe_controller.shoe_list_get);
//brand routes
router.get("/brands", brandController.brand_list_get);
//seller routes
router.get("/sellers", sellerController.sellers_list_get);
//instance routes
router.get("/instances", shoeinstanceController.shoeinstance_list_get);

module.exports = router;