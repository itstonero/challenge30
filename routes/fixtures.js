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

router.get('/today', async(req, res) => {
    try 
    {
        await Fixture.sync({ force: false })
        // const allFixtures = await Fixture.findAll();
        // const registeredFixtures = allFixtures.map(data => data.toJSON());
        // var X = new Date();

        // var apiCall = unirest("GET", "https://api-football-beta.p.rapidapi.com/odds");
        // apiCall.headers(GetHeaders());
        // apiCall.query({
        //     "date": `${X.getFullYear()}-${`${X.getMonth() + 1}`.padStart(2, '0')}-${`${X.getDate()}`.padStart(2, "0")}`
        // });

        // apiCall.end(response => {
        //     res.render('todayFixtures', { data: ShowSelectedFixture(response, registeredFixtures)})
        // });
        res.render('todayFixtures', { data: ShowSelectedFixture(response, registeredFixtures)})

    } catch (error) 
    {
        res.json(error);
    }   
});

router.post('/today', async(req, res) => {
    try 
    {
        await Fixture.update(req.body, { where : { fixtureId : req.body.fixtureId}});
        const allFixtures = await Fixture.findAll();
        res.render('todayFixtures', { data: ShowSelectedFixture(null, allFixtures.map(x => x.toJSON()))})
    } catch (error) 
    {
        res.json(error);
    }   
});

router.post('/', async(req, res) =>  
{
    try 
    {
        await Fixture.sync({ force: false });
        await Fixture.bulkCreate(ParseFormRequest(req.body));
        res.redirect('/fixtures/today');
    } catch(err)
    {
        res.json(err)
    }
});

router.post('/trim', async(req, res) =>{
    try 
    {
        await Fixture.sync({ force: true });
        await Fixture.bulkCreate(ParseFormRequest(req.body));
        res.redirect('/fixtures/today');
    } catch(err)
    {
        res.json(err)
    }
})

module.exports = router;
