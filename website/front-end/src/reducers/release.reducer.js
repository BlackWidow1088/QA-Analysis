// Here, more than any other area, I'm cutting some corners (at least,
// for now). As it stands, you're always logged in as one user. There's
// no way to create accounts or log out.
//
// Later, I may make a simplified auth system, where you can log in as
// any of the arbitrary users, to ensure that all the reducers update

import { combineReducers } from 'redux';

import {
    SAVE_RELEASE_BASIC_INFO,
    DELETE_RELEASE,
    RELEASE_CHANGE
} from '../actions';

const initialState = {
    releases: [
    ],
    current: {}
};
export const alldomains = ['Storage', 'Network', 'Management', 'Others'];
const domainDetail = {
    'Storage-Tests': { name: 'Storage', index: 0 },
    'StorageRemote-Tests': { name: 'Storage', index: 0 },
    'StoragePVC': { name: 'Storage', index: 0 },
    'StorageMirrored-Tests': { name: 'Storage', index: 0 },
    'StorageSnapshot-Tests': { name: 'Storage', index: 0 },
    'Storage-DrivesetTCs': { name: 'Storage', index: 0 },
    'NetworkTestCases': { name: 'Network', index: 1 },
    'ManagementTestCases': { name: 'Management', index: 2 },
    'Rbac': { name: 'Management', index: 2 },
}

