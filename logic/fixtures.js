const GetHeaders = () =>{
    return ({
        "x-rapidapi-key": "f098c9e184msh29e07e5668d67e8p156055jsn2f3273f88101",
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
    let currentTime = Date.now(), gameStart = new Date();
    gameStart.setHours(gameTime.split(":")[0] * 1);
    gameStart.setMinutes(gameTime.split(":")[1] * 1);

    if(currentTime > gameStart)
    {
        return `N/A`;
    }

    const differenceInMilliSeconds = gameStart - currentTime;
    let differenceInMinutes = Math.round(((differenceInMilliSeconds % 86400000) % 3600000) / 60000);

    if(differenceInMinutes <= 46)
    {
        return `${differenceInMinutes}'`;
    }

    differenceInMinutes -= 60;

    if(differenceInMinutes <= 0)
    {
        return `HT`;
    }

    if(differenceInMinutes <= 46)
    {
        return `${differenceInMinutes + 45}'`
    }

    return `FT`;

}

const ShowSelectedFixture = (fixture, todayFixtures) => {

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
}

const ParseFormRequest = (request) =>
{
    const jsonRequest = Object.values(request).map(data => JSON.parse(data));
    return jsonRequest;
}


module.exports = { GetHeaders, ShowTodayFixtures, ShowSelectedFixture, ParseFormRequest };


//console.log(ShowTodayFixtures(rawDatas));