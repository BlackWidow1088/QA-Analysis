#!/usr/bin/env node
/*
proxy server for serving mock data remotely and else directed to webpack server listening to
localhost:4200
 */
var http = require('http');
var httpProxy = require('http-proxy');

var APP_URL = 'http://localhost:3000';
// var APP_URL = 'http://localhost:5051';

// var DJANGOURL = '/api/tcinfo'
// // var DATA_URL = 'http://172.16.19.57:8000';
// // var DATA_URL = 'http://localhost:5051';
// var djangourl = 'http://localhost:8000';

// var APP_URL = 'http://localhost:5000';

var URL = ['/api'];
var JIRA = ['/rest'];
var DATA_URL = 'http://localhost:8000';
// var DATA_URL = 'http://localhost:5051';
// var DATA_URL = 'http://172.16.19.57:8000';
// var DATA_URL = 'http://192.168.1.18:8000';
var DATA_URL = 'http://appserv64:8000';
var JIRA_URL = 'http://localhost:5051';



var proxy = httpProxy.createProxyServer({ changeOrigin: true, timeout: 10000 });

try {

    var server = http.createServer(function (req, res) {
        var target = APP_URL;

        // if (req.url.startsWith(DJANGOURL)) {
        //     target = djangourl;
        // }
        // if (!found && req.url.startsWith(DJANGOURL)) {
        //     found = true;
        //     target = djangourl;
        // }
        for (var i = 0; i < URL.length; i++) {
            if (req.url.startsWith(URL[i])) {
                target = DATA_URL;
                break;
            }
        }
        for (var i = 0; i < JIRA.length; i++) {
            if (req.url.startsWith(JIRA[i])) {
                target = JIRA_URL;
                break;
            }
        }
        try {
            proxy.web(req, res, { target: target }, err => {
                console.log('caught in deep web ', err)

            });
        } catch (err) {
            console.log('err in web ', err);
        }
    }, function (err) {
        console.log('problem connecting')
    });

    console.log('listening on port 5050');
    server.listen(5050);

} catch (err) {
    console.log('caught ', err)
}