// ////////////////////
// Modifiers //////////
// //////////////////
function getAggregate(release) {
    if (!release.TcAggregate) {
        release.TcAggregate = {
            all: {
                "Tested": {
                    "auto": {
                        "Pass": 0,
                        "Fail": 0,
                        "Skip": 0
                    },
                    "manual": {
                        "Pass": 0,
                        "Fail": 0,
                        "Skip": 0
                    }
                },
                "NotTested": 0,
                "NotApplicable": 0
            },
            domain: {}
        }
    }
    if (!release.TcAggregate.domain) {
        release.TcAggregate.domain = {};
    }
    if (!release.TcAggregate.all) {
        release.TcAggregate.all = {
            "Tested": {
                "auto": {
                    "Pass": 0,
                    "Fail": 0,
                    "Skip": 0
                },
                "manual": {
                    "Pass": 0,
                    "Fail": 0,
                    "Skip": 0
                }
            },
            "NotTested": 0,
            "NotApplicable": 0
        };
    }
    release.TcAggregate.uidomain = {};
    alldomains.forEach((item, index) => {
        release.TcAggregate.uidomain[item] = {
            "Tested": {
                "auto": {
                    "Pass": 0,
                    "Fail": 0,
                    "Skip": 0
                },
                "manual": {
                    "Pass": 0,
                    "Fail": 0,
                    "Skip": 0
                }
            },
            "NotTested": 0,
            "NotApplicable": 0
        }
    });

    let relDomain = release.TcAggregate.domain
    Object.keys(relDomain).forEach((item, index) => {
        if (domainDetail[item]) {
            release.TcAggregate.domain[item].tag = domainDetail[item].name;
            release.TcAggregate.uidomain[domainDetail[item].name].Tested.auto.Pass += relDomain[item].Tested.auto.Pass;
            release.TcAggregate.uidomain[domainDetail[item].name].Tested.auto.Fail += relDomain[item].Tested.auto.Fail;
            release.TcAggregate.uidomain[domainDetail[item].name].Tested.auto.Skip += relDomain[item].Tested.auto.Skip;

            release.TcAggregate.uidomain[domainDetail[item].name].Tested.manual.Pass += relDomain[item].Tested.manual.Pass;
            release.TcAggregate.uidomain[domainDetail[item].name].Tested.manual.Fail += relDomain[item].Tested.manual.Fail;
            release.TcAggregate.uidomain[domainDetail[item].name].Tested.manual.Skip += relDomain[item].Tested.manual.Skip;

            release.TcAggregate.uidomain[domainDetail[item].name].NotTested += relDomain[item].NotTested;
            release.TcAggregate.uidomain[domainDetail[item].name].NotApplicable += relDomain[item].NotApplicable;
        } else {
            release.TcAggregate.domain[item].tag = "Others";
            release.TcAggregate.uidomain["Others"].Tested.auto.Pass += relDomain[item].Tested.auto.Pass;
            release.TcAggregate.uidomain["Others"].Tested.auto.Fail += relDomain[item].Tested.auto.Fail;
            release.TcAggregate.uidomain["Others"].Tested.auto.Skip += relDomain[item].Tested.auto.Skip;

            release.TcAggregate.uidomain["Others"].Tested.manual.Pass += relDomain[item].Tested.manual.Pass;
            release.TcAggregate.uidomain["Others"].Tested.manual.Fail += relDomain[item].Tested.manual.Fail;
            release.TcAggregate.uidomain["Others"].Tested.manual.Skip += relDomain[item].Tested.manual.Skip;

            release.TcAggregate.uidomain["Others"].NotTested += relDomain[item].NotTested;
            release.TcAggregate.uidomain["Others"].NotApplicable += relDomain[item].NotApplicable;
        }
    })
    return release;
}
// ////////////////////
// Reducers //////////
// //////////////////
function all(state = initialState.releases, action) {
    switch (action.type) {
        case SAVE_RELEASE_BASIC_INFO:
            console.log('current state ', state)
            console.log('saving id ', action.payload.id)
            console.log('saving ', action.payload.data);
            let found = false;
            let dates = [
                'TargetedReleaseDate', 'ActualReleaseDate', 'TargetedCodeFreezeDate',
                'UpgradeTestingStartDate', 'QAStartDate', 'ActualCodeFreezeDate', 'TargetedQAStartDate'
            ]
            let formattedDates = {};
            dates.forEach(item => {
                if (action.payload.data[item]) {
                    let date = new Date(action.payload.data[item]);
                    let month = `${(date.getMonth() + 1)}`.length === 1 ? `0${(date.getMonth() + 1)}` : `${(date.getMonth() + 1)}`
                    let day = `${date.getUTCDate()}`.length === 1 ? `0${date.getUTCDate()}` : `${date.getUTCDate()}`
                    formattedDates[item] = `${date.getFullYear()}-${month}-${day}`
                }
            })
            action.payload.data = {
                ...action.payload.data,
                ...formattedDates
            }

            let release = getAggregate(action.payload.data);
            action.payload.data = { ...action.payload.data, ...release }
            state.forEach((item, index) => {
                if (item.ReleaseNumber === action.payload.id) {
                    found = true;
                    state[index] = { ...item, ...action.payload.data }
                }
            });
            if (!found) {
                state.push(action.payload.data);
            }
            return [...state];

        case DELETE_RELEASE:
            found = null;
            state.forEach((item, index) => {
                if (item.ReleaseNumber === action.payload.id) {
                    found = index;
                }
            });
            if (found !== null) {
                state.splice(found, 1);
            }
            return [...state];
        default:
            return state;
    }
}
function current(state = initialState.current, action) {
    switch (action.type) {
        case RELEASE_CHANGE:
            return { ...state, id: action.payload.id }
        default:
            return state;
    }
}

export const releaseReducer = combineReducers({
    all,
    current
});

// ////////////////////
// Selectors //////////
// //////////////////

export const getCurrentRelease = (state) => {
    let current = state.release.all.filter(item => item.ReleaseNumber === state.release.current.id)[0];
    return current ? current : {}
}

export const getTCForStatus = (state, id) => {
    let release = state.release.all.filter(item => item.ReleaseNumber === id)[0];
    if (!release) {
        return;
    }
    if (!release.TcAggregate) {
        return;
    }
    console.log('aggre')
    console.log(release.TcAggregate);
    let data = {
        labels: [
            'Fail (' + (release.TcAggregate.all.Tested.auto.Fail + release.TcAggregate.all.Tested.manual.Fail) + ')',
            'Pass (' + (release.TcAggregate.all.Tested.auto.Pass + release.TcAggregate.all.Tested.manual.Pass) + ')',
            'Skip (' + (release.TcAggregate.all.Tested.auto.Skip + release.TcAggregate.all.Tested.manual.Skip) + ')',
            'Not Tested (' + release.TcAggregate.all.NotTested + ')',
        ],
        datasets: [
            {
                data: [
                    (release.TcAggregate.all.Tested.auto.Fail + release.TcAggregate.all.Tested.manual.Fail),
                    (release.TcAggregate.all.Tested.auto.Pass + release.TcAggregate.all.Tested.manual.Pass),
                    (release.TcAggregate.all.Tested.auto.Skip + release.TcAggregate.all.Tested.manual.Skip),
                    release.TcAggregate.all.NotTested
                ],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#B5801D',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#B5801D',
                ],
            }],
    };
    console.log('data for tc status');
    console.log(data);
    return data;
}

