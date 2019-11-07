//firebase functions:config:set project.id='wave-sandbox-1dbd5'
//firebase functions:config:set bot.token="965613179:AAHmrkgg_Z3RTX7IM9fm6lr2_W0TOz-zNo0"
//firebase functions:config:set wave.uid='IbVuxpPUaaeZ0NUbvzHaulOzTJP2'

const fs = require('fs');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const Telegraf = require('telegraf');
const Composer = require('telegraf/composer');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');


admin.initializeApp(functions.config().firebase);
let db = admin.firestore();
let myBucket = admin.storage().bucket();


const beginning = "Entered information : \n\n";
const bot = new Telegraf(functions.config().bot.token);
const { enter, leave } = Stage;
const stage = new Stage();

const webHook = 'https://api.telegram.org/bot965613179:AAHmrkgg_Z3RTX7IM9fm6lr2_W0TOz-zNo0/setWebhook?url=https://us-central1-wave-sandbox-1dbd5.cloudfunctions.net/helloWorld'
const getWEbHook = 'https://api.telegram.org/bot965613179:AAHmrkgg_Z3RTX7IM9fm6lr2_W0TOz-zNo0/getWebhookInfo'


const getFoodType = new Scene("getFoodType");
stage.register(getFoodType);
const getLocation = new Scene("getLocation");
stage.register(getLocation);
const getDescrption = new Scene("getDescription");
stage.register(getDescrption);
const getPic = new Scene("getPic");
stage.register(getPic);
const getEndTime = new Scene("getEndTime");
stage.register(getEndTime);


bot.use(session());
bot.use(stage.middleware());



//Starting sequence
bot.start((ctx) => {
    ctx.reply(
      'Enter food type:  eg. buffet,dessert',
      { reply_markup: { remove_keyboard: true } }  
    );
    ctx.scene.enter('getFoodType');
  })

///Get food type part

getFoodType.command('start', async (ctx) => {
  ctx.reply(
    'Starting over, Enter food type:  eg. buffet,dessert',
    { reply_markup: { remove_keyboard: true } }
  )
  ctx.session.foodType = null
  await ctx.scene.leave()
  ctx.scene.enter('getFoodType')
})



getFoodType.on('text', async (ctx) => {
    if (ctx.message.text === '◀️ Back') {
        await ctx.scene.leave('getFoodType')
        ctx.reply('Quit new free food registration. \nYou can enter /start anytime to start over')
        return
    } else if (ctx.message.text === 'Next ▶') {
        if (ctx.session.foodType === null){
            ctx.reply('Please enter food type:  eg. buffet,dessert')
        } else {
            ctx.reply('Enter food location:')
            await ctx.scene.leave('getFoodType')
            ctx.scene.enter('getLocation')

        }
        return

    } else if (ctx.message.text.length >= 30) {
        return ctx.reply('Please enter no more than 30 char')
    }
    ctx.session.foodType = ctx.message.text
    ctx.reply(
      beginning +
      `Food type:  ${ctx.session.foodType} \n\n` +
      'Click Next ▶ button to continue, or u can re-enter the food type ',
      { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], resize_keyboard: true, one_time_keyboard: true } }
      )
    
  })


///Get location part
getLocation.command('start', async (ctx) => {
  ctx.reply(
    'Starting over,\n Enter food type:  eg. buffet,dessert',
    { reply_markup: { remove_keyboard: true } }
  )
  ctx.session.foodType = null
  ctx.session.location = null
  await ctx.scene.leave()
  ctx.scene.enter('getFoodType')
})

getLocation.on('text', async (ctx) => {
    if (ctx.message.text === '◀️ Back') {
        await ctx.scene.leave('getLocation')
        ctx.session.location = null
        ctx.scene.enter('getFoodType')
        ctx.reply(
            beginning +
            `Food type:  ${ctx.session.foodType} \n\n` +
            'Click Next ▶ button to continue, or u can re-enter the food type ',
            { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], resize_keyboard: true, one_time_keyboard: true } }
            )
        return

    } else if (ctx.message.text === 'Next ▶') {
        if (ctx.session.location === null){
            return ctx.reply('Please enter location:  eg. Arc Level 2')
        } else {
            ctx.reply('Enter Estimatied Clearing time:')
            await ctx.scene.leave('getLocation')
            ctx.scene.enter('getEndTime')

        }
        return

    } 
    ctx.session.location = ctx.message.text
    ctx.reply(
      beginning +
      `Food type:  ${ctx.session.foodType} \n` +
      `Location: ${ctx.session.location} \n\n` +
      'Click Next ▶ button to continue, or u can re-enter the location',
      { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], resize_keyboard: true, one_time_keyboard: true } }
      )
    
  })


