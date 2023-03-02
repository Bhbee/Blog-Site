const Article = require("../models/article");

//show full details of selected article
exports.showArticle = (async(req, res) => {
    try{
        const article = await Article.findOneAndUpdate({ slug: req.params.slug },
          {
            $inc: {
              "read_count" : 1
            }
          },
          { new: true } )

        if (article == null) res.redirect('/')
        else if (article.author == req.user) {
            res.render('articles/isAuthorshow', { article : article })
        }
        else {
          res.render('articles/show', { article : article })
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})

//CREATE ARTICLE - onCreate, article will be in draft state
exports.createNewArticle = async(req, res) => {

  //add image---upload image using multer
  if(!req?.body?.title || !req?.body?.description){
      return res.status(400).json({"message": "title and description are required"});
  }
  try{
      let reading_time =  Math.ceil(` ${(req.body.body).length}`/ 250)
      const article ={
          "title": req.body.title,
          "description": req.body.description,
          "author": req.user, 
          "body": req.body.body,
          "tag": req.body.tag,
          "read_count": 0,
          "reading_time": reading_time 
      };
      await Article.create(article)
      res.redirect(`/home/${(article.title).toLowerCase()}`)
      //res.status(201).json({"message": "Project created"}) // created
  }
  catch (err) {
      return res.status(500).json({"message": err.message});
      //res.render('articles/new')
  }
}

//Edit selected article, only allowed by author of article 
exports.editSelectedArticlePage = (async (req, res) => {
  const article = await Article.findById(req.params.id)
  if (article.author === req.user) {
    res.render('articles/edit', { article: article })
  }

})

exports.editSelectedArticle = async(req, res) => {
    const article = await Article.findById(req.params.id);
    try {
        if(!article) {
          res.render('/')
          //return res.status(200).json({"message": "Article doesn't exist" });
        }
        else {
            if (article.author === req.user) {
                try {
                  const article = await Article.findByIdAndUpdate(
                    req.params.id,
                    {
                      $set: req.body,
                    },
                    { new: true }
                  );
                  res.render('articles/isloggedInshow', { article : article })
                  //res.status(200).json(updatedArticle);
                } catch (err) {res.status(500).json(err)};
            }else{
              res.render('show', { article : article } )
              //res.status(401).json("You can update only your article!")
            }
        }
    }
    catch (err) {res.status(500).json(err)}
}

//DELETE BLOG
exports.deleteSelectedArticle = async(req, res) => {
  try {
      const article = await Article.findById(req.params.id);
      if (article.author === req.user) {
          try {
            await article.delete();
            //res.status(200).json("article has been deleted...");
            res.redirect('/')
          } catch (err) {
            res.status(500).json(err);
          }
      } 
      else {
          res.status(401).json("You can delete only your blogs!");
        }
  } 
  catch (err) {
        res.status(500).json(err);
  }
}

//PUBLISH ARTICLE
exports.publishArticle = async(req, res) => {
  try {
    const article = await Article.findByIdAndUpdate( req.params.id,
      {
        $set: {
          "state" : "published"
        }
      },
      { new: true } )
          //res.status(200).json("article has been published...");
          res.redirect('/')
    } 
  catch (err) {
        res.status(500).json(err);
  }
}