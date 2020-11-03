var twilio = require('twilio');

var textMe = function(ingreditsArr, phone) {
var accountSid = 'AC5980b9b9f6e709160fe363db4c5832d4'; // Your Account SID from www.twilio.com/console
var authToken = 'd57756e3aa320178e20b0eba98d304f6';   // Your Auth Token from www.twilio.com/console

var client = new twilio(accountSid, authToken);

client.messages.create({
    body: ingreditsArr,
    to: phone,  // Text this number
    from: '+18043312738' // From a valid Twilio number
})
.then((message) => console.log(message.sid));
}

module.exports = textMe;
