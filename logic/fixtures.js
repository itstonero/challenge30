const GetHeaders = () =>{
    return ({
        "x-rapidapi-key": "944b51b49dmsh339c99f0345fdd2p13db62jsned6a3c13eab9",
        "x-rapidapi-host": "api-football-beta.p.rapidapi.com",
        "useQueryString": true
    });
}

const FormatTime = (date) => {
    let gameTime = new Date(date);
    return `${gameTime.getHours().toString().padStart(2, "0")}:${gameTime.getMinutes().toString().padStart(2, "0")}`;
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
            time: FormatTime(fixture.fixture.date),
            fixtureId: fixture.fixture.id
        }
        response.push({...newFixture, raw: JSON.stringify(newFixture)})
    }

    return response;
}

const GetGameTime = (gameTime) => {
    let currentTime = new Date(), gameStart = new Date();
    gameStart.setHours(gameTime.split(":")[0] * 1);
    gameStart.setMinutes(gameTime.split(":")[1] * 1);
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

    const todaysFiltered = todayFixtures.map(x => ({...x, period: GetGameTime(x.time)}));
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


module.exports = { GetHeaders, ShowTodayFixtures, ShowSelectedFixture, ParseFormRequest };


//console.log(ShowTodayFixtures(rawDatas));