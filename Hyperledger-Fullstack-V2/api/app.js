
'use strict';
require('dotenv/config');
let log4js = require('log4js');
let logger = log4js.getLogger('SampleWebApp');
let express = require('express');
let bodyParser = require('body-parser');
let util = require('util');
let http = require('http');
let app = express();
let cors = require('cors');
const _route = require('./src/routes/index');
let expressJWT = require('express-jwt');
let jwt = require('jsonwebtoken');
let bearerToken = require('express-bearer-token');
require('./config.js');
let hfc = require('fabric-client');

// var helper = require('./app/helper.js');
let _admin = require('./app/Admin.js');
let _userRegister = require('./app/UserRegister.js');
// var invoke = require('./app/invoke-offline');
let host = process.env.HOST || hfc.getConfigSetting('host');
let port = process.env.PORT || hfc.getConfigSetting('port');
// var port = 5050;
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PROMETHEUS METRICS CONFIGURATION /////////////
///////////////////////////////////////////////////////////////////////////////
// const writeLatencyGauge = new prometheus.Gauge({ name: 'write_latency', help: 'latency for write requests' });
// const requestCountGauge = new prometheus.Gauge({ name: 'request_count', help: 'requests count' });
// const readLatencyGauge = new prometheus.Gauge({ name: 'read_latency', help: 'latency for read requests' });
// const queriesCountGauge = new prometheus.Gauge({ name: 'queries_count', help: 'queries count' });
// const totalTransaction = new prometheus.Gauge({ name: 'total_transaction', help: 'Counter for total transaction' })
// const failedTransaction = new prometheus.Gauge({ name: 'failed_transaction', help: 'Counter for failed transaction' })
// const successfulTransaction = new prometheus.Gauge({ name: 'successful_transaction', help: 'counter for successful transaction' })

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.use(cors());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: false
}));

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: false
}));
// set secret variable
app.set('secret', 'thisismysecret');
app.use(expressJWT({
    secret: 'thisismysecret'
}).unless({
    path: ['/users', '/enrollAdmin']
}));
app.use(bearerToken());
app.use(function (req, res, next) {
    logger.debug(' ------>>>>>> new request for %s', req.originalUrl);
    if (req.originalUrl.indexOf('/users') >= 0 || req.originalUrl.indexOf('/metrics') >= 0) {
        return next();
    }

    let token = req.token;
    jwt.verify(token, app.get('secret'), function (err, decoded) {
        if (err) {
            res.send({
                success: false,
                message: 'Failed to authenticate token. Make sure to include the ' +
					'token returned from /users call in the authorization header ' +
					' as a Bearer token'
            });
            return;
        } else {
            // add the decoded user name and org name to the request object
            // for the downstream code to use
            req.username = decoded.username;
            req.orgname = decoded.orgName;
            logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
            return next();
        }
    });
});

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

let server = http.createServer(app).listen(port, function () { });
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;

function getErrorMessage(field) {
    let response = {
        success: false,
        message: field + ' field is missing or Invalid in the request'
    };
    return response;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////// REST ENDPOINTS START HERE ///////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Register and enroll user
app.post('/users', async function (req, res) {

    console.log('\n - Enrolling user');
    let username =  'User';
    let orgName = 'Org1';

    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }

    let token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),
        username: username,
        orgName: orgName
    }, app.get('secret'));


    let result = await _userRegister.registerUser(username, orgName);
    logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
    if (result && typeof result !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, orgName);
        return res.status(200).json({
            status: true,
            message: 'user enrolled Successfully',
            token:token
        });
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, result);
        res.json({ success: false, message: result });
    }

});

app.post('/enrollAdmin', async (req, res) => {
    console.log('\n - Enrolling admin');
    let result = await _admin.enrollAdmin();
    return res.status(200).json({
        status: 200,
        message: 'Successfully registered the username %s for organization %s\', username, orgName',
        data:result
    });
});

app.use('/api/v1', _route);

module.exports = app;
