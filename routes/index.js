var express = require('express');
var router = express.Router();

var mongodb = require('mongodb').MongoClient;

var shortid = require('shortid');

//Remove dashes and underscores from char list
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var validUrl = require('valid-url');

// var config = require('../config');
var host = process.env['host'];
var name = process.env['name'];
var mLab = 'mongodb://' + host + '/' + name;
// var mLab = 'mongodb://' + config.db.host + '/'+ config.db.name;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Url Shortener' });
});

/* GET new url*/
router.get('/new/:url(*)', function(req, res, next){
	mongodb.connect(mLab, function(err,db){
		if(err){
			console.error("Failed to connect to server", err);
		}
		else{
			console.log("Connected to server");
		
			var collection = db.collection("links");
			var params = req.params.url;

			var local = req.get('host') + '/';

			var shortLink = function(db,callback){
				collection.findOne({ "original_url": params}, { short_url: 1, _id: 0}, function(err,doc){
					if(doc !== null){
						res.json({url: params, shortUrl: local + doc.short_url});
					}
					else{

						if(validUrl.isUri(params)){
							var shortCode = shortid.generate();
							var shortLink = { original_url: params, short_url: shortCode };
							collection.insert([shortLink]);
							res.json({ url: params, shortUrl: local + shortCode });
						}
						else{
							res.json({ error: "Wrong url format, make sure you have a valid protocol and a real site." });
						}
					}
				});
			};

			shortLink(db,function(){
				db.close();
			});
		}
	});	
});

/*GET Shortened url page*/
router.get('/:shorturl', function(req, res, next){
	
	mongodb.connect(mLab, function(err,db){
		if(err){
			console.error('Failed to connect to server');
		}
		else{
			console.log('Connected to server');

			var collection = db.collection('links');
			var params = req.params.shorturl;

			var findLink = function(db, callback){
				collection.findOne({ 'short_url': params }, { original_url: 1, _id: 0 }, function(err,doc){
					if(doc !== null){
						res.redirect(doc.original_url);
					}
					else{
						res.json({ error: " Shortlink was not found in the database." });
					}
				});
			};

			findLink(db, function(){
				db.close();
			});
		}
	});
});

module.exports = router;