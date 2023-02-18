const express = require("express");
const router = express.Router();
const verifyJWT = require("../middewares/verifyJWT");
const homeController = require("../controllers/homeController");
articleController = require("../controllers/articlesController");

//RENDER ALL PUBISHED BLOGS

router.get('/', homeController.renderAllPublishedArticle);

//READ MORE
router.get('/home/:slug', verifyJWT, articleController.showArticle)



module.exports = router;