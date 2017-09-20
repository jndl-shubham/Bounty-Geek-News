//routes for comments CRUD operations
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

	//end point to add comments to the table
	app.post('/comments/add', (req, res) => {
    
	  var body = req.body.comment;
	  var news_id = req.body.news_id;
  		var user_id = req.body.user_id;
  		var sql = "INSERT INTO comments (body, news_id, user_id) VALUES ('"+body+"',"+news_id+","+user_id+")";
	  pool.query(sql,function (err, result, fields) {
	    if (err) console.log(err);
	    res.header("Access-Control-Allow-Origin", "*");
	    
	    res.send(result);
	    
	  });
	//});
  });

	
};