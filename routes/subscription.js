var router = require('express').Router();
var webPush = require('web-push');
const { Fixture } = require('../configuration/database');
var moment = require("moment-timezone")
const vapidKeys = require('../configuration/webpush.json');

webPush.setVapidDetails(
    vapidKeys.mailTo,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );


router.post('/:fixtureId', async(req, res) =>
{
    const pushSubscription = req.body;

    setTimeout(async () => {
        let fixture = await Fixture.findOne({ where: { fixtureId : req.params.fixtureId }});
        if(fixture)
        {
            fixture = fixture.toJSON();

            var gameTime = new Date(fixture.time);
            gameTime.setMinutes(gameTime.getMinutes() + 75);
            
            webPush.sendNotification(pushSubscription, JSON.stringify({ title : fixture.game, body: `To Play: ${fixture.suggestion}\nAdvice Odd: ${fixture.adviceOdd}\nCheck Game: ${moment(gameTime.toUTCString()).tz('Africa/Lagos').format('hh:mm a')}`}));
            return res.redirect('/fixtures/today');
        }
    }, 2000);
});


module.exports = router;