export const getTCForStrategy = (state, id) => {
    let release = state.release.all.filter(item => item.ReleaseNumber === id)[0];
    if (!release) {
        return;
    }
    if (!release.TcAggregate) {
        return;
    }
    let storage = release.TcAggregate.uidomain['Storage'].Tested.auto.Pass + release.TcAggregate.uidomain['Storage'].Tested.manual.Pass
        + release.TcAggregate.uidomain['Storage'].Tested.auto.Fail + release.TcAggregate.uidomain['Storage'].Tested.manual.Fail
        + release.TcAggregate.uidomain['Storage'].Tested.auto.Skip + release.TcAggregate.uidomain['Storage'].Tested.manual.Skip
        + release.TcAggregate.uidomain['Storage'].NotTested;
    let network = release.TcAggregate.uidomain['Network'].Tested.auto.Pass + release.TcAggregate.uidomain['Network'].Tested.manual.Pass
        + release.TcAggregate.uidomain['Network'].Tested.auto.Fail + release.TcAggregate.uidomain['Network'].Tested.manual.Fail
        + release.TcAggregate.uidomain['Network'].Tested.auto.Skip + release.TcAggregate.uidomain['Network'].Tested.manual.Skip
        + release.TcAggregate.uidomain['Network'].NotTested;
    let management = release.TcAggregate.uidomain['Management'].Tested.auto.Pass + release.TcAggregate.uidomain['Management'].Tested.manual.Pass
        + release.TcAggregate.uidomain['Management'].Tested.auto.Fail + release.TcAggregate.uidomain['Management'].Tested.manual.Fail
        + release.TcAggregate.uidomain['Management'].Tested.auto.Skip + release.TcAggregate.uidomain['Management'].Tested.manual.Skip
        + release.TcAggregate.uidomain['Management'].NotTested;
    let others = release.TcAggregate.uidomain['Others'].Tested.auto.Pass + release.TcAggregate.uidomain['Others'].Tested.manual.Pass
        + release.TcAggregate.uidomain['Others'].Tested.auto.Fail + release.TcAggregate.uidomain['Others'].Tested.manual.Fail
        + release.TcAggregate.uidomain['Others'].Tested.auto.Skip + release.TcAggregate.uidomain['Others'].Tested.manual.Skip
        + release.TcAggregate.uidomain['Others'].NotTested;
    let data = {
        labels: [
            'Storage (' + storage + ')',
            'Network (' + network + ')',
            'Management (' + management + ')',
            'Others (' + others + ')',
        ],
        datasets: [
            {
                data: [
                    storage,
                    network,
                    management,
                    others
                ],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#B5801D',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#B5801D',
                ],
            }],
    };
    console.log('data for tc strategy');
    console.log(data);
    return data;
}

