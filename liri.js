var keys = require('./keys');
var sKeys = require('./skeys')
var request = require('request');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var fs = require('fs');

var command = process.argv[2];
var inputs = process.argv.slice(3);

var client = new twitter({
	consumer_key: keys.consumer_key,
	consumer_secret: keys.consumer_secret,
	access_token_key: keys.access_token_key,
	access_token_secret: keys.access_token_secret,
});

var spotClient = new spotify({
	id: sKeys.id,
	secret: sKeys.secret,
})


var string = "";

for (i=0; i < inputs.length; i++){
	string += inputs[i] + " ";
}

function switchFun(command, string) {
	switch (command) {
		case "my-tweets":
			tweetTweet();
		break;

		case "spotify-this-song":
			spotSong(string);
		break;

		case "movie-this":
			omdbMovie(string);
		break;

		case "do-what-it-says":
			doAThing(string);
		break;

		default:
	    	console.log("{Available Commands: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
	  	break;
	}
}

function tweetTweet() {
	
	var param = {screen_name: "blatde91"};

	client.get('statuses/user_timeline/', param, function(err, tweets, response){
		console.log("i get here");
		if (!err) {
			for (i=0; i<tweets.length; i++) {
				var tweeted = ('Tweet#: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
				console.log(tweeted);
			}
		}

		else {
			console.log("error:" + err);
		}
	});
}

function spotSong(song) {
	if(song === "") {
		song = "All star";
	}
	spotClient.search({type: 'track', query: song}, function(err, data) {
		if(!err){
			result = data.tracks.items;
			console.log("Artist: " + result[0].artists[0].name + "\nSong: " + result[0].name + "\nAlbum: " + result[0].album.name)
		}
		else{
			console.log("error :" + err)
		}
	})

}

function omdbMovie(movie) {
	if(movie === "") {
		movie = "The Room";
	}

	var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";
	request(queryURL, function(err, res, body) {
		if (!err && res.statusCode === 200) {
			var movieSearch = JSON.parse(body);

			console.log("Title: " + movieSearch.Title);
			console.log("Release Year: " + movieSearch.Year);
			console.log("IMdB Rating: " + movieSearch.imdbRating);
			console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
			console.log("Country: " + movieSearch.Country);
			console.log("Language: " + movieSearch.Language);
			console.log("Plot: " + movieSearch.Plot);
			console.log("Actors: " + movieSearch.Actors);
		}

		else {
			console.log("Error: " + err);
		}
	});
}

function doAThing() {
	fs.readFile('random.txt', 'utf8', function(err, data) {
		if(!err) {
			var randomText = data.split(',');
			var command = randomText[0];
			var string = randomText[1];

			switchFun(command, string);
		}

		else {
			console.log("Error: " + err);
		}
	})
}
switchFun(command, string);