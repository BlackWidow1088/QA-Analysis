// Here, more than any other area, I'm cutting some corners (at least,
// for now). As it stands, you're always logged in as one user. There's
// no way to create accounts or log out.
//
// Later, I may make a simplified auth system, where you can log in as
// any of the arbitrary users, to ensure that all the reducers update

import { combineReducers } from 'redux';

import {
    SAVE_RELEASE_BASIC_INFO,
    DELETE_RELEASE
} from '../actions';

const initialState = {
    releases: [
    ]
};


// ////////////////////
// Modifiers //////////
// //////////////////

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
                'UpgradeTestingStartDate', 'QAStartDate'
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
            console.log(action.payload.data)
            state.forEach((item, index) => {
                if (item.ReleaseNumber === action.payload.id) {
                    found = true;
                    state[index] = { ...item, ...action.payload.data }
                }
            });
            if (!found) {
                console.log(action);
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

export default combineReducers({
    all
});

