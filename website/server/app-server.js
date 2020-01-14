/**
 * mock server for serving sunburst data to angular client
 */

const express = require('express');
const jsonfile = require('jsonfile')
// let releases = {};
let releases = jsonfile.readFileSync('./releases.json');
let assignedTCs = jsonfile.readFileSync('./currentAssigned.json');
let users = jsonfile.readFileSync('./users.json');
let allTcs = jsonfile.readFileSync('./tcCompleteSort.json');
// assignedTCs['2.3.0'] = { "ADMIN": Object.keys(allTcs['2.3.0']) }
let statusOptions = jsonfile.readFileSync('./constants.json');
let tcs = {};
let updatedReleases = {};

var jiraHeaders = null;
var searchArgs = null;

function assignPriority(priority, release) {
    Object.keys(allTcs[release]).forEach(item => {
        if (allTcs[release][item].Priority === '' || !allTcs[release][item].Priority) {
            allTcs[release][item].Priority = priority;
        }
    })
}




// function sortInfo() {
//     updatedReleases = jsonfile.readFileSync('./releases.json');
//     let TCMaster = jsonfile.readFileSync('./masterTC.json');
//     let TC230 = jsonfile.readFileSync('./230TC.json');
//     let status = jsonfile.readFileSync('./tcstatus.json');

//     let tcs230 = {};
//     let tcsMaster = {};
//     let domainsMaster = {};
//     let domains230 = {};
//     let total = 0;
//     let masterAggr = { domain: {}, all: { "Tested": { "auto": { "Pass": 0, "Fail": 0, "Skip": 0 }, "manual": { "Pass": 0, "Fail": 0, "Skip": 0 } }, "NotTested": 0, "NotApplicable": 0, "Block": 0, "Skip": 0 } }
//     TC230.forEach(item => {
//         if (domains230[item.Domain]) {
//             if (!domains230[item.Domain].includes(item.SubDomain)) {
//                 domains230[item.Domain].push(item.SubDomain);
//             }
//         } else {
//             domains230[item.Domain] = [];
//         }
//         item.Status = 'RESOLVED';
//         item.Activity = [{
//             "Date": "2019-12-30T00:00:00.000Z",
//             "Header": "RESOLVED: master, REPORTER:",
//             "Details": {},
//             "StatusChangeComments": "RESOLVED"
//         }];
//         item.AutoBuilds = [];
//         item.Tag = 'DAILY';
//         item.ManualBuilds = [];
//         item.LatestE2EBuilds = [];
//         item.Master = true;
//         item.Date = '2019-12-30T00:00:00.000Z';
//         item.Assignee = 'ADMIN';
//         item.Steps = '';
//         tcs230[item.TcID] = item;
//     });
//     TCMaster.forEach(item => {
//         if (domainsMaster[item.Domain]) {
//             if (!domainsMaster[item.Domain].includes(item.SubDomain)) {
//                 domainsMaster[item.Domain].push(item.SubDomain);
//                 masterAggr.domain[item.Domain].NotTested += item.CardType.length;
//                 total += item.CardType.length;
//             }
//         } else {
//             total += item.CardType.length;
//             masterAggr.domain[item.Domain] = { "Tested": { "auto": { "Pass": 0, "Fail": 0, "Skip": 0 }, "manual": { "Pass": 0, "Fail": 0, "Skip": 0 } }, "NotTested": item.CardType.length, "NotApplicable": 0, "Block": 0, "Skip": 0 };
//             domainsMaster[item.Domain] = [];
//         }
//         item.Status = 'CREATED';
//         item.Activity = [{
//             "Date": "2019-12-30T00:00:00.000Z",
//             "Header": "CREATED: master, REPORTER:",
//             "Details": {},
//             "StatusChangeComments": ""
//         }];
//         item.AutoBuilds = [];
//         item.Tag = 'DAILY';
//         item.ManualBuilds = [];
//         item.LatestE2EBuilds = [];
//         item.Master = true;
//         item.Date = '2019-12-30T00:00:00.000Z';
//         item.Assignee = 'ADMIN';
//         item.Steps = '';
//         tcsMaster[item.TcID] = item;
//     });
//     masterAggr.all.NotTested = total;

