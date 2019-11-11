
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const CLICK_ACTION = 'FLUTTER_NOTIFICATION_CLICK';
const WAVE_IMAGE = 'https://i.ibb.co/KFQYW0z/icon.png'


function newTopicNotification(topic){

    const notificationType = "discussionThread"
    var notiTopic = `discussion_${topic}`;
    var title = "New Free Food in NTU"

    return functions.firestore.document(`discussion/NTU/${topic}/{newPost}`).onCreate((snapShot, context) => {
        const content = snapShot.data();
        var body = content.title;
        var category = content.category
        var documentID = context.params.newPost;


        var message = {
            notification:{
              title : title,
              body : body,
              image : WAVE_IMAGE
            },
            apns: {
              payload: {
                  aps: {
                      "mutable-content": 1
                  }
              },
              fcm_options: {
                  image:  WAVE_IMAGE
              }
            },
            data : {
              notificationType : notificationType,
              documentID: documentID,
              category: category,
              click_action: CLICK_ACTION,
            },
            topic : notiTopic
          }

        admin.messaging().send(message).then((response) => {
            // Response is a message ID string. 
            console.log('Successfully sent message:', response);
            return;
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
        


    })


}


module.exports = {
  newTopicNotification,

}