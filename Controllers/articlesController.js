const Article = require("../models/article");

//show full details of selected article
exports.showArticle = (async(req, res) => {
    try{
        const article = await Article.findOne({ slug: req.params.slug })
        if (article == null) res.redirect('/')
        else if (article.author == req.user) {
            res.render('articles/isloggedInshow', { article : article })
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
      const article ={
          "title": req.body.title,
          "description": req.body.description,
          "author": req.user, 
          "body": req.body.body,
          "tag": req.body.tag,
          "read_count": 0,
          //"reading_time": (req.body).forEach(element => {}   
      };
      await Article.create(article)
      res.redirect(`/articles/${(article.title).toLowerCase()}`)
      //res.status(201).json({"message": "Project created"}) // created
  }
  catch (err) {
      //return res.status(500).json({"message": err.message});
      res.render('articles/new')
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
                  const article = await Blog.findByIdAndUpdate(
                    req.params.id,
                    {
                      $set: req.body,
                    },
                    { new: true }
                  );
                  res.render('articles/isloggedInshow', { article : article })
                  //res.status(200).json(updatedArticle);
                } catch (err) {res.status(500).json(err)};
            } else {res.status(401).json("You can update only your article!")}
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






















// //UPDATE BLOG: can only be done by author of blog
// exports.updateSelectedArticle = async(req, res) => {
//     const blog = await Blog.findById(req.params.id);
//     try {
//         if(!blog) {
//           return res.status(200).json({"message": "Blog doesn't exist" });
//         }
//         else {
//             if (blog.author === req.user) {
//                 try {
//                   const updatedBlog = await Blog.findByIdAndUpdate(
//                     req.params.id,
//                     {
//                       $set: req.body,
//                     },
//                     { new: true }
//                   );
//                   res.status(200).json(updatedBlog);
//                 } catch (err) {res.status(500).json(err)};
//             } else {res.status(401).json("You can update only your blog!")}
//         }
//     }
//     catch (err) {res.status(500).json(err)}
// }


// //GET ALL BLOGS CREATED BY USER
// exports.getAllUserArticle= async(req, res) => {
//     try {
//         const page = req.query.p || 0
//         const blogsPerPage = 3
//         const blogs = await Blog.find({author: req.User})
//           .skip(page * blogsPerPage)
//           .limit(blogsPerPage)
//         res.status(200).json(blogs) 
//     } 
//     catch (err) {
//         res.status(500).json(err);
//     }
// }

// //GET SELECTED BLOG
// exports.getSelectedArticle= async(req, res) => {
//   const blog = await Blog.findById(req.params.id);
//   if(!blog) {
//       return res.status(204).json({"message": "No project matches search"});}
//   res.json(blog);
// }






