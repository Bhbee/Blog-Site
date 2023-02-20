const express = require("express");
const router = express.Router();

const articlesController = require("../controllers/articlesController");



router.post('/', articlesController.createNewArticle);
router.get('/new', (req, res) => res.render('articles/new'))


router.get('/edit/:id', articlesController.editSelectedArticlePage)
router.put('/edit/:id', articlesController.editSelectedArticle)

router.delete('/', articlesController.deleteSelectedArticle);

router.put('/publish/:id', articlesController.publishArticle)





module.exports = router;