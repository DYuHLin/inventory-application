const Shoes = require("../models/shoe");
const Seller = require("../models/seller");
const Brand = require("../models/brand");
const ShoeInstance = require("../models/shoeInstance");
const {body, validationResult} = require("express-validator");

const asynchandler = require("express-async-handler");

exports.sellers_list_get = asynchandler(async (req, res, next) => {
    const sellers = await Seller.find().sort({name: -1}).exec();

    res.render("seller_list", {title: "Sellers", seller_list: sellers});
});

//create new seller
exports.seller_create_get = asynchandler(async (req, res, next) => {
    const [sellers, brands] = await Promise.all([
        Seller.find().sort({name: 1}).exec(),
        Brand.find().sort({name: 1}).exec()
    ]); 

    res.render("seller_form", {title: "Seller Create", seller: sellers, brands: brands});
});

exports.seller_create_post = [
    //validating fields
    body("name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("First name has to be specified")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters"),
    body("shoebrand", "Brand should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("established", "Invalid date of establishment")
        .optional({values: "falsy"})
        .isISO8601()
        .toDate(),

    asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        // validationResult

        const sellers = new Seller({
            name: req.body.name,
            shoebrand: req.body.shoebrand,
            established: req.body.established,
        });

        if(!errors.isEmpty()){
            const  brands = await Brand.find().sort({name: 1}).exec();

            res.render("seller_form", {title: "Seller Create", seller: sellers, brands: brands, errors: errors});
            return;
        } else {
            const sellerExists = await Seller.findOne({name: req.body.name}).exec();
            if(sellerExists){
                res.redirect(sellerExists.url);
            } else {
                await sellers.save();
                res.redirect(sellers.url);
            }
        }
    }),
];

//get single seller
exports.get_seller_detail = asynchandler(async (req, res, next) => {
    const [sellers, shoes] = await Promise.all([
        Seller.findById(req.params.id).populate("shoebrand").exec(),
        Shoes.find({brand: req.params.id}, "title summary").exec(),
    ]);

    if(sellers === null){
        const err = new Error("Seller not found.");
        err.status = 404;
        return next(err);
    };

    res.render("seller_detail", {title: "Seller detail", sellers: sellers, shoes: shoes});
});

//update seller
exports.seller_update_get = asynchandler(async (req, res, next) => {
    const [sellers, brands] = await Promise.all([
        Seller.findById(req.params.id).exec(),
        Brand.find().sort({name: 1}).exec()
    ]); 

    if(sellers === null){
        const err = new Error("Seller not found.");
        err.status = 404;
        return next(err);
    };

    res.render("seller_form", {title: "Seller Update", seller: sellers, brands: brands});
});

exports.seller_update_post = [
    body("name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("First name has to be specified")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters"),
    body("shoebrand", "Brand should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("established", "Invalid date of establishment")
        .optional({values: "falsy"})
        .isISO8601()
        .toDate(),

    asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        // validationResult

        const sellers = new Seller({
            name: req.body.name,
            shoebrand: req.body.shoebrand,
            established: req.body.established,
            _id: req.params.id
        });

        if(!errors.isEmpty()){
            const  brands = await Brand.find().sort({name: 1}).exec();

            res.render("seller_form", {title: "Seller Update", seller: sellers, brands: brands, errors: errors});
            return;
        } else {
            const sellerExists = await Seller.findOne({name: req.body.name}).exec();
            if(sellerExists){
                res.redirect(sellerExists.url);
            } else {
                const sellerUpdate = await Seller.findByIdAndUpdate(req.params.id, sellers, {});
                res.redirect(sellerUpdate.url);
            }
        }
    }),
];

//seller delete
exports.seller_delete_get = asynchandler(async (req, res, next) => {
    const [sellers, shoes] = await Promise.all([
        Seller.findById(req.params.id).populate("shoebrand").exec(),
        Shoes.find({seller: req.params.id}, "title summary").exec(),
    ]);

    if(sellers === null){
        const err = new Error("Brand not found.");
        err.status = 404;
        return next(err);
    };

    res.render("seller_delete", {title: "Brand delete", seller: sellers, shoes: shoes});
});

exports.seller_delete_post = asynchandler(async (req, res, next) => {
    const [sellers, shoes] = await Promise.all([
        Seller.findById(req.params.id).populate("shoebrand").exec(),
        Shoes.find({brand: req.params.id}, "title summary").exec(),
    ]);

    if(shoes.length > 0) {
        res.render("seller_delete", {title: "Brand delete", seller: sellers, shoes: shoes});
        return;
    } else {
        await Seller.findByIdAndDelete(req.body.sellerid);
        res.redirect("/catalog/seller");
    };
});