#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Brand = require("./models/brand");
  const Seller = require("./models/seller");
  const Shoe = require("./models/shoe");
  const ShoeInstance = require("./models/shoeInstance");
  
  const brands = [];
  const sellers = [];
  const shoes = [];
  const shoeinstances = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createBrands();
    await createSellers();
    await createShoes();
    await createShoeInstances();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function brandCreate(index, name, origin) {
    const brand = new Brand({ name: name, origin: origin });
    await brand.save();
    brands[index] = brand;
    console.log(`Added brand: ${name}`);
  }
  
  async function sellerCreate(index, name, shoebrand, established) {
    const sellerdetail = { name: name, shoebrand: shoebrand, established: established };
  
    const seller = new Seller(sellerdetail);
  
    await seller.save();
    sellers[index] = seller;
    console.log(`Added seller: ${name} ${shoebrand}`);
  }
  
  async function shoeCreate(index, title, seller, summary, brand) {
    const shoedetail = {
      title: title,
      seller: seller,
      summary: summary,
    };
    if (brand != false) shoedetail.brand = brand;
  
    const shoe = new Shoe(shoedetail);
    await shoe.save();
    shoes[index] = shoe;
    console.log(`Added shoe: ${title}`);
  }
  
  async function shoeInstanceCreate(index, shoe, manufactured, restocking, status) {
    const shoeinstancedetail = {
      shoe: shoe,
      manufactured: manufactured,
    };
    if (restocking != false) shoeinstancedetail.restocking = restocking;
    if (status != false) shoeinstancedetail.status = status;
  
    const shoeinstance = new ShoeInstance(shoeinstancedetail);
    await shoeinstance.save();
    shoeinstances[index] = shoeinstance;
    console.log(`Added shoeinstance: ${shoe}`);
  }
  
  async function createBrands() {
    console.log("Adding brands");
    await Promise.all([
      brandCreate(0, "Adidas", "Germany"),
      brandCreate(1, "Nike", "United States"),
      brandCreate(2, "Converse", "United States"),
    ]);
  }
  
  async function createSellers() {
    console.log("Adding Sellers");
    await Promise.all([
      sellerCreate(0, "Patrick", brands[0], "1993-06-06"),
      sellerCreate(1, "Ben", brands[2], "1972-11-8"),
      sellerCreate(2, "Isaac", brands[1], "1990-01-02"),
      sellerCreate(3, "Bob", brands[1], "1982-11-12"),
      sellerCreate(4, "Bob", brands[2], "1982-11-12"),
      sellerCreate(5, "Jim", brands[0], "2011-12-16"),
    ]);
  }
  
  async function createShoes() {
    console.log("Adding Shoes");
    await Promise.all([
      shoeCreate(0,
        "Chuck Taylor All Star",
        sellers[2],
        "The Converse Chuck Taylor All Star Leather sneaker adds a rich, textured leather upper onto the world’s most iconic high top. The classic star-centered ankle patch, vulcanized rubber sole, brushed metal eyelets, reinforced rubber toe cap, padded footbed and cultural authenticity remain in tact.",
        brands[2]
      ),
      shoeCreate(1,
        "One Star Pro Classic Suede",
        sellers[0],
        "The iconic One Star Pro doubles down on its cushioning system to help withstand impact while you tear it up.",
        brands[2]
      ),
      shoeCreate(2,
        "YEEZY BOOST 350 V2",
        sellers[1],
        "The YEEZY BOOST 350 V2features an upper composed of re-engineered Primeknit. The post-dyed monofilament side stripe is woven into the upper. Reflective threads are woven into the laces. The midsole utilizes adidas’ innovative BOOST™ technology.",
        brands[0]
      ),
      shoeCreate(3,
        "SAMBA XLG SHOES",
        sellers[4],
        "The adidas Samba shoes have dominated the street scene for decades. This version stays authentic to the original look but absorbs influences from two dominant cultures: football and skateboarding. Signature XLG tooling and the sidewall pattern add attitude, and a thicker midsole gives it a slight lift. Comfort comes in strong with a full-length EVA drop-in plus extra padding on the moulded tongue.",
        brands[0]
      ),
      shoeCreate(4,
        "Air Jordan 1 High OG 'Mauve",
        sellers[3],
        "The Air Jordan 1 High OG brings back the classic, giving you an iconic look with a familiar feel. Mauve leather overlays offer soft contrast with the neutral upper, creating a clean, season-right finish. Like MJ's signature turnaround jumper, this modern expression of the all-time fave is nothing but net.",
        brands[1]
      ),
      shoeCreate(5,
        "Nike SB Dunk Low",
        sellers[4],
        "The classic skate shoe that works on the board—and off. This premium take on the Dunk Low is crafted with crisp leather and a gum outsole, bringing a dash of allure every time you land a trick. Meanwhile, its airy textile tongue and Zoom Air cushioning underfoot keep you light on your feet even during the longest skate sessions. And that Swoosh—more contrast than a tuxedo. More daring, too",
        brands[1]
      ),
    ]);
  }
  
  async function createShoeInstances() {
    console.log("Adding shoe instance");
    await Promise.all([
      shoeInstanceCreate(0, shoes[0], "China", false, "Available"),
      shoeInstanceCreate(1, shoes[1], "Vietnam", false, "Limited"),
      shoeInstanceCreate(2, shoes[2], "Mexico", false, "Restocking"),
      shoeInstanceCreate(3, shoes[3], "USA", false, "Available"),
      shoeInstanceCreate(4, shoes[4], "China", false, "Limited"),
      shoeInstanceCreate(5, shoes[5], "USA", false, "Unavailable"),
    ]);
  }