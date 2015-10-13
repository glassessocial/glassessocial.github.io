// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("locationSaved", function(request, response) {
  var localityName = request.params.name
  var empty=[]
  var query = new Parse.Query("Location")
  query.equalTo("name", localityName);
  query.find({
    success: function(results) {
      var existsBool = false;
      if (results.length > 0)
      {
        existsBool = true;
      } else {
        existsBool = false;
      }
      if (existsBool)
      {
        response.success("true");
      } else {
        var Location = Parse.Object.extend("Location");
        var location = new Location();
        location.set("name", localityName);
        location.set("music",empty);
        location.set("movies",empty);
        location.set("hangout",empty);
        location.save(null, {
            success: function(location) {
 
                response.success('New object created with objectId: ' + location.id);
            },
            error: function(location, error) {
 
                response.error('Failed to create new object, with error code: ' + error.message);
            }
        });
      }
    },
    error: function() {
      response.error("Sorry, there was an error> (Server-side lookup failed)");
    }
  });
 
});
 
Parse.Cloud.define("movieSaved",function(request,response){
    var localName=request.params.localityName
    var movieName = request.params.movieName
    var query= new Parse.Query("Location")
    query.equalTo("name",localName)
    query.find({
    success: function(results) {
        var L = results[0];
        var favMovie=L.get("movies");
        favMovie.push(movieName);
        var test=swag(favMovie);
        var arr=test[0];
        var arr2=test[1];
        var count=0;
        var place=0;
        for(var i=0;i<arr2.length;i++){
            if(arr2[i]>count){
                count=arr2[i];
                place=i;
            }
        }
        var favoriteMovie=arr[place];
        L.set("favMovie", favoriteMovie)
        L.save(null, {
            success: function(location) {
 
                response.success('New object created with objectId: ' + L.id);
            },
            error: function(location, error) {
 
                response.error('Failed to create new object, with error code: ' + error.message);
            }
        });
    },
    error: function(error) {
        response.error("");
    }
    });
});
Parse.Cloud.define("musicSaved",function(request,response){
    var localName=request.params.localityName
    var songName = request.params.songName
    var query= new Parse.Query("Location")
    query.equalTo("name",localName)
    query.find({
    success: function(results) {
        var Lo = results[0];
        var favSongs=Lo.get("music");
        favSongs.push(songName);
        var test1=swag(favSongs);
        var arr1=test1[0];
        var arr3=test1[1];
        var count1=0;
        var place1=0;
        for(var i=0;i<arr3.length;i++){
            if(arr3[i]>count1){
                count1=arr3[i];
                place1=i;
            }
        }
        var favoriteSong=arr1[place1];
        Lo.set("favSong", favoriteSong)
        Lo.save(null, {
            success: function(location) {
 
                response.success('New object created with objectId: ' + Lo.id);
            },
            error: function(location, error) {
 
                response.error('Failed to create new object, with error code: ' + error.message);
            }
        });
    },
    error: function(error) {
        response.error("");
    }
    });
});
Parse.Cloud.define("hangoutSaved",function(request,response){
    var localityName=request.params.localityName
    var locationName = request.params.locationName
    var query= new Parse.Query("Location")
    query.equalTo("name",localityName)
    query.find({
    success: function(results) {
        var Loc=results[0];
        var favHangouts=Loc.get("hangout");
        favHangouts.push(locationName);
        var test2=swag(favHangouts);
        var arr4=test2[0];
        var arr5=test2[1];
        var count2=0;
        var place2=0;
        for(var i=0;i<arr5.length;i++){
            if(arr5[i]>count2){
                count2=arr5[i];
                place2=i;
            }
        }
        var favoriteHangout=arr4[place2];
        Loc.set("favHangout", favoriteHangout)
        Loc.save(null, {
            success: function(location) {
 
                response.success('New object created with objectId: ' + Loc.id);
            },
            error: function(location, error) {
 
                response.error('Failed to create new object, with error code: ' + error.message);
            }
        });
    },
    error: function(error) {
        response.error("");
    }
    });
});
Parse.Cloud.beforeSave(Parse.User, function(request, response) {
    Parse.Cloud.useMasterKey();
    var userName=request.object.get("username");
    if(userName.length>15){
        response.error("Your username is too long max is 15 characters");
    }else{
        response.success();
    }
});
 
