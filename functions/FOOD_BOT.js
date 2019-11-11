
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const axios = require('axios').default;


const ProjectID = 'wave-sandbox-1dbd5'
const botToken = "965613179:AAHmrkgg_Z3RTX7IM9fm6lr2_W0TOz-zNo0"
const waveUID = 'IbVuxpPUaaeZ0NUbvzHaulOzTJP2'
const channelID = "@wave_bot_test"
const imageServerURl = 'https://admin.ntuevents.com/api/food/upload'


//FireStore instance
let db = admin.firestore();
const beginning = "Entered information : \n\n";

//bot instance
const bot = new Telegraf(botToken);

const stage = new Stage();

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
  console.log(ctx.from)

  ctx.session.foodType = null
  ctx.session.location = null
  ctx.session.endTime = null
  ctx.session.description = null
  ctx.session.hasImage = null
  
    ctx.reply(
      'Enter food type:  eg. buffet,dessert',
    
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
      { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], remove_keyboard: true, resize_keyboard: true, one_time_keyboard: true } }
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
            { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], remove_keyboard: true, resize_keyboard: true, one_time_keyboard: true } }
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
      { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], remove_keyboard: true, resize_keyboard: true, one_time_keyboard: true } }
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
            { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], remove_keyboard: true, resize_keyboard: true, one_time_keyboard: true } }
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
      { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], remove_keyboard: true, resize_keyboard: true, one_time_keyboard: true } }
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
            { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], remove_keyboard: true, resize_keyboard: true, one_time_keyboard: true } }
            )
        return

    } else if (ctx.message.text === 'Next ▶') {
        if (ctx.session.description === null){
            return ctx.reply('Please enter free food description:')
        } else {

          ctx.reply('Send me a photo of the food or you can send any text if you dont have photo :')


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
      { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], remove_keyboard: true, resize_keyboard: true, one_time_keyboard: true } }
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
  ctx.session.hasImage = null
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
            { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], remove_keyboard: true, resize_keyboard: true, one_time_keyboard: true } }
            )
        return

    } else if (ctx.message.text === 'Next ▶') {
      if (ctx.session.hasImage === null){
        return ctx.reply('Please do not skip photo upload session, type in other words if u dont have a photo')

      } else {
        if (!ctx.hasImage){
          var createdTime = admin.firestore.Timestamp.now();
          ctx.session.createdTime = createdTime
          ctx.session.documentID = createdTime.toMillis()+"+"+waveUID;
        }
       
        var content = 
          `Estimated Ending: ${ctx.session.endTime} \n` +
          `Posted by: @${ctx.from.username === null ? ctx.from.first_name : ctx.from.username} \n` +
          `Food type:  ${ctx.session.foodType} \n` +
          `Location: ${ctx.session.location} \n` +
          `Description: ${ctx.session.description} \n`
        let foodinfo = {
          'creatorID' : 'Wave Admin',
          'isAnonymous' : false,
          'createdTime' : ctx.session.createdTime,
          'likedPeople' : {},
          'title' : `${ctx.session.foodType} at ${ctx.session.location}`,
          'content' : content,
          'category' : 'Food',
          'creatorUID' : waveUID,
          'hasImage' : ctx.session.hasImage,
          'isPinned' : false,
          'isHidden' : false,
          'commentCount' : 0,
          'imageURL' : ctx.session.hasImage ? ctx.session.imageUrl : null,
          'likeCount' : 0,
          'threadID' : ctx.session.documentID,
        }

        // ctx.reply("Still running");

        let postRef = db.collection('discussion').doc('NTU').collection('Food').doc(ctx.session.documentID);
        // ctx.reply("running 2");
        postRef.set(foodinfo).then(function() {
          ctx.reply('Post created!')
          console.log(`New Post from @${ctx.from.id}`);

      
          if (ctx.session.hasImage){
            ctx.telegram.sendPhoto(channelID, ctx.session.imageFileId, {caption: content} );
  
          } else {
            ctx.telegram.sendMessage(channelID, content);

          }


          return

        }).catch(e => {
          ctx.reply('Post creation failed! Please Try again later')
          console.log(`New Post from ${ctx.from.id}`, e);
        });

      
        
        

        // ctx.reply("running 3")
        await ctx.scene.leave('getPic')

        return;
      }
 

    }

    ctx.session.hasImage = false
    ctx.reply(
      beginning +
      `Food type:  ${ctx.session.foodType} \n` +
      `Location: ${ctx.session.location} \n` +
      `Estimated Ending: ${ctx.session.endTime} \n` +
      `Description: ${ctx.session.description} \n` +
      `Photo: no photo\n\n` +

      'Note that you have reached the last step, if you still have any photo for the food, upload a photo now \n\nOR\n\n' + 
      'you can click Next ▶ button to finish without a photo.\n\n' + 
      'By finishing, you agree to let bot to represent you to post to food channel and pls do not post misleading info',
      { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], remove_keyboard: true,  resize_keyboard: true, one_time_keyboard: true } }
      )
  
    
  })


  getPic.on('photo', async (ctx) => {

    var createdTime = admin.firestore.Timestamp.now();
    ctx.session.createdTime = createdTime;
    ctx.session.documentID = createdTime.toMillis()+"+"+waveUID;

    ctx.session.imageFileId = ctx.message.photo[ctx.message.photo.length - 1].file_id
    const imageLink = await bot.telegram.getFileLink(ctx.session.imageFileId)
    console.log("Telegram Image link get: " + imageLink);

    function upload(link, cb){

      axios.get(imageServerURl, {
        data: {
          'image': link,
          'imagename': createdTime.toMillis()+'.jpg'
        }
      })
      .then(function (response) {
        console.log(response.data)
        ctx.session.hasImage = true;
        ctx.session.imageUrl = String(response.data);

        ctx.reply(
          beginning +
          `Food type:  ${ctx.session.foodType} \n` +
          `Location: ${ctx.session.location} \n` +
          `Estimated Ending: ${ctx.session.endTime} \n` +
          `Description: ${ctx.session.description} \n` +
          `Photo: Uploaded new photo\n\n` +
  
          'Note that you have reached the last step, you can replace the photo by new photo\n\nOR\n\n' + 
          'you can enter other words to delete photo, after that,\n' + 
          'you can click Next ▶ button to finish posting\n\n' + 
          'By finishing, you agree to let bot to represent you to post to food channel and pls do not post misleading info',
          { reply_markup: { keyboard: [['◀️ Back', 'Next ▶']], remove_keyboard: true, resize_keyboard: true, one_time_keyboard: true } }
          )
        cb(response)
        return
      })
      .catch(function (error) {
        console.log("error occured during uploading")
        ctx.reply(
          "Bot server error! We are sorrry!\n\n" + 
          "You can try Send me a photo of the food agian or you can send any text if you want to skip have photo :"
        )
        cb(error)
        
      })

    }

    upload(imageLink, (result) => { console.log(result)})
      
    
  })

bot.on('message', (ctx) => ctx.reply('To post new free food, enter /start'))



module.exports = {
    bot,
}