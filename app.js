// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCZGaV9ENDHZVtMjoVPD7HtvWurhKh4gtg",
    authDomain: "artoo-c850e.firebaseapp.com",
    databaseURL: "https://artoo-c850e.firebaseio.com",
    projectId: "artoo-c850e",
    storageBucket: "artoo-c850e.appspot.com",
    messagingSenderId: "792196420015"
  };
  firebase.initializeApp(config);


  var newsItems;
  // call api to get the news list on load
	$( document ).ready(function() {
		
	    $.get("http://localhost:8080/news", function(data, status){
        newsItems = data;
        	addNewsListItems();
    	});
	});
  

  // function to run the search query
	$( "#search-form" ).submit(function( event ) {
	  
	  event.preventDefault();

	  var query = $( "input:first" ).val();
	  
	  $.get("http://localhost:8080/search?query="+query, function(data, status){
          newsItems = data;
	  		  addNewsListItems();
    	});
	  
	});


  // add comment function 
  $( ".list-group" ).on("submit",".comment-form",function( event ) {
    
    event.preventDefault();

    var comment = $( "textarea" ).val();
    var news_id = $(this).parents('.card').siblings('.btn-group').children().first().data('id');

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/comments/add",
        data: {comment:comment,news_id:news_id,user_id:1},
        success: function(data){
          location.reload();
        },
      });
    
  });
  

  // function that adds list items on index.html
  function addNewsListItems()
  {
    var html="";

    $(".list-group").html("");
    $.each(newsItems,function(index,value){

            var commentHtml = "";
            var comments=[];
            var tagArr = [];
            var btnGroupHtml = '<div class="btn-group" role="group" aria-label="..."><button type="button" class="btn btn-default save-link" data-id="'+value.id+'">Add to Favorite</button><button type="button" class="btn btn-default add-comment" data-id="'+value.id+'">Add Comment</button></div>';

            var formHtml = '<div class="card hidden add-comment-form" style="width: 20rem;"><div class="card-block"><form class="comment-form"><div class="form-group"><textarea name="body" placeholder="Your comment here" class="form-control"></textarea></div><div class="form-group"><button type="submit" class="btn btn-primary">Add Comment</button></div></form></div></div>';

            var tagHTML = '<ul class="list-inline"><span class="glyphicon glyphicon-tag" aria-hidden="true"></span>';
            var dateString = convertUnix(value.created_at); 
            if(value.tag!=null)
            {
            	tagArr = value.tag.split(",");
            }
            
            if(value.comment==null){
              comments =[];
            }
            else{
              comments = value.comment.split(",");
              commentHtml = '<div class="card hidden comment-span-block" style="width: 20rem;"><div class="card-block"><ol>';
              $.each(comments,function(index,value){

                commentHtml+='<li>'+value+'</li>';
              });
              commentHtml+='</div></div>';
            }
            $.each(tagArr,function(a,b){
              tagHTML += "<li>"+b+"</li>";
            });
            tagHTML+="</ul>";
            html+='<li class="list-group-item"><a href="'+value.url+'" target="_blank"><h4 class="list-group-item-heading">'+value.title+'</h4></a>'+tagHTML+'<p class="list-group-item-text"><span>'+value.points+' points </span><span>'+dateString+' </span><span class="comment-span"><a>'+comments.length+' comments</a></span></p><br>'+commentHtml+btnGroupHtml+'<hr>'+formHtml+'</li>';
            
          });
          $(".list-group").append(html);
  }

  //function to convert unix timestamp to dd/mm/yyyy format
  function convertUnix(unix)
  {

    var a = new Date(unix*1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var dateString = date + '/' + month + '/' + year; 
    return dateString;
  }


  //function to sort the news by points
  function sortByScore()
  {
    newsItems.sort(function(a,b) {return a.points<b.points});
    console.log(newsItems);

    addNewsListItems();

  }

  //function to sort the news by date
  function sortByTime()
  {
    newsItems.sort(function(a,b) {return a.created_at<b.created_at});
    console.log(newsItems);

    addNewsListItems();    
  }


  // function to add news to the fav link

  $('.list-group').on('click','.save-link',function(event){
    var news_id = $(this).data('id');
      event.preventDefault();
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/save",
        data: {news_id:news_id,user_id:1},
        success: function(data){
          console.log(data);
        },
      });
      
  });

  // function to add dummy data to the firebase

  function addFavLinksFirebase()
  {
  	var userRef = firebase.database().ref("users").child("-KuQgRNgsfdHcDqpuuBU");
      userRef.child("favlinks").set({
        "1":true
      });
  }

  //fuction to show/hide the add comment div
  $('.list-group').on('click','.add-comment',function(event){
    var news_id = $(this).data('id');
    $(this).parent().siblings('.add-comment-form').toggleClass('hidden');
      event.preventDefault();
      

      
  });


  //function to show/hide the comments
  $('.list-group').on('click','.comment-span',function(event){
    event.preventDefault();
    $(this).parent().siblings('.comment-span-block').toggleClass('hidden');
    
  });