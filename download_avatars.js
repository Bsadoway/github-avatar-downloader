var request = require('request');
var secrets = require('./secrets')
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

getRepoContributors("jquery", "jquery", function(err, result) {

  result.forEach(function(person){
    console.log(person.avatar_url);
  });
  console.log("Errors:", err);
});
