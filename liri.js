require("dotenv").config();
var fs = require("fs");
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require("request");
var moment = require('moment');

var command = process.argv[2];
var input = process.argv;
input = input.splice(3, input.length);
input = input.join("+");

function getConcert(artist) {
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  request(queryURL, function(err, response, body){
    if (err) { return console.log(err); }
    if (response.statusCode !== 200) { return console.log(response); }
    body = JSON.parse(body);
    console.log(artist + " is playing at " + body[0].venue.name + " in " + body[0].venue.city + ", " + body[0].venue.region + " on " + moment(body[0].datetime).format("MM/DD/YYYY"));
  });
}

function getSong(track) {
  // spotify.search(function({ type: 'track', query: track, limit: 1 }, callback);
  spotify.search({ type: 'track', query: track, limit: 1 }, function(err, data) {
    if (err) { return console.log(err); }

    track1 = data.tracks.items[0];
    console.log("Artist: " + track1.album.artists[0].name);
    console.log("Song Name: " + track1.name);
    console.log("Album Name: " + track1.album.name);
    console.log("Track Preview: " + track1.preview_url);
  });
}

function getMovie(movie) {
  var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;
  request(queryURL, function(err, response, body){
    if (err) { console.log(err); }
    if (response.statusCode !== 200) { console.log(response); }

    body = JSON.parse(body);
    console.log("Movie Title: " + body.Title);
    console.log("Release Year: " + body.Year);
    console.log("IMDB Rating: " + body.imdbRating);
    console.log("Rotten Tomatoes Rating: " + body.Ratings[1].Value);
    console.log("Country of Origin: " + body.Country);
    console.log("Language: " + body.Language);
    console.log("Plot Summary: " + body.Plot);
    console.log("Actors: " + body.Actors);
  });
}

function runCommand(command, input) {
  switch (command) {
    case "concert-this":
        getConcert(input);
      break;
    case "spotify-this-song":
        getSong(input);
      break;
    case "movie-this":
        getMovie(input);
      break;
    default:
      console.log("Please enter a valid command.");
  }
}


//Initiate program
if (command === "do-what-it-says") {
  randomTxt = fs.readFile("random.txt", "utf8",  function(err, data){
    if (err) {console.log(err);}

    //seperate info in txt file by comma
    data = data.split(",");
    // set new input and comman
    command = data[0];
    input = data[1];
    //remove quotes
    input = input.slice(1, (input.length - 2));

    runCommand(command, input);
  });
}
else {
  runCommand(command, input);
}
