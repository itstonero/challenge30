var moment = require('moment-timezone')

function initializeHbs(exphbs)
{
    var hbs = exphbs.create({});
    hbs.handlebars.registerHelper('increment', (value, options) => (parseInt(value) + 1))
    hbs.handlebars.registerHelper('parseFixture', (value, options) => `'${value.fixtureId}', '${value.adviceOdd || ''}', '${value.suggestion || ''}'`)
    hbs.handlebars.registerHelper('locateFixture', (value, options) => `${value.country} (${value.league})`)
    hbs.handlebars.registerHelper('fixtureTime', (value, options) => moment(value).tz('Africa/Lagos').format('hh:mm a'))
    hbs.handlebars.registerHelper('checkGameTime', (value, options) => {
        var gameTime = new Date(value);
        gameTime.setMinutes(gameTime.getMinutes() + 75);
        return moment(gameTime.toUTCString()).tz('Africa/Lagos').format('hh:mm a');
    })
    hbs.handlebars.registerHelper('currentGameTime', (value, options)=>{
        var game = moment(value).tz('Africa/Lagos')
        var current = moment().tz('Africa/Lagos');
        var diff =  current.diff(game, 'minutes');
        var retVal;
        
        if(diff <= 0) 
            retVal =  "Not Started";
        else if(diff <= 46) 
            retVal = diff + " '";
        else if(diff <= 61) 
            retVal =  "HT"
        else if(diff >= 110) 
            retVal = "FT"
        else 
            retVal = (diff - 15)+ " '";

        return retVal;

    })
}

module.exports = { initializeHbs }