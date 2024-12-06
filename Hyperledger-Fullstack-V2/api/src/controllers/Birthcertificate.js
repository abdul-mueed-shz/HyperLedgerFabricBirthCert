const { body, check, sanitize, validationResult } = require('express-validator');
const generateUniqueId = require('generate-unique-id');
const invoke = require('../../app/invoke-transaction.js');
const helper = require('../../app/Helper.js');
const query = require('../../app/query.js');
let log4js = require('log4js');
let logger = log4js.getLogger('SampleWebApp');
// const UserModel = require("../models/Birth");
require('../../config.js');
const prometheus = require('prom-client');

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PROMETHEUS METRICS CONFIGURATION /////////////
///////////////////////////////////////////////////////////////////////////////
const writeLatencyGauge = new prometheus.Gauge({ name: 'write_latency', help: 'latency for write requests' });
const requestCountGauge = new prometheus.Gauge({ name: 'request_count', help: 'requests count' });
const readLatencyGauge = new prometheus.Gauge({ name: 'read_latency', help: 'latency for read requests' });
const queriesCountGauge = new prometheus.Gauge({ name: 'queries_count', help: 'queries count' });
const totalTransaction = new prometheus.Gauge({ name: 'total_transaction', help: 'Counter for total transaction' });
const failedTransaction = new prometheus.Gauge({ name: 'failed_transaction', help: 'Counter for failed transaction' });
const successfulTransaction = new prometheus.Gauge({ name: 'successful_transaction', help: 'counter for successful transaction' });


async function store(req, res, next) {

    try {
        await check('client').notEmpty().withMessage('Name of the client filed must be requerd').run(req);
        await check('supplier').notEmpty().withMessage('Name of the supplier filed must be requerd').run(req);
        await check('description').notEmpty().withMessage('Name of the description filed must be requerd').run(req);



        const errors = validationResult(req);
        console.log('errors..........', errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let peers = ['peer0.org1.example.com'];
        let chaincodeName = 'legalContract';
        let channelName = 'mychannel';
        let fcn = 'CreateContract';

        let args = [];
        const id = generateUniqueId();

        args.push(id, req.body.client, req.body.supplier, req.body.description);

        const start = Date.now();
        let message = await invoke.invokeChaincode('admin', channelName, chaincodeName, fcn, args);

        let getUser = await query.queryChaincode('admin', channelName, chaincodeName, 'GetLegalContractCert', [id]);
        console.log('ghfghgfhfgh', peers, channelName, chaincodeName, fcn, args, 'admin', 'Org1');
        console.log('getUser', getUser);
        console.log('message', message);
        const latency = Date.now() - start;

        let data = {
            key: id,
            tx_id: message,
            Record: {
                name: req.body.client,
                father_name: req.body.supplier,
                mother_name: req.body.description,
            },

        };

        writeLatencyGauge.inc(latency);
        requestCountGauge.inc();
        successfulTransaction.inc();
        // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

        return res.status(200).json({
            status: 200,
            message: 'Birthday certificate created successfully!',
            data: data
        });

    }
    catch (error) {
        res.status(400).json({
            status: 400,
            message: 'Somethings went wrong',
            error: error.message
        });
    }
}


async function index(req, res, next) {
    try {

        let channelName = 'mychannel';
        let chaincodeName = 'legalContract';
        let args = req.query.args;
        let fcn = 'AllList';


        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }
        console.log('args==========', args);
        args = args.replace(/'/g, '"');
        args = JSON.parse(args);
        logger.debug(args);

        const start = Date.now();
        let message = await query.queryChaincode('admin', channelName, chaincodeName, fcn, args);
        // message = message.replace(/'/g, '"');
        const latency = Date.now() - start;
        readLatencyGauge.inc(latency);
        queriesCountGauge.inc();
        data = JSON.parse(message);
        return res.status(200).json({
            status: 200,
            message: 'All User found successfully',
            data: data
        });

    } catch (error) {
        res.status(400).json({
            status: 400,
            message: 'Somethings went wrong',
            error: error.message
        });
    }
}

async function show(req, res, next) {
    try {

        let channelName = 'mychannel';
        let chaincodeName = 'birthcert';
        let args = req.query.args;
        let fcn = 'getBirthCert';

        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }
        console.log('args==========', args);
        args = args.replace(/'/g, '"');
        args = JSON.parse(args);
        logger.debug(args);

        const start = Date.now();
        let message = await query.queryChaincode('admin', channelName, chaincodeName, fcn, args);
        // message = message.replace(/'/g, '"');
        const latency = Date.now() - start;
        readLatencyGauge.inc(latency);
        queriesCountGauge.inc();
        data = JSON.parse(message);
        data = {
            key: args[0],
            Record: data
        };
        return res.status(200).json({
            status: 200,
            message: 'Birth certificate successfully',
            data: data
        });

    } catch (error) {
        res.status(400).json({
            status: 400,
            message: 'Somethings went wrong',
            error: error.message
        });
    }
}


exports.store = store;
exports.index = index;
exports.show = show;
