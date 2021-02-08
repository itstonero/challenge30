var router = require('express').Router();
var unirest = require('unirest');
const { Fixture, Quotation } = require('../configuration/database');
const { GetHeaders, ShowTodayFixtures, ShowSelectedFixture, ParseFormRequest } = require('../logic/fixtures');

router.get('/', async (req, res)  =>
{
    try{
        var apiCall = unirest("GET", "https://api-football-beta.p.rapidapi.com/fixtures");
        apiCall.headers(GetHeaders());
        apiCall.query({"date": `${req.query.year}-${req.query.month}-${req.query.day}`});
        apiCall.end(response => {
            const today = ShowTodayFixtures(response);
            console.log(today);
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
        await Fixture.sync({ force: false });
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
        await Fixture.update(req.body, { where : { fixtureId : req.body.fixtureId}});
        res.redirect('/fixtures/today')
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
        await Fixture.sync({ force: !!req.body.canTrim });
        if(req.body.hasOwnProperty("canTrim"))
        {
            delete req.body.canTrim;
        }
        console.log(req.body);
        await Fixture.bulkCreate(ParseFormRequest(req.body));
        res.redirect('/fixtures/today');
    } catch(err)
    {
        res.json(err)
    }
});

module.exports = router;

/**
 * SOP => Statement of Purpose
 * GRE => 
 * Transcript =>
 * Recommendation Letter => 
 */