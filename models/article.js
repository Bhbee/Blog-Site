const mongoose = require("mongoose");
const slugify = require('slugify')

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: "draft",
    },
    body: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    read_count: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    // reading_time: {
    //   type: String,
    //   required: true,
    // },
   
  },
 
  { timestamps: true }

);
ArticleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})
module.exports = mongoose.model("Article", ArticleSchema);