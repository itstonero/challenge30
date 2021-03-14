var { app, express } = require("./configuration/express");
var path = require("path");

//Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var quotationRouter = require('./routes/quotations')
var slipRouter = require('./routes/slip')
var subscriptionRouter = require('./routes/subscription')
var fixtureRouter = require('./routes/fixtures');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quotations', quotationRouter);
app.use('/slips', slipRouter);
app.use('/subscription', subscriptionRouter);
app.use('/fixtures', fixtureRouter);

module.exports = app;