///Get Endtime Part
getEndTime.command('start', async (ctx) => {
  ctx.reply(
    'Starting over,\n Enter food type:  eg. buffet,dessert',
    { reply_markup: { remove_keyboard: true } }
  )
  ctx.session.foodType = null
  ctx.session.location = null
  ctx.session.endTime = null
  await ctx.scene.leave('getEndTime')
  ctx.scene.enter('getFoodType')
})

getEndTime.on('text', async (ctx) => {
    if (ctx.message.text === '◀️ Back') {
        await ctx.scene.leave('getEndTime')
        ctx.session.endTime = null
        ctx.scene.enter('getLocation')
        ctx.reply(
            beginning +
            `Food type:  ${ctx.session.foodType} \n` +
            `Location: ${ctx.session.location} \n\n` +
            'Click Next ▶ button to continue, or u can re-enter the location ',
            { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], resize_keyboard: true, one_time_keyboard: true } }
            )
        return

    } else if (ctx.message.text === 'Next ▶') {
        if (ctx.session.endTime === null){
            return ctx.reply('Please enter Estimatied Clearing time:  eg. 830pm')
        } else {
            ctx.reply('Enter Any Description? :')
            await ctx.scene.leave('getEndTime')
            ctx.scene.enter('getDescription')
        }
        return

    }
    ctx.session.endTime = ctx.message.text
    ctx.reply(
      beginning +
      `Food type:  ${ctx.session.foodType} \n` +
      `Location: ${ctx.session.location} \n` +
      `Estimated Ending: ${ctx.session.endTime} \n\n` +
      'Click Next ▶ button to continue, or u can re-enter the end time',
      { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], resize_keyboard: true, one_time_keyboard: true } }
      )
    
  })

///Get description part
getDescrption.command('start', async (ctx) => {
  ctx.reply(
    'Starting over,\n Enter food type:  eg. buffet,dessert',
    { reply_markup: { remove_keyboard: true } }
  )
  ctx.session.foodType = null
  ctx.session.location = null
  ctx.session.endTime = null
  ctx.session.description = null
  await ctx.scene.leave('getDescription')
  ctx.scene.enter('getFoodType')
})


getDescrption.on('text', async (ctx) => {
    if (ctx.message.text === '◀️ Back') {
        await ctx.scene.leave('getDescription')
        ctx.session.description = null
        ctx.scene.enter('getEndTime')
        ctx.reply(
            beginning +
            `Food type:  ${ctx.session.foodType} \n` +
            `Location: ${ctx.session.location} \n` +
            `Estimated Ending: ${ctx.session.endTime} \n\n` +
            'Click Next ▶ button to continue, or u can re-enter the end time',
            { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], resize_keyboard: true, one_time_keyboard: true } }
            )
        return

    } else if (ctx.message.text === 'Next ▶') {
        if (ctx.session.description === null){
            return ctx.reply('Please enter free food description:')
        } else {
        
    

            ctx.reply(
                beginning +
                `Food type:  ${ctx.session.foodType} \n` +
                `Location: ${ctx.session.location} \n` +
                `Estimated Ending: ${ctx.session.endTime} \n` +
                `Description: ${ctx.session.description} \n\n` +
                'Note that you have reached the last step, if you have any photo for the food, upload a photo now to finish the post\n\nOR\n\n' + 
                'you can click Next ▶ button to finish without a photo.\n\n' + 
                'By finishing, you agree to let bot to represent you to post to food channel and pls do not post misleading info',
                { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], resize_keyboard: true, one_time_keyboard: true } }
                )


            await ctx.scene.leave('getDescription')
            ctx.scene.enter('getPic')




        }
        return

    }
    ctx.session.description = ctx.message.text
    ctx.reply(
      beginning +
      `Food type:  ${ctx.session.foodType} \n` +
      `Location: ${ctx.session.location} \n` +
      `Estimated Ending: ${ctx.session.endTime} \n` +
      `Description: ${ctx.session.description} \n\n` +
      'Click Next ▶ button to continue, or u can re-enter the description',
      { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], resize_keyboard: true, one_time_keyboard: true } }
      )
    
  })


///Get Picture Part
getPic.command('start', async (ctx) => {
  ctx.reply(
    'Starting over,\n Enter food type:  eg. buffet,dessert',
    { reply_markup: { remove_keyboard: true } }
  )
  ctx.session.foodType = null
  ctx.session.location = null
  ctx.session.endTime = null
  ctx.session.description = null
  await ctx.scene.leave('getPic')
  ctx.scene.enter('getFoodType')
})


