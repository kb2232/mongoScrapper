const rp = require('request-promise'),
  cheerio = require('cheerio'),
  Article = require('../models/Articles');

module.exports = (app) => 
{
  app.get('/',(req,res)=>{
    res.redirect('/');
  });

  app.get('/searcharticle', (req,res)=>
  {
      ////////////////////////////////////////////////////
      options = {
        uri: 'https://news.ycombinator.com/',
        transform: function (body) {
            return cheerio.load(body);
        }
      };
      rp(options)
      .then(($)=>
      {
        if($) 
        {
          var parsedResults = [];
          $('span.comhead').each((i, element)=>
          {
            // Select the previous element
            var a = $(this).prev();
            // Get the rank by parsing the element two levels above the "a" element
            var rank = a.parent().parent().text();
            // Parse the link title
            var title = a.text();
            // Parse the href attribute from the "a" element
            var url = a.attr('href');
            // Get the subtext children from the next row in the HTML table.
            var subtext = a.parent().parent().next().children('.subtext').children();
            // Extract the relevant data from the children
            var points = $(subtext).eq(0).text();
            var username = $(subtext).eq(1).text();
            var comments = $(subtext).eq(2).text();
            // Our parsed meta data object
            var metadata = {
              rank: parseInt(rank),
              title: title,
              url: url,
              points: parseInt(points),
              username: username,
              comments: parseInt(comments)
            };
            // Push meta-data into parsedResults array
            parsedResults.push(metadata);
          });
          return parsedResults;
        } else {console.log("wrong status code")}
      })
      .then((result)=>{
        //all went well
        result.forEach(element => 
          {
            const newArticle = new Article({
            title:element.title,
            url:element.url
          });
          newArticle.save();
        });
        res.redirect('/api/fetchdata');
      })
      .catch(err=>{console.log(err)}); 
      ////////////////////////////////////////////////////
  });

  // fetch from database;
  app.get('/api/fetchdata',(req,res)=>{
    Article.find({}).sort({ date: 'desc' }).then(article => 
      {
        res.render('stories/index', 
        {
          data: article,
        });
      });
  })
}