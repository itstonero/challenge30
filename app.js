var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { Sequelizer } = require('./configuration/database');

var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quotations', require('./routes/quotations'));
app.use('/slips', require('./routes/slip'));
app.use('/fixtures', require('./routes/fixtures'));
app.put('/clear', async(req, res) => {
    await Sequelizer.sync({ force: true });
    res.send("OK");
});

module.exports = app;
