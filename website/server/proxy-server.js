#!/usr/bin/env node
/*
proxy server for serving mock data remotely and else directed to webpack server listening to
localhost:4200
 */
var http = require('http');
var httpProxy = require('http-proxy');

var APP_URL = 'http://localhost:3000';

var URL = ['/api'];
// var DATA_URL = 'http://192.168.1.6:8000';
var DATA_URL = 'http://localhost:5051';
var proxy = httpProxy.createProxyServer({ changeOrigin: true });

var server = http.createServer(function (req, res) {
    var target = APP_URL;

    for (var i = 0; i < URL.length; i++) {
        if (req.url.startsWith(URL[i])) {
            target = DATA_URL;
            break;
        }
    }
    proxy.web(req, res, { target: target });
});

console.log('listening on port 5050');
server.listen(5050);