export const getTCStatusForUIDomains = (release) => {
    if (!release) {
        return;
    }
    if (!release.TcAggregate) {
        return;
    }
    let doughnuts = [];
    let storagePass = release.TcAggregate.uidomain['Storage'].Tested.auto.Pass + release.TcAggregate.uidomain['Storage'].Tested.manual.Pass;
    let storageFail = release.TcAggregate.uidomain['Storage'].Tested.auto.Fail + release.TcAggregate.uidomain['Storage'].Tested.manual.Fail;
    let storageSkipped = release.TcAggregate.uidomain['Storage'].Tested.auto.Skip + release.TcAggregate.uidomain['Storage'].Tested.manual.Skip
    let storageNotTested = release.TcAggregate.uidomain['Storage'].NotTested;
    let networkPass = release.TcAggregate.uidomain['Network'].Tested.auto.Pass + release.TcAggregate.uidomain['Network'].Tested.manual.Pass
    let networkFail = release.TcAggregate.uidomain['Network'].Tested.auto.Fail + release.TcAggregate.uidomain['Network'].Tested.manual.Fail
    let networkSkipped = release.TcAggregate.uidomain['Network'].Tested.auto.Skip + release.TcAggregate.uidomain['Network'].Tested.manual.Skip
    let networkNotTested = release.TcAggregate.uidomain['Network'].NotTested;
    let managementPass = release.TcAggregate.uidomain['Management'].Tested.auto.Pass + release.TcAggregate.uidomain['Management'].Tested.manual.Pass
    let managementFail = release.TcAggregate.uidomain['Management'].Tested.auto.Fail + release.TcAggregate.uidomain['Management'].Tested.manual.Fail
    let managementSkipped = release.TcAggregate.uidomain['Management'].Tested.auto.Skip + release.TcAggregate.uidomain['Management'].Tested.manual.Skip
    let managementNotTested = release.TcAggregate.uidomain['Management'].NotTested;
    let othersPass = release.TcAggregate.uidomain['Others'].Tested.auto.Pass + release.TcAggregate.uidomain['Others'].Tested.manual.Pass
    let othersFail = release.TcAggregate.uidomain['Others'].Tested.auto.Fail + release.TcAggregate.uidomain['Others'].Tested.manual.Fail
    let othersSkipped = release.TcAggregate.uidomain['Others'].Tested.auto.Skip + release.TcAggregate.uidomain['Others'].Tested.manual.Skip
    let othersNotTested = release.TcAggregate.uidomain['Others'].NotTested;
    let each = [
        { Fail: storageFail, Pass: storagePass, Skip: storageSkipped, NotTested: storageNotTested },
        { Fail: networkFail, Pass: networkPass, Skip: networkSkipped, NotTested: networkNotTested },
        { Fail: managementFail, Pass: managementPass, Skip: managementSkipped, NotTested: managementNotTested },
        { Fail: othersFail, Pass: othersPass, Skip: othersSkipped, NotTested: othersNotTested },
    ]

    alldomains.forEach((item, index) => {
        doughnuts.push({
            data: {
                labels: [
                    'Fail (' + each[index].Fail + ')',
                    'Pass (' + each[index].Pass + ')',
                    'Skip (' + each[index].Skip + ')',
                    'Not Tested (' + each[index].NotTested + ')',
                ],
                datasets: [
                    {
                        data: [
                            each[index].Fail,
                            each[index].Pass,
                            each[index].Skip,
                            each[index].NotTested
                        ],
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#B5801D',
                        ],
                        hoverBackgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#B5801D',
                        ],
                    }],
            }, title: item
        })
    })
    return doughnuts;

}

