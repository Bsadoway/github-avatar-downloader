var request = require('request');
var secrets = require('./secrets')
var fs = require("fs");

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, callback) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    json: true,
    headers: {
      'User-Agent': 'request'
    },
    Authorization: secrets.GITHUB_TOKEN
  };

  request(options, function(err, res, body) {
    callback(err, body);
  });
}

function cb(err, body) {
  body.forEach(function(person) {
    var newPath = './avatars/' + person.login + '.jpg';
    downloadImageByURL(person.avatar_url, newPath);
  });
  if (err) {
    console.log("Error:", err);
  }
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

getRepoContributors("jquery", "jquery", cb);
