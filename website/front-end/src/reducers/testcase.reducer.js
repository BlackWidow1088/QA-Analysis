// Here, more than any other area, I'm cutting some corners (at least,
// for now). As it stands, you're always logged in as one user. There's
// no way to create accounts or log out.
//
// Later, I may make a simplified auth system, where you can log in as
// any of the arbitrary users, to ensure that all the reducers update

import { combineReducers } from 'redux';

import {
    DELETE_TEST_CASE,
    SAVE_TEST_CASE,
    SAVE_TEST_CASE_STATUS,
    SAVE_SINGLE_TEST_CASE
} from '../actions';

const initialState = {
    testcases: {},
    testcaseStatus: {}
};

// TO BE REMOVEED
// const types = [
//     { key: 'PVC_Remote', Domain: 'Storage PVC', SubDomain: 'Remote' },
//     { key: 'PVC_Local', Domain: 'Storage PVC', SubDomain: 'Local' },
//     { key: 'PVC_Mirrored', Domain: 'Storage PVC', SubDomain: 'Mirrored' },
//     { key: 'SR', Domain: 'Storage Remote', SubDomain: 'Remote' },
//     { key: 'SS', Domain: 'Storage Snapshot', SubDomain: 'Snapshot' },
//     { key: 'N_HostNetwork', Domain: 'Network', SubDomain: 'Host Network' },
//     { key: 'N_Endpoint', Domain: 'Network', SubDomain: 'Endpoint' },
//     { key: 'AT_Qos', Domain: 'Qos', tag: 'Additional Test' },
//     { key: 'M_Migration', Domain: 'Management', SubDomain: 'Master Migration' },
//     { key: 'MZ_ZoneCapability', Domain: 'Multizone Cluster', SubDomain: 'Zone Capability' },
//     { key: 'MZ_BasicNW', Domain: 'Multizone Cluster', SubDomain: 'Basic Networking' },
// ]
// const sortTestCaseByDomain = (tc) => {
//     types.forEach(item => {
//         if (!tc.Domain) {
//             if (tc.TcID.search(item.key) !== -1) {
//                 tc = { ...tc, Domain: item.Domain, SubDomain: item.SubDomain, tag: item.tag, Setup: item.Setup ? item.Setup : 'Common' }
//             }
//         }
//     });
//     return tc;
// }
// ////////////////////
// Modifiers //////////
// //////////////////

// ////////////////////
// Reducers //////////
// //////////////////
function all(state = initialState.testcases, action) {
    switch (action.type) {
        case SAVE_TEST_CASE:
            state[action.payload.id] = action.payload.data;
            return { ...state };

        case DELETE_TEST_CASE:
            let found = null;
            state.forEach((item, index) => {
                if (item.ReleaseNumber === action.payload.id) {
                    found = index;
                }
            });
            if (found !== null) {
                state.splice(found, 1);
            }
            return { ...state };

        case SAVE_SINGLE_TEST_CASE:
            if (state[action.payload.id]) {
                state[action.payload.id].unshift(action.payload.data)
            }
            return { ...state };

        default:
            return state;
    }
}
function status(state = initialState.testcaseStatus, action) {
    switch (action.type) {
        case SAVE_TEST_CASE_STATUS:
            state[action.payload.id] = action.payload.data;
            return { ...state };
        default:
            return state;
    }
}

export const testcaseReducer = combineReducers({
    all,
    status
});

// ////////////////////
// Selectors //////////
// //////////////////

const colors = [
    '#B5801D',
    '#B959E9',
    '#6A58E6',
    '#EEF3E6',
    '#D1EF67',
    '#BACEAB',
    '#A2AC6A',
    '#05ED9D',
    '#1AABCD',
    '#99812E',
    '#60C3DF',
    '#C7CC4D',
    '#910727',
    '#F1E956',
    '#821F49',
    '#069D8B',
    '#9BE914',
    '#2E270D',
    '#07A345',
    '#FE3D1D',
    '#BB00F1',
    '#3DFD87',
    '#AF31CA',
    '#96568A',
    '#5B5013',
    '#A660F8',
    '#549609',
    '#29CBB4',
    '#7E31BB',
    '#01C5AF',
    '#4786E1',
    '#D04616',
    '#CA5B9F',
    '#F07444',
    '#292FAB',
    '#CD50B2',
    '#EFACF6',
    '#B6BCD4',
    '#D8285A',
    '#474AD7',
    '#910E7E',
    '#ADED5A',
    '#77CE6E',
    '#E8C05C',
    '#F04B07',
    '#2E06D7',
    '#70469D',
    '#1F1E7D',
    '#278A44',
    '#7A6BA2',
    '#EA981D',
    '#24C5D5',
    '#781BC3',
    '#1ECD0D',
    '#AE4854',
    '#4F5783',
    '#77765B',
    '#7AC913',
    '#716C1C',
    '#E73582',
    '#D2713F',
    '#33B5E6',
    '#61981E',
    '#D182FA',
    '#D278F3',
    '#ED594F',
    '#B5C841',
    '#23EA2A',
    '#09EBF8',
    '#9A5815',
    '#688DF9',
    '#12A11D',
    '#A1F43F',
    '#4807C2',
    '#DC5D83',
    '#2D0AEE',
    '#101463',
    '#3E47E6',
    '#AE93BF',
    '#DF1BF0',
    '#EFAE92',
    '#C8EEEF',
    '#B310F4',
    '#F69351',
    '#24E9FF',
    '#3C878E',
    '#D7CAD6',
    '#A30A3D',
    '#827A4E',
    '#FA9128',
    '#0F34A6',
    '#92C7DE',
    '#0CA169',
    '#F8E5D8',
    '#135CCC',
    '#56FB95',
    '#25E867',
    '#83626A',
    '#6093D0',
    '#ED5C5E'
]
// doughnut = {
//     labels: [
//         'Red',
//         'Green',
//         'Yellow',
//     ],
//     datasets: [
//         {
//             data: [300, 50, 100],
//             backgroundColor: [
//                 '#FF6384',
//                 '#36A2EB',
//                 '#FFCE56',
//             ],
//             hoverBackgroundColor: [
//                 '#FF6384',
//                 '#36A2EB',
//                 '#FFCE56',
//             ],
//         }],
// };