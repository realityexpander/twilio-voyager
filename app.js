var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var twilio = require('twilio');

// Twilio : realityexpanderdev@gmail.com

// ngrok: realityexpanderdev@gmail.com vai github
//    https://1900e55995af.ngrok.io

// Load configuration information from system environment variables.
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Create an authenticated client to access the Twilio REST API
var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// render our home page
app.get('/', function(req, res, next) {
  res.render('index');
});

// JSONP test
app.get('/jsonp', function(req, res, next) {
  // res.locals.value = '{"user":1}'
  // res.render('jsonp');

  res.send("parseJsonP({user:1})")
});

// handle a POST request to send a text message. 
// This is sent via ajax on our home page
app.post('/message', function(req, res, next) {
  // Use the REST client to send a text message
  client.messages.create({
    to: req.body.to,
    from: TWILIO_PHONE_NUMBER,
    body: 'Good luck on your Twilio quest!'
  }).then(function(message) {
    // When we get a response from Twilio, respond to the HTTP POST request
    res.send('Message is inbound!');
  });
});

// handle a POST request to make an outbound call.
// This is sent via ajax on our home page
app.post('/call', function(req, res, next) {
  // Use the REST client to send a text message
  client.calls.create({
    to: req.body.to,
    from: TWILIO_PHONE_NUMBER,
    url: 'http://demo.twilio.com/docs/voice.xml'
  }).then(function(message) {
    // When we get a response from Twilio, respond to the HTTP POST request
    res.send('Call incoming!');
  });
});

// Create a TwiML document to provide instructions for an outbound call
app.post('/hello', function(req, res, next) {
  // Create a TwiML generator
  var twiml = new twilio.twiml.VoiceResponse();
  // var twiml = new twilio.TwimlResponse();
  twiml.say('Hello there! You have successfully configured a web hook.');
  twiml.say('Good luck on your Twilio quest!', { 
      voice:'woman' 
  });

  // Return an XML response to this request
  res.set('Content-Type','text/xml');
  res.send(twiml.toString());
});

// Create a route to handle incoming SMS messages
// This is where the magic happens!
app.post('/sms', (req, res) => {
  
  console.log(
    `Incoming message from ${req.body.From}: ${req.body.Body}`
  );

  // var twiml = new twilio.twiml.MessagingResponse();
  // let str = req.body.Body.split('').reverse().join("");
  // twiml.message(`TwilioQuest rules! ${req.body.From} ${str}`)
  // res.set('Content-Type','text/xml');
  // // res.redirect('https://1900e55995af.ngrok.io/moreinstructions')
  // res.send(twiml.toString());

  // res.type('text/xml');
  res.set('Content-Type','text/xml');
  res.send('<Response><Redirect>https://1900e55995af.ngrok.io/moreinstructions</Redirect></Response>')
  // res.redirect('https://1900e55995af.ngrok.io/moreinstructions')
  // res.send("<Response><Message>TwilioQuest rules</Message></Response>")
  // res.send(`<Response><Message action='https://1900e55995af.ngrok.io/status'>TwilioQuest rules - orig message:${req.body.Body}</Message></Response>`)
  // res.send('<Response><Message to="+17372329318">From:{{From}} said:{{Body}}</Message></Response>')
});

app.post('/moreinstructions', (req, res) => {
  console.log(`Some More instructions hit`);
  res.set('Content-Type','text/xml');
  res.send(`
    <Response>
      <Message>Hi there! I am TwiML from a Redirect.</Message>
    </Response>
  `);
});

app.post('/status', (request) => {
  console.log(`Message SID ${request.body.MessageSid} has a status of ${request.body.MessageStatus}`);
});
 

// catch 404 and forward to error handler 
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
