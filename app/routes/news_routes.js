//routes for the news CRUD operations
var mysql = require('mysql');
var hn = require('hackernews-api');
var fs = require('fs');
var bodyParser = require('body-parser');


var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'shubham.1',
  database        : 'artoo'
});


module.exports = function(app, db) {

app.use(bodyParser.urlencoded({ extended: false }));

	//end point for index route
	app.get('/',(req,res)=>{
		fs.readFile('index.html', function(err, data) {
		    res.writeHead(200, {'Content-Type': 'text/html'});
		    res.write(data);
		    res.end();
		});
	});


	// end point to fetch all the news with comments and tags
	app.get('/news', (req, res) => {
    
	  pool.query("SELECT news.id,news.title,news.url,news.points,news.created_at,group_concat(comments.body) as comment,group_concat(distinct news_tags.tag_id) as tag_id,group_concat(distinct tags.tag) as tag FROM news LEFT OUTER JOIN comments ON comments.news_id=news.id LEFT OUTER JOIN news_tags ON news_tags.news_id=news.id  LEFT OUTER JOIN tags ON news_tags.tag_id=tags.id  GROUP BY news.id", function (err, result, fields) {
	    if (err) console.log(err);
	    res.header("Access-Control-Allow-Origin", "*");
	    
	    res.send(result);
	    
	  });
	
  	});


	//end point to search the query
	app.get('/search', (req, res) => {
		var term = req.query.query;
		console.log(term);
	  var sql = "SELECT news.id,news.title,news.url,news.points,news.created_at,group_concat(comments.body) as comment,group_concat(distinct news_tags.tag_id) as tag_id,group_concat(distinct tags.tag) as tag FROM news LEFT OUTER JOIN comments ON comments.news_id=news.id LEFT OUTER JOIN news_tags ON news_tags.news_id=news.id  LEFT OUTER JOIN tags ON news_tags.tag_id=tags.id   where title LIKE '%"+term+"%' GROUP BY news.id";
	  
	  pool.query(sql,function (err, result, fields) {
	    if (err) console.log(err);
	    
	    res.header("Access-Control-Allow-Origin", "*");
	    res.send(result);
	    
	  });
	
  	});

  	//end point to save favourite link

  	app.post('/save',(req,res)=>{
  		var news_id = req.body.news_id;
  		var user_id = req.body.user_id;
  		var sql = "INSERT INTO fav_link (news_id, user_id) VALUES ("+news_id+","+user_id+")";
	  pool.query(sql,function (err, result, fields) {
	    if (err) console.log(err);
	    res.header("Access-Control-Allow-Origin", "*");
	    
	    res.send(result);
	    
	  });
  	});


  	//end point to add new top stories to the news table
	app.get('/populate',(req,res)=>{
		var stories = [];
		var sql = "TRUNCATE TABLE news"; 
			pool.query(sql,function(err,result){
				if(err) throw err;

				getTopStories()
				.then(topStories=>{
					
					var arr;
					for(count = 0; count < 50; count++){
						arr = [];

						//get the details of one story from storyId
						getStoryItem(topStories[count])
						.then(story=>{
							arr = [ story.title,story.url,story.id,story.score,story.time];
								sql = "INSERT INTO news (title, url, story_id, points, created_at) VALUES ?";
								pool.query(sql, [[arr]],function (err, result) {
								   if (err) throw err;
								});
						});
						
						
					}
				});

				// .then(stories=>{

				// 	console.log(stories);
				// 	sql = "INSERT INTO news (title, url, story_id, points, created_at) VALUES ?";
				// 	pool.query(sql, [stories],function (err, result) {
				// 	   if (err) throw err;
				// 	});
				// });

		});
	});

	function createStoryArray(arr,stories)
	{
		return new Promise((resolve,reject)=>{
			stories.push(arr);
			if(!story)
			{
				throw err;
			}
			else{
				return resolve(stories);
			}	
		});

	}
	function getStoryItem(Id)
	{
		return new Promise((resolve,reject)=>{
			var story = hn.getItem(Id);
			if(!story)
			{
				throw err;
			}
			else{
				return resolve(story);
			}	
		});
		
	}
	function truncateTable(callback)
	{
		var sql = "TRUNCATE TABLE news"; 
			pool.query(sql,function(err,result){
				if(err) throw err;
				callback(true);

		});
	}

	function getTopStories()
	{
		return 	new Promise((resolve,reject)=>{
			var topStories = hn.getTopStories();
			if(!topStories)
			{
				throw err;
			}
			else{
				resolve(topStories);
			}
		})
	}
};