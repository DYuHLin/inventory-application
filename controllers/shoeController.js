const Shoe = require("../models/shoe");
const Seller = require("../models/seller");
const Brand = require("../models/brand");
const ShoeInstance = require("../models/shoeInstance");

const asynchandler = require("express-async-handler");

//retrieve home page with summary of everything
exports.index = asynchandler(async (req, res, next) => {
    const [shoeCount, sellerCount, brandCount, shoeInstanceCount] = await Promise.all([
        Shoe.countDocuments({}).exec(),
        Seller.countDocuments({}).exec(),
        Brand.countDocuments({}).exec(),
        ShoeInstance.countDocuments({status: "Available"}).exec(),
    ]);

    res.render("index", { title: "Shoe Store Home", 
    shoe_count: shoeCount, 
    seller_count: sellerCount, 
    brand_count: brandCount, 
    shoeinstance:  shoeInstanceCount});
});

//get list of shoes
exports.shoe_list_get = asynchandler(async (req, res, next) => {
    const shoes = await Shoe.find({}, "name seller")
        .sort({title: -1})
        .populate("seller")
        .exec();

    res.render("shoe_list", {title: "Shoe List", shoe: shoes});
});