export const getTCStatusForUISubDomains = (release, domain) => {
    if (!release) {
        return;
    }
    if (!release.TcAggregate) {
        return;
    }
    let doughnuts = [];
    Object.keys(release.TcAggregate.domain).forEach((item, index) => {
        if (domain === release.TcAggregate.domain[item].tag) {
            let pass = release.TcAggregate.domain[item].Tested.auto.Pass + release.TcAggregate.domain[item].Tested.manual.Pass
            let fail = release.TcAggregate.domain[item].Tested.auto.Fail + release.TcAggregate.domain[item].Tested.manual.Fail
            let Skip = release.TcAggregate.domain[item].Tested.auto.Skip + release.TcAggregate.domain[item].Tested.manual.Skip
            let nottested = release.TcAggregate.domain[item].NotTested + release.TcAggregate.domain[item].NotTested
            doughnuts.push({
                data: {
                    labels: [
                        'Fail (' + fail + ')',
                        'Pass (' + pass + ')',
                        'Skip (' + Skip + ')',
                        'Not Tested (' + nottested + ')',
                    ],
                    datasets: [
                        {
                            data: [
                                fail,
                                pass,
                                Skip,
                                nottested
                            ],
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#B5801D',
                            ],
                            hoverBackgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#B5801D',
                            ],
                        }],
                }, title: item
            })
        }
    });
    if (doughnuts.length) {
        doughnuts.sort(function (a, b) {
            if (b.data.datasets[0].data[0] !== a.data.datasets[0].data[0]) return b.data.datasets[0].data[0] - a.data.datasets[0].data[0];
            if (b.data.datasets[0].data[1] !== a.data.datasets[0].data[1]) return b.data.datasets[0].data[1] - a.data.datasets[0].data[1];
            if (b.data.datasets[0].data[2] !== a.data.datasets[0].data[2]) return b.data.datasets[0].data[2] - a.data.datasets[0].data[2];
            if (b.data.datasets[0].data[3] !== a.data.datasets[0].data[3]) return b.data.datasets[0].data[3] - a.data.datasets[0].data[3];

        });
    }

    return doughnuts;
}
export const getTCStatusDomains = (state, id) => {
    let doughnuts = [];
    return doughnuts;
    let release = state.release.all.filter(item => item.ReleaseNumber === id)[0];
    if (!release) {
        return;
    }
    if (!release.TcAggregate) {
        return;
    }
    if (release) {
        let tcs = release.TcAggregate.uidomain;
        if (tcs) {
            Object.keys(tcs).forEach(item => {
                doughnuts.push({
                    data: {
                        labels: [
                            'Fail (' + tcs[item].automated.Fail + ')',
                            'Pass (' + tcs[item].automated.Pass + ')',
                            'Not Automated (' + (tcs[item].total.nonautomated) + ')',
                        ],
                        datasets: [
                            {
                                data: [
                                    tcs[item].automated.Fail, tcs[item].automated.Pass, tcs[item].total.nonautomated
                                ],
                                backgroundColor: [
                                    '#FF6384',
                                    '#36A2EB',
                                    '#FFCE56',
                                ],
                                hoverBackgroundColor: [
                                    '#FF6384',
                                    '#36A2EB',
                                    '#FFCE56',
                                ],
                            }],
                    },
                    title: item
                })
            })
        }
    }
    return doughnuts;
}

export const getTCStatusForSunburst = (release) => {
    if (!release) {
        return;
    }
    if (!release.TcAggregate) {
        return;
    }
    if (!release.TcAggregate.domain) {
        return;
    }
    let domains = {
        name: 'domains', children: [
            {
                name: 'Storage', children: []
            },
            {
                name: 'Network', children: []
            },
            {
                name: 'Management', children: []
            },
            {
                name: 'Others', children: []
            },
        ]
    };
    Object.keys(release.TcAggregate.domain).forEach(item => {
        let domain = release.TcAggregate.domain[item];
        let total = domain.Tested.auto.Pass + domain.Tested.manual.Pass
            + domain.Tested.auto.Fail + domain.Tested.manual.Fail
            + domain.Tested.auto.Skip + domain.Tested.manual.Skip
            + domain.NotTested;
        if (domainDetail[item]) {
            domains.children[domainDetail[item].index].children.push({ name: item, size: total })
        } else {
            domains.children[3].children.push({ name: item, size: total })
        }
    });
    return domains;
}

export const getDomainStatus = (state, id) => {
    let doughnuts = [];
    let release = state.release.all.filter(item => item.ReleaseNumber === id)[0];
    if (!release) {
        return;
    }
    if (!release.TcAggregate) {
        return;
    }
    alldomains.forEach((item, index) => {
        doughnuts.push({
            data: {
                labels: [
                    'Fail (' + (release.TcAggregate.uidomain['Storage'].automated.Fail) + ')',
                    'Pass (' + (release.TcAggregate.uidomain['Network'].automated.Pass) + ')',
                    'Not Tested (' + (release.TcAggregate.uidomain['Management'].total.nonautomated) + ')',
                ],
                datasets: [
                    {
                        data: [
                            (release.TcAggregate.uidomain['Storage'].automated.Fail),
                            (release.TcAggregate.uidomain['Network'].total.automated + release.TcAggregate.uidomain['Network'].total.nonautomated),
                            (release.TcAggregate.uidomain['Management'].total.automated + release.TcAggregate.uidomain['Management'].total.nonautomated)
                        ],
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                        ],
                        hoverBackgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                        ],
                    }],
            }, title: item
        })
    })
    console.log('data for tc status for domains');
    console.log(doughnuts);
    return doughnuts;

}

export const getSubDomainStatus = (state, id) => {

}