//     status.forEach(item => {
//         let e2eBuild = {
//             "e2eBuild": item.Build,
//             "Result": item.Result,
//             "Date": new Date(item.Date).toISOString(),
//             CardType: item.CardType,
//             "log": "",
//             "logUrl": ""
//         }
//         tcs230[item.TcID].LatestE2EBuilds.push(e2eBuild);
//     });
//     tcs = {
//         master: tcsMaster,
//         '2.3.0': tcs230
//     }

//     updatedReleases.forEach(item => {
//         if (item.ReleaseNumber === 'master') {
//             item.AvailableDomainOptions = domainsMaster;
//             item.StatusOptions = statusOptions;
//             item.TagOptions = ["DAILY", "WEEKLY", "MONTHLY"]
//             item.TcAggregate = masterAggr;
//         }
//         if (item.ReleaseNumber === '2.3.0') {
//             item.AvailableDomainOptions = domains230;
//             item.StatusOptions = statusOptions;
//             item.TagOptions = ["DAILY", "WEEKLY", "MONTHLY"]
//         }
//     });
// }
// sortInfo();

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
loginJIRA()
    .then(function (res) {
        console.log('logged in')
    }).catch(err => {

    });
// var jiraReq = client.post("http://dwsjira1.eng.diamanti.com:8080/rest/auth/1/session", loginArgs, function (data, response) {
//     if (response.statusCode == 200) {
//         console.log('succesfully logged in, session:', data.session);
//         var session = data.session;
//         jiraHeaders = {
//             cookie: session.name + '=' + session.value,
//             "Content-Type": "application/json"
//         }
//         // Get the session information and store it in a cookie in the header
//         searchArgs = {
//             headers: {
//                 // Set the cookie from the session information
//                 cookie: session.name + '=' + session.value,
//                 "Content-Type": "application/json"
//             },
//             // data: {
//             //     // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
//             //     jql: "type=Bug AND status=Closed"
//             // }
//         };
//         // Make the request return the search results, passing the header information including the cookie.
//         // client.post("http://localhost:8090/jira/rest/api/2/search", searchArgs, function (searchResult, response) {
//         //     console.log('status code:', response.statusCode);
//         //     console.log('search result:', searchResult);
//         // });
//     } else {
//         console.log('jira logging failed')
//         // throw "Login failed :(";
//     }
// }, function (err) {
//     console.log('cannot get jira')
// });

