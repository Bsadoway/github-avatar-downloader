var request = require('request');
var fs = require("fs");
var mkdirp = require("mkdirp");
var dotenv = require('dotenv').config();

var args = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, callback) {

  if(!process.env.GITHUB_TOKEN){
    console.log("Invalid token or incorrect credentials, please contact an admin.");
    return false;
  }

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    json: true,
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + process.env.GITHUB_TOKEN
    },
  };

  request(options, function(err, res, body) {
    if(res.headers.status !== "200 OK"){
        err = res.headers.status;
    }

    callback(err, body);
  });
}

function cb(err, body) {
  if (err) {
    console.log(err);
    return false;
  }

  body.forEach(function(person) {
    mkdirp('./avatars/', function (err) {
      if (err) {
        console.error(err);
      }
    });
    var newPath = './avatars/' + person.login;
    downloadImageByURL(person.avatar_url, newPath);
  });

}

function downloadImageByURL(url, filePath) {
  request
    .get(url)
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(reponse) {
      console.log("Downloading image...");
      console.log(reponse.statusMessage);
      console.log(reponse.headers['content-type']);
    })
    .pipe(fs.createWriteStream(filePath))
    .on('finish', function() {
      console.log("Download complete.");
    });
}


getRepoContributors(args[0], args[1], cb);
