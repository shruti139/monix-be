var express = require('express');
var router = express.Router();
const categoryRoute = require("./category.route");
const subCategoryRoute = require("./sub-category.route");
const imageRoute = require("./images.route");
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.use("/category", categoryRoute);
router.use("/subCategory", subCategoryRoute);
router.use("/images", imageRoute);

module.exports = router;