function loginJIRA() {
    return new Promise(function (resolve, reject) {
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
                    // data: {
                    //     // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                    //     jql: "type=Bug AND status=Closed"
                    // }
                };
                resolve();
                // Make the request return the search results, passing the header information including the cookie.
                // client.post("http://localhost:8090/jira/rest/api/2/search", searchArgs, function (searchResult, response) {
                //     console.log('status code:', response.statusCode);
                //     console.log('search result:', searchResult);
                // });
            } else {
                console.log('jira logging failed')
                reject();
            }
        }, function (err) {
            console.log('cannot get jira')
            reject();
        });

        jiraReq.on('requestTimeout', function (err) {
            console.log('cannot get jira due to timeout')
            reject();
        })
        jiraReq.on('responseTimeout', function (err) {
            console.log('cannot get jira due to response timeout')
            reject();
        })
        jiraReq.on('error', function (err) {
            console.log('cannot get jira due to error')
            reject();
        })
    });
}


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
    var jiraReq = client.get(JIRA_URL + '/rest/api/2/search' + str, searchArgs, function (searchResult, response) {
        if (response.statusCode === 401) {
            loginJIRA().then(function () {
                client.get(JIRA_URL + '/rest/api/2/search' + str, searchArgs, function (searchResult2, response2) {
                    res.send(searchResult2);
                }, err => { console.log(err) });
            }).catch(err => { console.log('rpomise failed'); console.log(err) })
        } else {
            res.send(searchResult);
        }
    }, err => {
        console.log('caught error in primitive')
    });
    jiraReq.on('error', function (err) {
        console.log('cannot get features due to error in fetching JIRA')
    })
}, err => { })
// app.use('/rest/bugs/:id', (req, res) => {
//     var str = `?jql=type%20in%20("Bug")%20AND%20fixVersion%20in%20(${req.params.id})&fields=key,status,priority,summary&maxResults=2000`
//     // /rest/api/2/search?jql=type%20in%20("New%20Feature")%20AND%20fixVersion%20in%20(2.3.0)&fields=key,summary
//     console.log(jiraHeaders);
//     // var searchArgs = {
//     //     headers: jiraHeaders,
//     //     data: {
//     //         // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
//     //         jql: "type=Bug AND status=Closed"
//     //     }
//     // };
//     client.get(JIRA_URL + '/rest/api/2/search' + str, searchArgs, function (searchResult, response) {
//         console.log('status code:', response.statusCode);
//         console.log('search result:', searchResult);
//         res.send(searchResult);
//     }, err => { console.log('cannot get jira') });
// }, err => { })
app.use('/rest/bugs/total/:id', (req, res) => {
    var totalBugsStr = `?jql=fixVersion%20in%20(${req.params.id})%20AND%20type%20in%20("Bug","Sub-task")&fields=key,status,priority,summary&maxResults=2000`
    var jiraReq = client.get(JIRA_URL + '/rest/api/2/search' + totalBugsStr, searchArgs, function (searchResultTotal, response) {
        if (response.statusCode === 401) {
            loginJIRA().then(function () {
                client.get(JIRA_URL + '/rest/api/2/search' + totalBugsStr, searchArgs, function (searchResultTotal2, responseTotal) {
                    res.send(searchResultTotal2);
                }, err1 => { console.log('cannot get jira') });
            }).catch(err => { console.log('rpomise failed'); console.log(err) })
        } else {
            res.send(searchResultTotal);
        }
    }, err => {
        console.log('caught error in primitive')
    });
    jiraReq.on('error', function (err) {
        console.log('cannot get features due to error in fetching JIRA')
    })
}, err => { });
app.use('/rest/bugs/open/:id', (req, res) => {
    var openBugsStr = `?jql=status%20in%20("Open","In Progress","To Do","Done")%20AND%20fixVersion%20in%20(${req.params.id})%20AND%20type%20in%20("Bug","Sub-task")%20AND%20(Component!=Automation%20OR%20Component=EMPTY)&fields=key,status,priority,summary&maxResults=2000`
    var jiraReq = client.get(JIRA_URL + '/rest/api/2/search' + openBugsStr, searchArgs, function (searchResultTotal, response) {
        if (response.statusCode === 401) {
            loginJIRA().then(function () {
                client.get(JIRA_URL + '/rest/api/2/search' + openBugsStr, searchArgs, function (searchResultTotal2, responseTotal) {
                    res.send(searchResultTotal2);
                }, err1 => { console.log('cannot get jira') });
            }).catch(err => { console.log('rpomise failed'); console.log(err) })
        } else {
            res.send(searchResultTotal);
        }
    }, err => {
        console.log('caught error in primitive')
    });
    jiraReq.on('error', function (err) {
        console.log('cannot get features due to error in fetching JIRA')
    })
}, err => { })
app.use('/rest/bugs/resolved/:id', (req, res) => {
    var resolvedBugsStr = `?jql=status%20in%20("Done","Resolved","Closed","Duplicate")%20AND%20fixVersion%20in%20(${req.params.id})%20AND%20type%20in%20("Bug","Sub-task")%20AND%20(Component!=Automation%20OR%20Component=EMPTY)&fields=key,status,priority,summary&maxResults=2000`
    var jiraReq = client.get(JIRA_URL + '/rest/api/2/search' + resolvedBugsStr, searchArgs, function (searchResultTotal, response) {
        if (response.statusCode === 401) {
            loginJIRA().then(function () {
                client.get(JIRA_URL + '/rest/api/2/search' + resolvedBugsStr, searchArgs, function (searchResultTotal2, responseTotal) {
                    res.send(searchResultTotal2);
                }, err1 => { console.log('cannot get jira') });
            }).catch(err => { console.log('rpomise failed'); console.log(err) })
        } else {
            res.send(searchResultTotal);
        }
    }, err => {
        console.log('caught error in primitive')
    });
    jiraReq.on('error', function (err) {
        console.log('cannot get features due to error in fetching JIRA')
    })
}, err => { })
app.use('/rest/featuredetail', (req, res) => {
    var str = '?fields=key,summary,subtasks,created,progress,status,updated,priority'
    var jiraReq = client.get(req.body.data + str, searchArgs, function (searchResultTotal, response) {
        if (response.statusCode === 401) {
            loginJIRA().then(function () {
                client.get(req.body.data + str, searchArgs, function (searchResultTotal2, responseTotal) {
                    res.send(searchResultTotal2);
                }, err1 => { console.log('cannot get jira') });
            }).catch(err => { console.log('rpomise failed'); console.log(err) })
        } else {
            res.send(searchResultTotal);
        }
    }, err => {
        console.log('caught error in primitive')
    });
    jiraReq.on('error', function (err) {
        console.log('cannot get features due to error in fetching JIRA')
    })

}, err => {

})
app.use('/api/release/all', (req, res) => {
    res.send(releases);
}, err => { })
app.use('/user/login', (req, res) => {
    if (req.body.email === '') {
        res.status(401).send({ message: 'Please enter email' })
    }
    let user = users.filter(item => item.email === req.body.email)[0];










































































































































































































    if (user.email) {
        res.send(user)
    } else {
        users.push({ email: req.body.email, role: 'ENGG', name: req.body.name });
        res.send({ email: req.body.email, role: 'ENGG', name: req.body.name });
        // res.status(404).send({ message: 'User not found' });
    }
    // if (req.body.email === 'yatish@diamanti.com' || req.body.email === 'bharati@diamanti.com' || req.body.email === 'deepak@diamanti.com' || req.body.email === 'rahul@diamanti.com') {
    //     res.send({ role: 'ADMIN', loginTime: new Date() })
    // } else {
    //     res.send({ role: 'ENGG', loginTime: new Date() })
    // }
}, err => { })
app.get('/users', (req, res) => {
    res.send(users);
})
app.get('/user/:release/assigned/:email', (req, res) => {
    let tcs = [];
    if (assignedTCs[req.params.release] && assignedTCs[req.params.release][req.params.email]) {
        assignedTCs[req.params.release][req.params.email].forEach(item => {
            tcs.push(allTcs[req.params.release][item]);
        })
    }
    console.log('tcs to send');
    console.log(tcs);
    console.log(assignedTCs);
    res.send(tcs);
})
app.get('/test/:release/tcinfo/details/id/:id', (req, res) => {
    if (allTcs && allTcs[req.params.release] && allTcs[req.params.release][req.params.id]) {
        res.send(allTcs[req.params.release][req.params.id])
    } else {
        res.send({})
    }
});
function addAssignee(tc, release) {
    if (!assignedTCs[release]) {
        assignedTCs[release] = { 'ADMIN': [] };
    }
    if (!tc.Assignee || tc.Assignee === 'UNASSIGNED' || tc.Status.search('COMPLETED') >= 0 || tc.Status === 'BUG') {
        tc.Assignee = 'ADMIN';
    }
    if (assignedTCs[release][tc.Assignee] && !assignedTCs[release][tc.Assignee].includes(tc.TcID)) {
        assignedTCs[release][tc.Assignee].push(tc.TcID);
    }
    if (!assignedTCs[release][tc.Assignee]) {
        assignedTCs[release][tc.Assignee] = [tc.TcID];
    }
}
function removeAssignee(tc, release) {
    if (!assignedTCs[release]) {
        return;
    }
    if (!tc.Assignee || tc.Assignee === 'UNASSIGNED' || tc.Status.search('COMPLETED') >= 0 || tc.Status === 'BUG') {
        tc.Assignee = 'ADMIN';
    }
    if (assignedTCs[release] && assignedTCs[release][tc.Assignee]) {
        let index = assignedTCs[release][tc.Assignee].indexOf(tc.TcID);
        assignedTCs[release][tc.Assignee].splice(index, 1);
    }
}
app.put('/test/:release/tcinfo/details/id/:id', (req, res) => {
    if (allTcs && allTcs[req.params.release] && allTcs[req.params.release][req.params.id] &&
        allTcs[req.params.release][req.params.id].TcID === req.body.TcID) {
        removeAssignee(allTcs[req.params.release][req.body.TcID], req.params.release);
        allTcs[req.params.release][req.body.TcID] = {
            ...req.body, Activity:
                [...allTcs[req.params.release][req.body.TcID].Activity, req.body.Activity],
            ManualBuilds: [...allTcs[req.params.release][req.body.TcID].ManualBuilds, ...req.body.ManualBuilds],
            AutoBuilds: [...allTcs[req.params.release][req.body.TcID].AutoBuilds, ...req.body.AutoBuilds],
        };
        if (allTcs[req.params.release][req.body.TcID].TcName === '') {
            allTcs[req.params.release][req.body.TcID].TcName = 'TC NOT AUTOMATED'
        }
        // if (req.body.ManualBuilds) {
        //     if (!Array.isArray(allTcs[req.params.release][req.body.TcID].ManualBuilds)) {
        //         allTcs[req.params.release][req.body.TcID].ManualBuilds = [];
        //     }
        //     allTcs[req.params.release][req.body.TcID] = {
        //         ...allTcs[req.params.release][req.body.TcID], ManualBuilds:
        //             [...allTcs[req.params.release][req.body.TcID].ManualBuilds, req.body.ManualBuilds]
        //     };
        // }
        // if (req.body.AutoBuilds) {
        //     if (!Array.isArray(allTcs[req.params.release][req.body.TcID].AutoBuilds)) {
        //         allTcs[req.params.release][req.body.TcID].AutoBuilds = [];
        //     }
        //     allTcs[req.params.release][req.body.TcID] = {
        //         ...allTcs[req.params.release][req.body.TcID], AutoBuilds:
        //             [...allTcs[req.params.release][req.body.TcID].AutoBuilds, req.body.AutoBuilds]
        //     };
        // }
        addAssignee(allTcs[req.params.release][req.body.TcID], req.params.release)
        // jsonfile.writeFileSync('./tcDetails.json', allTcs);
        res.send({ message: 'ok' });
    } else {
        res.status(401).send({ 'message': 'Failed to update ' + req.params.id });
    }
});
app.delete('/test/:release/tcinfo/details/id/:id', (req, res) => {
    if (allTcs && allTcs[req.params.release] && allTcs[req.params.release][req.params.id] &&
        allTcs[req.params.release][req.params.id].TcID === req.params.id) {
        removeAssignee(allTcs[req.params.release][req.params.id], req.params.release);
        allTcs[req.params.release][req.params.id] = null;
        // jsonfile.writeFileSync('./tcDetails.json', allTcs);
        res.send({ message: 'ok' });
    } else {
        res.status(401).send({ 'message': 'Failed to delete ' + req.params.id });
    }
});

