var express = require('express');
var path = require('path');
var moment = require('moment-timezone');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const { Sequelizer } = require('./configuration/database');

var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quotations', require('./routes/quotations'));
app.use('/slips', require('./routes/slip'));
app.use('/subscription', require('./routes/subscription'));
app.use('/fixtures', require('./routes/fixtures'));
app.put('/clear', async(req, res) => {
    await Sequelizer.sync({ force: true });
    res.send("OK");
});

module.exports = app;
