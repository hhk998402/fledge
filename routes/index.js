var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

router.get('/twitter',(req,res,next)=>{
    var stream = client.stream('statuses/filter', {track: 'javascript'});
    stream.on('data', function(event) {
        res.send(event && event.text);
    });

    stream.on('error', function(error) {
        throw error;
    });
})

<<<<<<< HEAD
router.get('/nikepage',(req,res,next)=>{
    res.render('nike', { title: 'Express' });
});
=======
>>>>>>> cf50d44ec4d430b6c564c27fc28cfd6e575c1049
module.exports = router;
