const express = require('express'),
  path = require('path'),
  bdParser = require('body-parser'),
  exphps = require('express-handlebars'),
  mongoose = require('mongoose'),
  ScrapeRoute = require('./routes/scrapes');

const app = express();

//body parser middleware - settings
app.use(bdParser.urlencoded({extended: false}));
app.use(bdParser.json());

//connect to mongoose
mongoose.connect("mongodb://kb2232:kb22321988@ds139921.mlab.com:39921/stylist-dev");
const db_obj = mongoose.connection;
db_obj.on('error', console.error.bind(console, 'connection error:'));
db_obj.once('open', function() {
  console.log('MongoDB Connected...');
});

app.engine('handlebars',exphps({defaultLayout:'main'}));
app.set('view engine','handlebars');


//to be able to use the PUBLIC folder
app.use(express.static(path.join(__dirname,'public')));

ScrapeRoute(app);

const PORT = process.env.PORT || 5000;
  app.listen(PORT,()=>{
    console.log(`Server listen at door:${PORT}`);
  });
