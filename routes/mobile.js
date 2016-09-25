let express = require('express');
let request = require('request');
let router = express.Router();
const base = 'http://apis.juhe.cn/mobile/get?key=9f719ab7014f2cbdc7b394edf70d0f76';
router.get('/', function(req, res, next) {
    getMobile(req, res, next);
});
router.post('/', function(req, res, next) {
    getMobile(req, res, next);
});

function getMobile(req, res, next) {
    let type = req.query.type || req.body.type;
    let phone = req.query.phone || req.body.phone;
    let callback = req.query.callback || req.body.callback;
    let url = base + '&phone=' + phone + '&dtype=' + type;
    request(url, function(err, response, body) {
        if (type !== 'xml') {
            body = JSON.parse(body);
            let output = {
                data: (body.result && body.result.data ? body.result.data : body.result) || {},
                status: {
                    code: 200,
                    message: ''
                }
            };
            if (!err && response.statusCode === 200 && body.error_code === 0) {
                //
            } else {
                output.status = {
                    code: -1,
                    message: err || body.reason || 'Something bad happend.'
                };
            }
            if (callback) {
                return res.jsonp(output);
            } else {
                return res.json(output);
            }
        } else {
            res.header('content-type', 'text/xml; charset=utf-8');
            return res.send(body);
        }
    });
}

module.exports = router;