Parse.Cloud.job("trendingUpdate", function(request, status) {
  var counter = 0;
  var locations = [];
  var Posts = Parse.Object.extend("Posts");
  var query = new Parse.Query(Posts);
  query.limit(50);
  query.notEqualTo("numOfReplies", 0);
  query.find({
  success: function(results) {
      for (var i = 0; i < results.length; i++) {
        locations.push(results[i].get("location"));
      }
      var l = mode(locations);
      var GameScore = Parse.Object.extend("Trending");
      var gameScore = new GameScore();
      gameScore.set("Location", l);
      gameScore.save(null, {
      success: function(gameScore) {
      alert('New object created with objectId: ' + gameScore.id);
    },
    error: function(gameScore, error) {
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});
   
   var favoriteMovies =[];
   var favoriteMusic=[];
   var Users=Parse.Object.extend("User");
   var query2= new Parse.Query(Users);
   query2.limit(50);
   query2.notEqualTo("emailVerified",false);
   query2.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        favoriteMovies.push(results[i].get("favMovie"));
        favoriteMusic.push(results[i].get("favMusic"));
      }
      var movie = mode(favoriteMovies);
      var music= mode(favoriteMusic);
      var GameScore2 = Parse.Object.extend("Trending");
      var gameScore2 = new GameScore2();
      gameScore2.set("Movie", movie);
      gameScore2.save(null, {
      success: function(gameScore) {
      alert('New object created with objectId: ' + gameScore2.id);
    },
    error: function(gameScore, error) {
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
      gameScore2.set("Music", music);
      gameScore2.save(null, {
      success: function(gameScore) {
      alert('New object created with objectId: ' + gameScore2.id);
    },
    error: function(gameScore, error) {
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
 
});
 
Parse.Cloud.define("liked", function(request, response){
    var userName=request.params.username;
    var postId=request.params.postID;
    var empty=[];
    var query = new Parse.Query("User")
    query.equalTo("username", userName);
    query.find({
    success: function(results) {
        for (var i = 0; i < results.length; ++i) {
            var yarra = results[0].get("likesArray");
            yarra.push(postId);
            results[0].set("likesArray", yarra);
        }
        results[0].save(null, {
            success: function(location) {
 
                response.success('New object created with objectId: ' + results[0].id);
            },
            error: function(location, error) {
 
                response.error('Failed to create new object, with error code: ' + error.message);
            }
        });
    },
    error: function() {
      response.error("Sorry, there was an error> (Server-side lookup failed)");
    }
  });
    var posts = Parse.Object.extend("Posts");
    var query = new Parse.Query(posts);
    query.get(postId, {
    success: function(posts) {
        var nums=posts.get("numOfLikes");
        if(nums==null){
            nums=0;
        }
        var newNum=nums+1;
        posts.set("numOfLikes",newNum);
        posts.save();
    },
    error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
    }
    });
});
Parse.Cloud.define("numPosts",function(request, response){
    var posts=Parse.Object.extend("Posts")
    var query=new Parse.Query(posts);
    query.equalTo("postee",null);
    query.find({
        success: function(results) {
            var length=results.length;
            for(var i=0;i<results.length;i++){
                results[i].set("numPosts",length);
                results[i].save();
            }
            response.success()
      },
      error: function(error) {
        response.error("Server-side failed.")
      }
    })
 
});
function swag(arr) {
    var a = [], b = [], prev;
    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    return [a, b];
}
function swag2(arr) {
    var a = [], b = [], prev;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    return [a, b];
}
 
function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}
//Latest deploy: v42 - Wednesday July 15th 2015 at 2:12:19pm (-0700) - Parse JavaScript SDK Version: 1.4.2
