var request = require('request');
var secrets = require('./secrets')
var fs = require("fs");

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options ={
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    json: true,
    headers: {
      'User-Agent' : 'request'

    },
    Authorization : secrets.GITHUB_TOKEN
  };
  request(options, function(err, res, body) {
    cb(err, body);
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

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./kvirani.jpg");

getRepoContributors("jquery", "jquery", function(err, result) {

  result.forEach(function(person){
    console.log(person.avatar_url);
  });
  console.log("Errors:", err);
});
