/**
 * Module dependencies.
 */
let express = require('express');
let cors = require('cors');
let session = require('express-session');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let errorHandler = require('errorhandler');
let path = require('path');
let mongoose = require('mongoose');
let MY_STRIPE_TEST_KEY = 'sk_test_dqzYJJ6xWGgg6U1hgQr3hNye';
let stripe = require ('stripe')(MY_STRIPE_TEST_KEY);
let MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
let slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);
let newrelic = require('newrelic');


/**
 * App configs
 */
let config = require('./config/config');
let validate = require('./config/validation');
let winstonConfig = require("./config/winston");

/**
 * Create Express server.
 */
let app = express();
app.use(function(req, res, next) {
    if (req.path.substr(-5) === '.html' && req.path.length > 1) {
        let query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -5) + query);
    } else {
        next();
    }
});
app.use(morgan('dev', {"stream": winstonConfig.stream}));

/**
 * Connect to MongoDB.
 */
mongoose.connect(config.mongoDBUrl);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Connected to mongolab");
});

/**
 * Express configuration.
 */
app.set('port', config.port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../dist')));
app.set('view engine', 'html');

app.use(cors());
require('./routes')(app);

/**
 * Disable api auth if were are in dev mode
 */
if(app.get('env') !== 'development') {
    app.use('/api/*', validate);
}

app.get('/settings', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/settings.html'));
});
app.get('/admin-companies', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/admin-companies.html'));
});
app.get('/admin-dashboard', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/admin-dashboard.html'));
});
app.get('/analytics_raw', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/analytics_raw.html'));
});
app.get('/appointments', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/appointments.html'));
});
app.get('/checkin', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/checkin.html'));
});
app.get('/employees', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/employees.html'));
});
app.get('/forgot-password', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/forgot-password.html'));
});
app.get('/form-builder', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/form-builder.html'));
});
app.get('/login', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/login.html'));
});
app.get('/signup', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/signup.html'));
});
app.get('/visitors', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/visitors.html'));
});
app.get('/404', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/404.html'));
});
app.get('/admin-settings', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/admin-settings.html'));
});
app.get('/index', function(req,res){
    if(req === null) throw 'ERROR: No request!';
    res.sendFile(path.join(__dirname,'../dist/index.html'));
});

/**
 * Error Handler.
 */
app.use(errorHandler());

let server = require('http').createServer(app);

server.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode',
        app.get('port'),
        app.get('env'));
});

module.exports = app;
