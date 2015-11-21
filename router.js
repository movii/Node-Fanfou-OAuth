var router = require('express').Router();
var OAuth = require('OAuth');
var Fanfou = require('./oauth');
var fanfou = new Fanfou();

function parseTime (timeString) {
	var date = new Date(timeString); 

	return [
		date.getFullYear(),
		'/',
		date.getMonth() + 1,
		'/',
		date.getDate(),
		' ',
		date.getHours(),
		':',
		date.getMinutes(),
		':',
		date.getSeconds()
	].join('');
}

router.get(['/', '/index'], function (req, res) {
	res.render('index');
});

router.get('ind')

router.get('/oauth/fanfou', function (req, res) {
  fanfou.getOAuthRequestToken( function (oauth) {
    var redirectUrl = [
        'http://fanfou.com/oauth/authorize',
        '?oauth_token=', 
        this.token,
        '&oauth_callback=', 
        'http://localhost:3000/oauth/fanfou/callback'
      ].join('');

      fanfou.token = oauth.token;
      fanfou.token_secret = oauth.token_secret;

      res.redirect(redirectUrl);
  });
});

router.get('/oauth/fanfou/callback', function ( req, res, next ) {
  fanfou.getOAuthAccessToken(fanfou.oauth, function (oauth){  
    fanfou.access_token = oauth.access_token;
    fanfou.access_token_secret = oauth.access_token_secret;
    res.redirect('/home');
  });
});

router.get('/home', function ( req, res, next ) {
  var statusData, userData;

  fanfou.getHomeStatusTimeline({'count': 40}, function (){}, function (booy) {
    var jsonData = JSON.parse( booy );
    jsonData.forEach(function (status) {
    	status.created_at = parseTime(status.created_at);
    });

    statusData = jsonData;
    res.render('home', {statuses: statusData });
  })
});

module.exports = router;