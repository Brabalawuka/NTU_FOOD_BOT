const functions = require('firebase-functions');
const Telegraf = require('telegraf')

const bot = new Telegraf("965613179:AAHmrkgg_Z3RTX7IM9fm6lr2_W0TOz-zNo0")
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))


bot.launch();



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//




exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
