/**
 * mock server for serving sunburst data to angular client
 */
const express = require('express');
const jsonfile = require('jsonfile')
let releases = [];
let testcases = [];
let tcstatus = [];
releases = jsonfile.readFileSync('./releases.json');
// function (err, releases)
//  {
//     if (err) {
//         console.log('error reading releases')
//         return;
//     }
//     releases = rel;

// })
testcases = jsonfile.readFileSync('./testcases.json');
testcases = testcases.splice(100);
tcstatus = jsonfile.readFileSync('./tcstatus.json');
tcggr = {
    'domain': { 'StoragePVC': { 'Pass': 100, 'Fail': 200, 'Total': 400 } }, 'domaintotal': { 'Pass': 300, 'Fail': '300', 'Total': 1000 }
}
//  function (err, tc) {
//     if (err) {
//         console.log('error reading testcases')
//         return;
//     }
//     testcases = tc;
//     console.log(releases);
//     console.log(testcases);
// })
// console.log(releases);
// console.log(testcases);
const app = express();
const responseDelayQuick = 10;
const responseDelayModerate = 100;
const responseDelaySlow = 300;

app.use(express.json());
app.use('/', express.static('./build'));
app.post('/api/login', (req, res) => {
    console.log('API- DOC');
    setTimeout(() => {
        res.send({ authToken: 'token' });
    }, responseDelaySlow);
});
app.post('/api/signup', (req, res) => {
    console.log('API- DOC');
    setTimeout(() => {
        res.send({ authToken: 'token' });
    }, responseDelaySlow);
});

app.post('/api/usrinfo', (req, res) => {
    console.log('API- DOC');
    setTimeout(() => {
        res.send({ authToken: 'token' });
    }, responseDelaySlow);
});

app.get('/api/tcinfo/:releaseid', (req, res) => {
    console.log('API- DOC');
    setTimeout(() => {
        res.send(testcases);
    }, responseDelaySlow);
});

app.get('/api/tcaggr/:releaseid', (req, res) => {
    setTimeout(() => {
        res.send(tcaggr);
    }, responseDelaySlow);
});
// app.post('/api/tcstatus', (req, res) => {
//     console.log('data from test update');
//     setTimeout(() => {
//         releases.push(req.body);
//         jsonfile.writeFileSync('./testcases.json', releases);
//         res.send({ status: 'OK' });
//     }, responseDelaySlow);
// });

app.get('/api/release/all', (req, res) => {
    console.log('getting releasesa');
    console.log('API- DOC');
    setTimeout(() => {
        res.send(releases);
    }, responseDelaySlow);
});
app.get('/api/release/:id', (req, res) => {
    console.log('API- DOC');
    console.log('calling ', req.params.id);
    setTimeout(() => {
        res.send(releases.filter(item => item.ReleaseNumber === req.params.id));
    }, responseDelaySlow);
});
app.post('/api/release/:id', (req, res) => {
    console.log('data from front ');
    console.log(req);
    setTimeout(() => {
        let found = null;
        releases.forEach((item, index) => {
            if (item.ReleaseNumber === req.params.id) {
                found = index;
            }
        });
        if (found !== null) {
            releases[found] = req.body;
        }
        jsonfile.writeFileSync('./releases.json', releases);
        res.send({ status: 'OK' });
    }, responseDelaySlow);
});
app.post('/api/release', (req, res) => {
    console.log('data from front');
    console.log(req);
    setTimeout(() => {
        releases.push(req.body);
        jsonfile.writeFileSync('./releases.json', releases);
        res.send({ status: 'OK' });
    }, responseDelaySlow);
});

app.delete('/api/release/:id', (req, res) => {
    console.log(req);
    setTimeout(() => {
        let found = null;
        releases.forEach((item, index) => {
            if (item.ReleaseNumber === req.params.id) {
                found = index;
            }
        });
        if (found !== null) {
            releases.splice(found, 1);
        }
        jsonfile.writeFileSync('./releases.json', releases);
        res.send({ status: 'OK' });
    }, responseDelaySlow);
});
console.log('Mock Invar listening on port 5051');
const server = app.listen('5051');

var gracefulShutdown = function () {

    console.log('saving file');
    // jsonfile.writeFileSync('./releases.json', releases);
    // jsonfile.writeFileSync('./testcases.json', testcases);
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



// const data = require('./data');

// const app = express();
// const responseDelayQuick = 10;
// const responseDelayModerate = 1000;
// const responseDelaySlow = 3000;

// app.use(express.json());
// app.use('/', express.static('../build'));
// app.post('/api/login', (req, res) => {
//     console.log('API- DOC');
//     setTimeout(() => {
//         res.send({ authToken: 'token' });
//     }, responseDelaySlow);
// });
// app.post('/api/signup', (req, res) => {
//     console.log('API- DOC');
//     setTimeout(() => {
//         res.send({ authToken: 'token' });
//     }, responseDelaySlow);
// });

// app.post('/api/usrinfo', (req, res) => {
//     console.log('API- DOC');
//     setTimeout(() => {
//         res.send({ authToken: 'token' });
//     }, responseDelaySlow);
// });

// app.get('/api/tcinfo', (req, res) => {
//     console.log('API- DOC');
//     setTimeout(() => {
//         res.send({ authToken: 'token' });
//     }, responseDelaySlow);
// });

// app.post('/api/tcinfo', (req, res) => {
//     console.log('API- DOC');
//     setTimeout(() => {
//         res.send({ authToken: 'token' });
//     }, responseDelaySlow);
// });

// app.get('/api/release/all', (req, res) => {
//     console.log('API- DOC');
//     setTimeout(() => {
//         res.send(data.all);
//     }, responseDelaySlow);
// });
// app.get('/api/release/:id', (req, res) => {
//     console.log('API- DOC');
//     setTimeout(() => {
//         res.send(data[req.params.id]);
//     }, responseDelaySlow);
// });
// app.post('/api/release', (req, res) => {
//     console.log(req);
//     setTimeout(() => {
//         res.send({ status: 'OK' });
//     }, responseDelaySlow);
// });
// app.delete('/api/release/:id', (req, res) => {
//     console.log(req);
//     setTimeout(() => {
//         res.send({ status: 'OK' });
//     }, responseDelaySlow);
// });

// console.log('Mock Invar listening on port 5051');
// const server = app.listen('5051');

// var gracefulShutdown = function () {
//     console.log("Shutting down....");
//     server.close(function () {
//         setTimeout(function () {
//             console.log("Terminated");
//             process.exit(0);
//         }, 10);
//     });
// }

// // listen for TERM signal .e.g. kill
// process.on('SIGTERM', gracefulShutdown);

// // listen for INT signal e.g. Ctrl-C
// process.on('SIGINT', gracefulShutdown);
