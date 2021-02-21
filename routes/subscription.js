var router = require('express').Router();
var webPush = require('web-push');
const { Fixture } = require('../configuration/database');
const { FormatTime } = require('../logic/fixtures');
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

            webPush.sendNotification(pushSubscription, JSON.stringify({ title : fixture.game, body: `${fixture.suggestion}   ${FormatTime(fixture.time)}`}));
            return res.redirect('/fixtures/today');
        }
    }, 2000);
});


module.exports = router;
