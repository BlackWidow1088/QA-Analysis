// Here, more than any other area, I'm cutting some corners (at least,
// for now). As it stands, you're always logged in as one user. There's
// no way to create accounts or log out.
//
// Later, I may make a simplified auth system, where you can log in as
// any of the arbitrary users, to ensure that all the reducers update

import { combineReducers } from 'redux';

import {
    DELETE_TEST_CASE,
    SAVE_TEST_CASE
} from '../actions';

const initialState = {
    testcases: [
    ]
};


// ////////////////////
// Modifiers //////////
// //////////////////

// ////////////////////
// Reducers //////////
// //////////////////
function all(state = initialState.testcases, action) {
    switch (action.type) {
        case SAVE_TEST_CASE:
            console.log('current state ', state)
            console.log('saving id ', action.payload.id)
            console.log('saving ', action.payload.data);
            state.push(action.payload.data);
            return [...state];

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
            return [...state];
        default:
            return state;
    }
}

export const testcaseReducer = combineReducers({
    all
});

// ////////////////////
// Selectors //////////
// //////////////////
export const getTestSummary = (state) => {
    return {
        totalTests: state.testcase.all ? state.testcase.all.length : 0,
        totalBugs: state.testcase.all ? state.testcase.all.filter(item => item.Bugs !== -1).length : 0,
        totalPassed: state.testcase.all ? state.testcase.all.filter(item => item.Result === 'Pass').length : 0
    }
}