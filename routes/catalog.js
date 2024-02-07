const express = require('express');
const router = express.Router();

const shoe_controller = require("../controllers/shoeController");
const brandController = require("../controllers/brandController");
const sellerController = require("../controllers/sellerController");
const shoeinstanceController = require("../controllers/shoeinstanceController");

router.get("/", shoe_controller.index);

module.exports = router;