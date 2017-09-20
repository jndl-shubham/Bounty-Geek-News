//routes for news. this file uses firebase for database

var hn = require('hackernews-api');
var fs = require('fs');
var bodyParser = require('body-parser');
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyCZGaV9ENDHZVtMjoVPD7HtvWurhKh4gtg",
    authDomain: "artoo-c850e.firebaseapp.com",
    databaseURL: "https://artoo-c850e.firebaseio.com",
    projectId: "artoo-c850e",
    storageBucket: "artoo-c850e.appspot.com",
    messagingSenderId: "792196420015"
};
firebase.initializeApp(config);



module.exports = function(app, db) {

app.use(bodyParser.urlencoded({ extended: false }));
	app.get('/',(req,res)=>{
		fs.readFile('index.html', function(err, data) {
		    res.writeHead(200, {'Content-Type': 'text/html'});
		    res.write(data);
		    res.end();
		});
	});
	app.get('/news', (req, res) => {
    //con.connect(function(err) {
	  //if (err) console.log(err);\
	  var news =[];
	  var db = firebase.database().ref();
	  var newsRef = db.child("news");
	  newsRef.once("value", function(snapshot) {
	  	snapshot.forEach(function(childSnapshot){
	  		var newsJson = childSnapshot.toJSON();
	  		newsJson.comments=[];
	  		if(childSnapshot.hasChild("comments"))
	  		{
	  			var comments = childSnapshot.child("comments").val();
	  			for(var i in comments)
	  			{
	  				var commentsRef = db.child("comments/"+i);
	  				commentsRef.once("value")
	  				.then(function(snap){
	  					newsJson.comments.push(snap.toJSON());
	  					console.log(newsJson);
	  				});
	  			}
	  		}
	  		news.push(newsJson);
	  	});
	  	//console.log(news);
	 //  	var newsJson = snapshot.toJSON();
	 //  	newsJson.comments=[];
	 //  	console.log(newsJson);
		// if(snapshot.hasChild("comments"))
		// {
		// 	var comments = snapshot.child("comments").val();
		// 	for(var i in comments)
		// 	{
		// 		var commentsRef = db.child("comments/"+i);
		// 		commentsRef.on("value",function(snap){
		// 			var commentsJSON = snap.toJSON();
		// 			console.log(commentsJSON);
		// 			newsJson.comments.push(commentsJSON);
		// 		})

		// 	}

		// }
	  },function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	  });

	  // var tagsRef = firebase.database().ref("tags");
	  // tagsRef.push("node");

	  // var userRef = firebase.database().ref("users");
	  // userRef.push({
	  // 	name:"Shubham Jindal",
	  // 	email:"jndl.shubham@gmail.com"
	  // });

	  // var commentsRef = firebase.database().ref("comments");
	  // var newCommentRef = commentsRef.push({
	  // 	body:"awesome article!",
	  // 	userId:"-KuQgRNgsfdHcDqpuuBU",
	  // 	newsId:"-KuQXRDL-227a-0p-6aX"
	  // });
	  // var commentId = newCommentRef.key;
	  

	  //var updates = {};
	  // updates['/news/-KuQXRDL-227a-0p-6aX/comments/' + commentId] = true;
	  // return firebase.database().ref().update(updates);

	  // var newsTagsRef = firebase.database().ref("news_tags");
	  // newsTagsRef.set({
	  // 	"-KuQXRDL-227a-0p-6aX":{
	  // 		"-KuQfomtqNjC0gDOz8Cp":true,
	  // 	}
	  // });


	  
  	});

	app.get('/populate',(req,res)=>{
		
		var topStories = hn.getTopStories();
		var stories = [];
		var arr;
		var newsRef = firebase.database().ref("news");
		for(count = 0; count < 10; count++){
			arr = [];
			var story = hn.getItem(topStories[count]);

			newsRef.push({
				title:story.title,
				url:story.url,
				id:story.id,
				score:story.score,
				time:story.time
			});
		}
	});
};