getPic.on('text', async (ctx) => {
    if (ctx.message.text === '◀️ Back') {
        await ctx.scene.leave('getPic')
        ctx.scene.enter('getDescription')
        ctx.reply(
            beginning +
            `Food type:  ${ctx.session.foodType} \n` +
            `Location: ${ctx.session.location} \n` +
            `Estimated Ending: ${ctx.session.endTime} \n` +
            `Description: ${ctx.session.description} \n\n` +
            'Click Next ▶ button to continue, or u can re-enter the description',
            { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], resize_keyboard: true, one_time_keyboard: true } }
            )
        return

    } else if (ctx.message.text === 'Next ▶') {
        ctx.reply(
            beginning +
            `Food type:  ${ctx.session.foodType} \n` +
            `Location: ${ctx.session.location} \n` +
            `Estimated Ending: ${ctx.session.endTime} \n` +
            `Description: ${ctx.session.description} \n\n` +
            'Sending the post.... Please Wait \n'
            )

        //await createPostOnChannel();


        //Create post on our wave discsussion channel
        var createdTime = admin.firestore.Timestamp.now();
        var documentName = createdTime.toMillis()+"+"+functions.config().wave.uid;
        var content = 
          `Estimated Ending: ${ctx.session.endTime} \n` +
          `Posted by: @${ctx.from.id} \n` +
          `Food type:  ${ctx.session.foodType} \n` +
          `Location: ${ctx.session.location} \n` +
          `Description: ${ctx.session.description} \n`
        let foodinfo = {
          'creatorID' : 'Wave Admin',
          'isAnonymous' : false,
          'createdTime' : createdTime,
          'likedPeople' : {},
          'title' : `${ctx.session.foodType} at ${ctx.session.location}`,
          'content' : content,
          'category' : 'Food',
          'creatorUID' : functions.config().wave.uid,
          'hasImage' : false,
          'isPinned' : false,
          'isHidden' : false,
          'commentCount' : 0,
          'likeCount' : 0,
          'threadID' : documentName,


        }

        let postRef = db.collection('discussion').doc('NTU').collection('Food').doc(documentName);
        postRef.set(foodinfo).then(function() {
          ctx.reply('Post created!')
          console.log(`New Post from @${ctx.from.id}`);
          return

        }).catch(e => {
          ctx.reply('Post creation failed! Please Try again later')
          console.log(`New Post from ${ctx.from.id}`, e);
        });

      

        

        await ctx.scene.leave('getPic')
        
        

    }

    
    ctx.reply(
      'Please send a photo or \n' +
      'Click Next ▶ button to continue if u dont have any photo for food',
      { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], resize_keyboard: true, one_time_keyboard: true } }
      )
    
  })


  getPic.on('photo', async (ctx) => {

    ctx.replyWithChatAction('typing')
    
    

    ctx.reply(
        beginning +
        `Food type:  ${ctx.session.foodType} \n` +
        `Location: ${ctx.session.location} \n` +
        `Estimated Ending: ${ctx.session.endTime} \n` +
        `Description: ${ctx.session.description} \n\n` +
        'Sending the post.... Please Wait \n'
        )

    var createdTime = admin.firestore.Timestamp;
    var documentName = createdTime.fromMillis+"+"+functions.config().wave.uid;


    const newfile = myBucket.file(`discussion/NTU/images/${functions.config().wave.uid}/${createdTime}.jpg`);

    const imageLink = await bot.telegram.getFileLink(ctx.message.photo[ctx.message.photo.length - 1].file_id)
    console.log(imageLink);


    var fd = fs.createReadStream(imageLink)
    fd.pipe(newfile.createWriteStream())


    var end = new Promise(function(resolve, reject) {
      fd.on('finish', resolve);
      fd.on('error', reject); // or something like that. might need to close `hash`
    });

    let sha1sum = await end;
    console.log(sha1sum);

    

    var content = 
      `Posted by: ${ctx.from.id} \n` +
      `Food type:  ${ctx.session.foodType} \n` +
      `Location: ${ctx.session.location} \n` +
      `Estimated Ending: ${ctx.session.endTime} \n` +
      `Description: ${ctx.session.description} \n`
    let foodinfo = {
      'creatorID' : 'Wave Admin',
      'isAnonymous' : false,
      'createdTime' : createdTime,
      'likedPeople' : {},
      'title' : `${ctx.session.foodType} at ${ctx.session.location}`,
      'content' : content,
      'category' : 'Food',
      'creatorUID' : functions.config().wave.uid,
      'hasImage' : true,
      'imageUrl' : "",
      'isPinned' : false,
      'isHidden' : false,
      'commentCount' : 0,
      'likeCount' : 0,
      'threadID' : documentName,


    }


    ctx.reply(
        'Post created!'
        )

    await ctx.scene.leave('getPic')
    
  
    
  })

  

bot.on('message', (ctx) => ctx.reply('To post new free food, enter /start'))



//bot.launch()


exports.bot = functions.https.onRequest(
  (req, res) => bot.handleUpdate(req.body, res)
)


// exports.helloworld = functions.https.onRequest(
//   (req, res) => Console.log("Hello World")
// )





