//Express
const express = require('express');

//web-push
const webpush = require('web-push');

//body-parser
const bodyParser = require('body-parser');

//path
const path = require('path');

//using express 
const app = express();

//using bodyparser
app.use(bodyParser.json())
app.listen(3002);
const publicVapidKey = 'BMWbv3dx9H-0kkZfdAIiTcJ5fhNm-Hz_wCs3jE_H9OZM0c7uAV4MHCK2oHMia2CldbETmP1MyNYOK9omy_j2PTA';
const privateVapidKey = 'ErcssdExA4ANT6ZahxEQAA6poLjF1Gy9cj9ojle1zPQ';

//setting vapid keys details
webpush.setVapidDetails('mailto:chans@gmail.com', publicVapidKey,privateVapidKey);

app.get('/subscribe', (req, res)=>{
    //get push subscription object from the request
    const subscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/edbMbnx0ZMY:APA91bHEVFDBc5aol7zpEwjeUj-WYxnmKBPuO2mRNCun3O3DVCgOcBHYIHhXpCuqkirpfh3OH6bbQpObylT5w978fe8Tgj2IwSBHWrQRtzn6CSdctHFSS2zwmqyVWxrDO-vINZEd3Tp-","expirationTime":null,"keys":{"p256dh":"BGNBUAKuU8FrNHatByDmCewcdh9z3nuvFSsilp6VzvyDkmAWoLYfE1bM04v1gdF540ot4AacBiCNkE6pcBwJNlw","auth":"XsjjQCEghV8oDQkOaL8uYw"}};

    //send status 201 for the request
    res.status(201).json({})

    //create paylod: specified the detals of the push notification
    const payload = JSON.stringify({
      title: 'Subscribed successfully',
      content: 'Thanks for subscribing to app notifications',
      openUrl: '/'
    });

    //pass the object into sendNotification fucntion and catch any error
    webpush.sendNotification(subscription, payload).catch(err=> console.error(err));
})