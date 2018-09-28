const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating staff schema
const ArticleSchema = new Schema({
  title: String,
  url: String,
  comments:[{
    commentBody:{
      type:String,
      required: true
    },
    commentDate:{
      type:Date,
      default:Date.now
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('articlecollection', ArticleSchema);