app.post('/api/release', (req, res) => {
    console.log(req.body)
    let found = releases.filter(item => item.ReleaseNumber === req.body.ReleaseNumber)[0];
    if (found && found.ReleaseNumber) {
        res.status(401).send({ message: 'Release already exsiting' });
        return;
    }
    let master = releases.filter(item => item.ReleaseNumber === 'master')[0];
    let release = { ...master, ...req.body };
    allTcs[req.body.ReleaseNumber] = { ...allTcs.master };
    assignedTCs[req.body.ReleaseNumber] = { "ADMIN": Object.keys(allTcs.master) }
    releases.push(release);
    assignPriority(req.body.Priority, req.body.ReleaseNumber);
    res.send('ok');
})
app.put('/api/release/:release', (req, res) => {
    let found = releases.filter(item => item.ReleaseNumber === req.body.ReleaseNumber)[0];
    if (!found) {
        res.status(401).send({ message: 'Release not existing' });
        return;
    }
    releases.forEach((item, index) => {
        if (item.ReleaseNumber === req.body.ReleaseNumber) {
            if (item.Priority !== req.body.Priority) {
                assignPriority(req.body.Priority, item.ReleaseNumber);
            }
            releases[index] = { ...item, ...req.body };
            console.log(releases[index]);
        }
    })

    res.send('ok');
})
app.delete('/api/release/:release', (req, res) => {
    let index = null;
    releases.forEach((item, i) => {
        if (item.ReleaseNumber === req.params.release) {
            index = i;
        }
    });
    if (index) {
        releases.splice(index, 1);
        allTcs[req.params.release] = null;
        assignedTCs[req.params.release] = null;
        res.send('ok');
    } else {
        res.status(404).send({ message: 'release not found' })
    }

});

