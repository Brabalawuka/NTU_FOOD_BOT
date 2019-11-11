
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const CLICK_ACTION = 'FLUTTER_NOTIFICATION_CLICK';
const WAVE_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/wave-sandbox-1dbd5.appspot.com/o/FCMImages%2Ficon.png?alt=media&token=8e19a495-cf45-4f60-8e09-273e16af4fd8'


function newTopicNotification(topic){

    const notificationType = "discussionThread"
    var notiTopic = `discussion_${topic}`;
    var title = "New Free Food in NTU"

    return functions.region("asia-east2").firestore.document(`discussion/NTU/${topic}/{newPost}`).onCreate((snapShot, context) => {
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