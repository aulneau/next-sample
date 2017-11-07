import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

// Actions
const SAVE_STORE_DATA = 'global/SAVE_STORE_DATA';

const initial = {
    loaded: false,
    counter: 0
}

// Reducer
export default function reducer(state = {}, action = {}) {
    switch (action.type) {
        case SAVE_STORE_DATA:
            return {
                ...state,
                data: action.data,
                loaded: true
            }
        // do reducer stuff
        default: return state;
    }
}

// Action Creators
export const saveStoreData = data => ({type: SAVE_STORE_DATA, data})

export const initStore = (initialState = initial) => (
    createStore(reducer, initialState, composeWithDevTools())
)
