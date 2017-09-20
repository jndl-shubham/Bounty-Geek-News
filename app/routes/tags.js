//route to the the tags CRUD operations
var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'shubham.1',
  database        : 'artoo'
});

var bodyParser = require('body-parser');
module.exports = function(app, db) {
	app.use(bodyParser.urlencoded({ extended: false }));

	// end point to create and link tags to the news
	app.post('/tags/add', (req, res) => {
	  var tag = req.body.tag;
	  var tag_id;
	  var news_id = req.body.news_id;

	  // for now , I have created once dummy user since there is no auth in place.
	  var user_id = 1;

	  //check if tag already exists in the table
  	  var sql = "SELECT * FROM tags WHERE tag = '"+tag+"'";

	  pool.query(sql,function (err, result, fields) {
	    if (err) throw err;
	    
	    // if tag doesn't exist, create a tag and then used the new id to the news.
	    else if(result.length==0)
	    {
	    	sql = "INSERT INTO tags (tag) VALUES ('"+tag+"')";
	    	pool.query(sql, function(err,result,fiels){
	    		if(err) throw err;
	    		tag_id = result.insertId;
	    		sql = "INSERT INTO news_tags (news_id,tag_id,user_id) VALUES ("+news_id+","+tag_id+","+user_id+")";
				pool.query(sql,function (err, result, fields) {
				    if (err) throw err;
				    res.header("Access-Control-Allow-Origin", "*");
				    
				    res.send(result);
				    
				});
	    		
	    		
	    	});

	    }

	    //if tag exists, link that tag to the news.
	    else if(result.length!=0)
	    {
	    	tag_id = result[0].id;
	    	sql = "INSERT INTO news_tags (news_id,tag_id,user_id) VALUES ("+news_id+","+tag_id+","+user_id+")";
			pool.query(sql,function (err, result, fields) {
			    if (err) throw err;
			    res.header("Access-Control-Allow-Origin", "*");
			    
			    res.send(result);
			    
			});
	    }
	    
	  });
  });

	
};