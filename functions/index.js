
const admin = require('firebase-admin');
const functions = require('firebase-functions');

//Initialise app
admin.initializeApp(functions.config().firebase);
const bot = require('./FOOD_BOT');
const pushNotification = require('./pushnotification');


exports.bot2 = functions.https.onRequest(
  (req, res) => bot.bot.handleUpdate(req.body, res)
  // (req, res) => {res.sendStatus(200)}
)


exports.pushNotiOnFoodChannel = pushNotification.newTopicNotification("Food", "New Free Food in NTU");

exports.pushNotiOnAnnouncementChannel = pushNotification.newTopicNotification("Announcement", "Announcement from U-Wave!");





