/**
 * mock server for serving sunburst data to angular client
 */
const express = require('express');
const jsonfile = require('jsonfile')
let releases = [];
let testcases = [];
let tcstatus = [];

var jiraHeaders = null;

var Client = require('node-rest-client').Client;
client = new Client();
// Provide user credentials, which will be used to log in to JIRA.
var loginArgs = {
    data: {
        "username": "abhijeet",
        "password": "abhijeet0987!"
    },
    headers: {
        "Content-Type": "application/json"
    }
};
var jiraReq = client.post("http://dwsjira1.eng.diamanti.com:8080/rest/auth/1/session", loginArgs, function (data, response) {
    if (response.statusCode == 200) {
        console.log('succesfully logged in, session:', data.session);
        var session = data.session;
        jiraHeaders = {
            cookie: session.name + '=' + session.value,
            "Content-Type": "application/json"
        }
        // Get the session information and store it in a cookie in the header
        searchArgs = {
            headers: {
                // Set the cookie from the session information
                cookie: session.name + '=' + session.value,
                "Content-Type": "application/json"
            },
            data: {
                // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                jql: "type=Bug AND status=Closed"
            }
        };
        // Make the request return the search results, passing the header information including the cookie.
        // client.post("http://localhost:8090/jira/rest/api/2/search", searchArgs, function (searchResult, response) {
        //     console.log('status code:', response.statusCode);
        //     console.log('search result:', searchResult);
        // });
    } else {
        console.log('jira logging failed')
        // throw "Login failed :(";
    }
}, function (err) {
    console.log('cannot get jira')
});
jiraReq.on('requestTimeout', function (err) {
    console.log('cannot get jira')
})
jiraReq.on('responseTimeout', function (err) {
    console.log('cannot get jira')
})
jiraReq.on('error', function (err) {
    console.log('cannot get jira')
})



var JIRA_URL = 'http://dwsjira1.eng.diamanti.com:8080';
const app = express();
const responseDelayQuick = 10;
const responseDelayModerate = 100;
const responseDelaySlow = 300;

app.use(express.json());
app.use('/rest/features/:id', (req, res) => {
    var str = `?jql=type%20in%20("New%20Feature")%20AND%20fixVersion%20in%20(${req.params.id})&fields=key,summary,status&maxResults=2000`
    // /rest/api/2/search?jql=type%20in%20("New%20Feature")%20AND%20fixVersion%20in%20(2.3.0)&fields=key,summary
    console.log(jiraHeaders);
    // var searchArgs = {
    //     headers: jiraHeaders,
    //     data: {
    //         // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
    //         jql: "type=Bug AND status=Closed"
    //     }
    // };
    client.get(JIRA_URL + '/rest/api/2/search' + str, searchArgs, function (searchResult, response) {
        console.log('status code:', response.statusCode);
        console.log('search result:', searchResult);
        res.send(searchResult);
    }, err => { console.log('cannot get jira') });
}, err => { })
app.use('/rest/bugs/:id', (req, res) => {
    var str = `?jql=type%20in%20("Bug")%20AND%20fixVersion%20in%20(${req.params.id})&fields=key,status,priority,summary&maxResults=2000`
    // /rest/api/2/search?jql=type%20in%20("New%20Feature")%20AND%20fixVersion%20in%20(2.3.0)&fields=key,summary
    console.log(jiraHeaders);
    // var searchArgs = {
    //     headers: jiraHeaders,
    //     data: {
    //         // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
    //         jql: "type=Bug AND status=Closed"
    //     }
    // };
    client.get(JIRA_URL + '/rest/api/2/search' + str, searchArgs, function (searchResult, response) {
        console.log('status code:', response.statusCode);
        console.log('search result:', searchResult);
        res.send(searchResult);
    }, err => { console.log('cannot get jira') });
}, err => { })
app.use('/rest/featuredetail', (req, res) => {
    console.log('got from post', req.body.data);
    var str = '?fields=key,summary,subtasks,created,progress,status,updated,priority'
    client.get(req.body.data + str, function (searchResult, response) {
        console.log('status code:', response.statusCode);
        console.log('search result:', searchResult);
        res.send(searchResult);
    });

}, err => {

})
app.use('/', express.static('./build'));
app.use('*', express.static('./build'));
console.log('Mock Invar listening on port 5051');
const server = app.listen('5051');

var gracefulShutdown = function () {
    console.log("Shutting down....");
    server.close(function () {
        setTimeout(function () {
            console.log("Terminated");
            process.exit(0);
        }, 10);
    });
}

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);


