var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { Sequelizer } = require('./configuration/database');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quotations', require('./routes/quotations'));
app.use('/slips', require('./routes/slip'));
app.put('/clear', async(req, res) => {
    await Sequelizer.sync({ force: true });
    res.send("OK");
});

module.exports = app;
