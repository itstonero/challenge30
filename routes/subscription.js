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
    let fixture = await Fixture.findOne({ where: { fixtureId : req.params.fixtureId }});
    fixture = fixture.toJSON();

    var gameTime = new Date(fixture.time);
    gameTime.setMinutes(gameTime.getMinutes() + 70);
    var gT = moment(gameTime.toUTCString()).tz('Africa/Lagos');
    var cT = moment().tz('Africa/Lagos');

    var tDiff = gT.diff(cT);

    if(tDiff >= 0)
    {
        setTimeout(async () => {
            if(fixture)
            {
                
                webPush.sendNotification(pushSubscription, JSON.stringify({ title : fixture.game, body: `To Play: ${fixture.suggestion}\nAdvice Odd: ${fixture.adviceOdd}\nCheck Game: ${gT.format('hh:mm a')}`}));
                return res.redirect('/fixtures/today');
            }
        }, tDiff);
    }
});


module.exports = router;
