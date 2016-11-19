var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url': 'http://playq.io/o/token/',
  'authorize_url': 'http://playq.io/o/authorize/',
  'access_url': 'http://playq.io/o/authorized_tokens/',
  'consumer_key': 'anonymous',
  'consumer_secret': 'anonymous',
  'application_name': 'PlayQ',
  'callback_page': 'html/chrome_ex_oauth.html'
});
