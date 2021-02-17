// Here, we load Twilio's helper library for Node.js
const twilio = require('twilio');

// Next we create an authenticated API client with the account credentials
// you configured earlier. TwilioQuest makes these configuration properties
// available as system environment variables in your code
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Here, we use our API client to make a request to the Twilio
// REST API. Substitute your own mobile number and message body below, and
// watch what happens when you press play!
client.messages.create({
  from: process.env.TWILIO_PHONE_NUMBER,

  // Hmm, this code will need two more parameters to work...
  // I wonder what those parameters are? Better check the docs:
  // https://www.twilio.com/docs/sms/api/message-resource
  body: 'from chris with love',
  to: '+15128978155'

}).then(message => {
  console.log('Woohoo! Copy this message SID into the hacking UI:');
  console.log(`${message.sid}`);
}).catch(error => {
  console.error('Looks like the Twilio API returned an error:');
  console.error(error);
});