app.post('/api/tcinfo/:release', (req, res) => {
    if (allTcs && allTcs[req.params.release]) {
        if (allTcs[req.params.release][req.body.TcID]) {
            res.status(401).send({ 'message': 'Duplicate TcID' });
        } else if (allTcs[req.params.release][req.body.TcName]) {
            res.status(401).send({ 'message': 'Duplicate TcName' });
        } else {


            allTcs[req.params.release][req.body.TcID] = req.body;
            if (allTcs[req.params.release][req.body.TcID].TcName === '') {
                allTcs[req.params.release][req.body.TcID].TcName = 'TC NOT AUTOMATED'
            }
            // if (req.body.Master) {
            //     allTcs['master'][req.body.TcID] = req.body;
            // }
            addAssignee(allTcs[req.params.release][req.body.TcID], req.params.release)
            // jsonfile.writeFileSync('./tcDetails.json', allTcs);
            res.send({ message: 'ok' });
        }
    } else {
        allTcs[req.params.release] = { [req.body.TcID]: req.body };
        // if (req.body.Master) {
        //     allTcs['master'][req.body.TcID] = req.body;
        // }
        addAssignee(allTcs[req.params.release][req.body.TcID], req.params.release)
        // jsonfile.writeFileSync('./tcDetails.json', allTcs);
        res.send({ message: 'ok' });
    }
});
app.get('/api/tcinfo/:release', (req, res) => {
    console.log('called')
    if (allTcs && allTcs[req.params.release]) {
        let data = Object.keys(allTcs[req.params.release]).map(item => allTcs[req.params.release][item]);

        res.send(data.filter(item => item ? true : false));
    } else {
        res.send([]);
    }
});
// app.use('/', express.static('./build'));
// app.use('*', express.static('./build'));
console.log('Mock Invar listening on port 5051');
const server = app.listen('5051');

var gracefulShutdown = function () {
    console.log("Shutting down....");
    jsonfile.writeFileSync('./users.json', users);
    console.log('updated users')
    jsonfile.writeFileSync('./currentAssigned.json', assignedTCs);
    console.log('updated assigned')
    jsonfile.writeFileSync('./releases.json', releases);
    console.log('updated releases')
    jsonfile.writeFileSync('./tcCompleteSort.json', allTcs);
    console.log('updated tcs')
    // jsonfile.writeFileSync('./tcCompleteSort.json', tcs);
    server.close(function () {
        setTimeout(function () {
            console.log("Terminated");
            process.exit(0);
        }, 100);
    });
}

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);


// TODO:
// 1) tc add/edit/delete confirmation dialog
// 2) tc delete
// 3) tc add css
// 4) tc view/edit on multibox change
// 5) user remove notifications 
// 6) user assigned work 

// 8) qa strategy: update
// 9) icons for cards
// 10) custom sunburst over readymade

// 7) user completed work
// 11) add select options for releases
// 12)  sanity tester for everything
// 13) approve/unapprove

// FEatures:
// 1) if TC is created and in Created status, then only admin will be able to change the status of TC
