const GetHeaders = () =>{
    return ({
        "x-rapidapi-key": "944b51b49dmsh339c99f0345fdd2p13db62jsned6a3c13eab9",
        "x-rapidapi-host": "api-football-beta.p.rapidapi.com",
        "useQueryString": true
    });
}

const FormatTime = (date) => {
    let gameTime = (new Date(date)).toTimeString().split(' ');
    return `${gameTime[0]} ${gameTime[1]}`
}

const totalTime = (fixture) => {
    let time = fixture.time.split(':');
    let totalMinutes = ((time[0] * 1) * 60) + (time[1] * 1);
    return totalMinutes;
}

const sortByDate = (elementOne, elementTwo) =>
{
    let result =  totalTime(elementOne) - totalTime(elementTwo);
    return result;
}

const ShowTodayFixtures = (rawData) => {
    const response = [];
    //console.log(rawData);
    if(!rawData || rawData.statusCode !== 200)
    {
        return response;
    }

    for(var fixture of rawData.body.response)
    {
        const newFixture = {
            game: `${fixture.teams.home.name} vs ${fixture.teams.away.name}`,
            league: fixture.league.name,
            country: fixture.league.country,
            time: fixture.fixture.date,
            fixtureId: fixture.fixture.id
        }
        response.push({...newFixture, raw: JSON.stringify(newFixture)})
    }

    return response;
}

const GetGameTime = (gameTime) => {
    let currentTime = new Date(), gameStart = new Date(gameTime);
    let timeZoneDiff = Math.round(currentTime.getTimezoneOffset() / 60);

    let gameHours = gameStart.getHours() + (timeZoneDiff * -1);
    gameStart.setHours(gameHours);

    const minuteDiff = ((currentTime.getHours() * 60) + currentTime.getMinutes()) - ((gameStart.getHours() * 60) + gameStart.getMinutes());

    if(gameStart > currentTime)
    {
        return 'Not Started';
    }

    if(minuteDiff >= 120)
    {
        return 'FT';
    }

    if(minuteDiff <= 46)
    {
        return `${minuteDiff}'`
    }

    if(minuteDiff <= 62)
    {
        return `HT`;
    }

    return `${minuteDiff - 16}'`;
}

const ShowSelectedFixture = (todayFixtures) => {

    const todaysFiltered = todayFixtures.map(x => ({...x, period: GetGameTime(x.time), time: FormatTime(x.time), raw: JSON.stringify(x)}));
    todaysFiltered.sort(sortByDate);
    return todaysFiltered;
    /**
     * 
     const fixtureIDs = todayFixtures.map(x => x.fixtureId);
     const allFixtures = todayFixtures.reduce((reducer, item) =>({...reducer, [item.fixtureId]: {...item, period: GetGameTime(item.time), bets: []}}), {});
     
     console.log(allFixtures);
     
     if(!fixture || !fixture.response)
     {
         return todayFixtures;
        }
        
        const registeredMatches = fixture.response.filter(data => fixtureIDs.includes(data.fixture.id))
        console.log(registeredMatches);
        
        
        for(var odds of registeredMatches)
        {
            const booker = odds.bookmakers[0].bets;
            console.log(booker);
            const fixtureId = odds.fixture.id;
            
            for(var bets of booker)
            {
                allFixtures[fixtureId].bets = bets;
            }
        }
        
        return Object.values(allFixtures);
        */
    }
    



const ParseFormRequest = (request) =>
{
    const jsonRequest = Object.values(request).map(data => JSON.parse(data));
    return jsonRequest;
}


module.exports = { GetHeaders, ShowTodayFixtures, ShowSelectedFixture, ParseFormRequest, FormatTime };

// let fix = [{time:'21:54:00 GMT+0000', name: 'Four'}, {time:'17:54:00 GMT+0000', name: 'one'}, {time:'18:00:00 GMT+0000', name: 'Two'}, {time:'18:10:00 GMT+0000', name: 'Three'}]
// fix.sort(sortByDate)
// console.log(fix)
//console.log(ShowTodayFixtures(rawDatas));