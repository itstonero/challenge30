var router = require('express').Router();
var unirest = require('unirest');
const { Fixture } = require('../configuration/database');
const { GetHeaders, ShowTodayFixtures, ShowSelectedFixture, ParseFormRequest } = require('../logic/fixtures');

router.get('/', async (req, res)  =>
{
    try
    {
        var X = new Date();
        var year = req.params.year ? req.params.year : X.getFullYear();
        var month = req.params.month ? req.params.month : (X.getMonth() +1).toString();
        var day = req.params.day ? req.params.day : X.getDate().toString();
        console.log(`Check For :: ${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);

        var apiCall = unirest("GET", "https://api-football-beta.p.rapidapi.com/fixtures");
        apiCall.headers(GetHeaders());
        apiCall.query({"date": `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`});
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

        // var X = new Date();

        // var apiCall = unirest("GET", "https://api-football-beta.p.rapidapi.com/odds");
        // apiCall.headers(GetHeaders());
        // apiCall.query({
        //     "date": `${X.getFullYear()}-${`${X.getMonth() + 1}`.padStart(2, '0')}-${`${X.getDate()}`.padStart(2, "0")}`
        // });

        // apiCall.end(response => {
        //     res.render('todayFixtures', { data: ShowSelectedFixture(response, registeredFixtures)})
        // });

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

module.exports = router;

/**
 * SOP => Statement of Purpose
 * GRE => 
 * Transcript =>
 * Recommendation Letter => 
 * 
 */