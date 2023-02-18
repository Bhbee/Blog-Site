const Articles = require("../models/article");


exports.renderAllPublishedArticle = (async(req, res) => {
    const author = req.query.author
    const title = req.query.title
    const tag = req.query.tag
    try{
        let articles
        const page = req.query.p || 0
        const articlesPerPage = 20 
        if (author){
            articles = await Articles.find({state: "published"})
            .find({author})
            .sort({ createdAt: 'desc' })
            .skip(page * articlesPerPage)
            .limit(articlesPerPage)
        }else if(title){
            articles = await Articles.find({state: "published"})
            .find({title})
            .sort({ createdAt: 'desc' })
            .skip(page * articlesPerPage)
            .limit(articlesPerPage)
        }else if(tag){
            articles = await Articles.find({state: "published"})
            .find({tag})
            .sort({ createdAt: 'desc' })
            .skip(page * articlesPerPage)
            .limit(articlesPerPage)
        }else{
            articles = await Articles.find({state: "published"})
            .sort({ createdAt: 'desc' })
            .skip(page * articlesPerPage)
            .limit(articlesPerPage)
        }  
        //res.status(200).json(articles)
        res.render('articles/home', { articles : articles })
        
    }catch(err){
        res.status(500).json(err)
    }   
})

