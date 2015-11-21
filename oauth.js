var AppSetting = require('./setting');
var OAuth = require('OAuth').OAuth;
var FF_CONFIG = {
  REQUEST_TOKEN_URL: 'http://fanfou.com/oauth/request_token',
  ACCESS_TOKEN_URL: 'http://fanfou.com/oauth/access_token',
  AUTHORIZE_URL: 'http://fanfou.com/oauth/authorize'
};

function Fanfou ( config ) {
  this.consumerKey = AppSetting.CONSUMER_KEY;
  this.consumerSecret = AppSetting.CONSUMER_SECRET;
  this.requestTokenURL = FF_CONFIG.REQUEST_TOKEN_URL;
  this.accessTokenURL = FF_CONFIG.ACCESS_TOKEN_URL;
  this.authorizeURL = FF_CONFIG.AUTHORIZE_URL;
  this.API_BASE_URL = 'http://api.fanfou.com';
  this.oauth = new OAuth(
    this.requestTokenURL,
    this.accessTokenURL,
    this.consumerKey,
    this.consumerSecret,
    '1.0',
    null, // authorize callback
    'HMAC-SHA1',
    null, // nonceSize
    null // customHeaders
  );
};

Fanfou.prototype.getOAuthRequestToken = function (next) {
  this.oauth.getOAuthRequestToken(
    function (err, oauth_token, oauth_token_secret, results) {
      if (err) {
        console.log('Get OAuthRequestToken Error: ' + err);
        next();
      } else {
        var oauth = {};
        oauth.token = oauth_token;
        oauth.token_secret = oauth_token_secret;

        this.token = oauth_token;
        this.token_secret = oauth_token_secret;

        console.log('oauth.token: ' + oauth.token);
        console.log('oauth.token_secret: ' + oauth.token_secret);
        next(oauth);
      }
    }
  )
};

Fanfou.prototype.getOAuthAccessToken = function (oauth, next) {
  this.oauth.getOAuthAccessToken(
    this.token, 
    this.token_secret, 
    oauth.verifier,
    function (err, access_token, access_token_secret, results) {
      if (err) {
        console.log('Get OauthAccessToken Error: ' + err);
        next();

      } else {
        oauth.access_token = access_token;
        oauth.access_token_secret = access_token_secret;

        this.access_token = access_token;
        this.access_token_secret = access_token_secret;
        next(oauth);
      }
    }
  ) 
};

Fanfou.prototype.getUserPorfile = function (params, error, success) {
  var path = '/users/show.json';
  var requestURL = this.API_BASE_URL + path;
  this.doRequest(requestURL, error, success);
}

Fanfou.prototype.getHomeStatusTimeline = function (params, error, success) {
  var path = '/statuses/home_timeline.json?count=40';
  var requestURL = this.API_BASE_URL + path;
  this.doRequest(requestURL, error, success);
}

Fanfou.prototype.doRequest = function (url, error, success) {
  this.oauth.get(
    url, 
    this.access_token, 
    this.access_token_secret, 
    function (err, body, response) {
      console.log('URL [%s]', url);
      if (!err && response.statusCode == 200) {
          success(body);
      } else {
          error(err, response, body);
      }
    }
  );
};


module.exports = Fanfou;