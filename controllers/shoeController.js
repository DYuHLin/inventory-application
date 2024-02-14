const Shoe = require("../models/shoe");
const Seller = require("../models/seller");
const Brand = require("../models/brand");
const ShoeInstance = require("../models/shoeInstance");
const {body, validationResult} = require("express-validator");

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
    const shoes = await Shoe.find({}, "title seller")
        .sort({title: 1})
        .populate("seller")
        .exec();

    res.render("shoe_list", {title: "Shoe List", shoe: shoes});
});

//create new shoe
exports.shoe_create_get = asynchandler(async (req, res, next) => {
    const [allSellers, allBrands, allShoes] = await Promise.all([
        Seller.find().sort({name: 1}).exec(),
        Brand.find().sort({name: 1}).exec(),
        Shoe.find().sort({title: 1}).exec()
    ]);

    res.render("shoe_form", {title: "Shoe Create", sellers: allSellers, brands: allBrands, shoes: allShoes});
});

exports.shoe_create_post = [
    //validating fields
    body("title", "Title should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("seller", "Seller should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("summary", "Summary should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("brand", "Brand should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),

    asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        // validationResult
        const shoe = new Shoe({
            title: req.body.title,
            seller: req.body.seller,
            summary: req.body.summary,
            brand: req.body.brand
        });

        if(!errors.isEmpty()){
            const[allSellers, allBrands] = await Promise.all([
                Seller.find().sort({name: 1}).exec(),
                Brand.find().sort({name: 1}).exec(),
            ]);
            res.render("shoe_form", {title: "Shoe Create", sellers: allSellers, brands: allBrands, shoes: shoe, errors: errors.array()});
        } else {
            await shoe.save();
            res.redirect("/")
        }
    }),
];

//get single shoe
exports.get_shoe_detail = asynchandler(async (req, res, next) => {
    const [shoe, shoeInstance] = await Promise.all([
        Shoe.findById(req.params.id).populate("seller").populate("brand").exec(),
        ShoeInstance.find({shoe: req.params.id}).exec(),
    ]);

    if(shoe === null) {
        const err = new Error("Shoe not found");
        err.status = 404;
        return next(err);
    };

    res.render("shoe_detail", {title: shoe.title, shoe: shoe, shoe_instance: shoeInstance} )
});

//update shoe
exports.shoe_update_get = asynchandler(async (req, res, next) => {
    const [allSellers, allBrands, Shoes] = await Promise.all([
        Seller.find().sort({name: 1}).exec(),
        Brand.find().sort({name: 1}).exec(),
        Shoe.findById(req.params.id).populate("seller").exec()
    ]);

    if(Shoes === null) {
        const err = new Error("Shoe not found");
        err.status = 404;
        return next(err);
    };

    res.render("shoe_form", {title: "Shoe Update", sellers: allSellers, brands: allBrands, shoes: Shoes});
});

exports.shoe_update_post = [
    //validating fields
    body("title", "Title should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("seller", "Seller should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("summary", "Summary should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("brand", "Brand should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),

    asynchandler(async (req, res, next) => {
        const errors = validationResult(req);

        const shoe = new Shoe({
            title: req.body.title,
            seller: req.body.seller,
            summary: req.body.summary,
            brand: req.body.brand,
            _id: req.params.id
        });

        if(!errors.isEmpty()) {
            const[allSellers, allBrands] = await Promise.all([
                Seller.find().sort({name: 1}).exec(),
                Brand.find().sort({name: 1}).exec(),
            ]);

            res.render("shoe_form", {title: "Shoe Update", sellers: allSellers, brands: allBrands, shoes: shoe, errors: errors.array()});
            return;
        } else {
            const updateShoe = await Shoe.findByIdAndUpdate(req.params.id, shoe, {});
            res.redirect(updateShoe.url)
        };
    })
];