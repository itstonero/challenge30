var router = require('express').Router();
var unirest = require('unirest');
var moment = require('moment-timezone')

const { Fixture } = require('../configuration/database');
const { GetHeaders, ShowTodayFixtures, ShowSelectedFixture, ParseFormRequest } = require('../logic/fixtures');
router.get('/', async (req, res)  =>
{
    try
    {
        var curTime = moment().tz('Africa/Lagos').format('yyyy:MM:DD').split(":")
        var apiCall = unirest("GET", "https://api-football-beta.p.rapidapi.com/fixtures");
        apiCall.headers(GetHeaders());
        apiCall.query({"date": `${curTime[0]}-${curTime[1]}-${curTime[2]}`});
        apiCall.end(response => {
            const today = ShowTodayFixtures(response);
            res.render('allFixtures', { today })
        })
    }catch
    {
        res.json({ error : "An Error Occurred"});
    }
});

router.get('/today', async(req, res) => 
{
    try 
    {
        //await Fixture.sync({ force: true });
        const allFixtures = (await Fixture.findAll()).map(x => x.toJSON());
        res.render('todayFixtures', { today: ShowSelectedFixture(allFixtures)});

    } catch (error) 
    {
        console.log("An error Occured :: " + JSON.stringify(error))
        res.json(error);
    }   
});

router.post('/today', async(req, res) => {
    try 
    {
        const toBeUpdated = {...req.body, alarmSet: true};
        await Fixture.update(toBeUpdated, { where : { fixtureId : toBeUpdated.fixtureId}});
        res.redirect(`/fixtures/today`)
    } catch (error) 
    {
        res.json(error);
    }   
});

router.post('/', async(req, res) =>  
{
    try 
    {
        console.log(req.body);
        const force = !!req.body.canTrim;
        await Fixture.sync({ force });
        if(force)
        {
            delete req.body.canTrim;
        }
        console.log(req.body);
        await Fixture.bulkCreate(ParseFormRequest(req.body));
        res.redirect('/fixtures/today');
    } catch(err)
    {
        console.log(err);
        res.json(err)
    }
});

router.post('/:fixtureId/remove', async(req, res)=>{
    try 
    {
        await Fixture.destroy({where : { fixtureId : req.params.fixtureId }});
        res.redirect(`/fixtures/today`)
    } catch (error) 
    {
        res.json(error);
    }   
});

module.exports = router;

/**
 * SOP => Statement of Purpose
 * GRE => 
 * Transcript =>
 * Recommendation Letter => 
 * 
 */