import * as actions from '../ActionTypes';

const inititalState = {
    username: null,
    token: null,
    id: null,
};

const reducer = (state = inititalState, action) => {
    switch (action.type) {
        case actions.login:
            return {
                username: action.payload.username,
                token: action.payload.token,
                id: action.payload.id,
            };
        case actions.logout:
            return {
                username: null,
                token: null,
                id: null,
            };
        default:
            return {
                ...state,
            };
    }
};

export default reducer;
