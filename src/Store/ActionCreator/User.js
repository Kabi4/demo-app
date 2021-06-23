import * as actions from '../ActionTypes';

export const login = ({ token, id, username }) => {
    return {
        type: actions.login,
        payload: { token, id, username },
    };
};

export const logout = () => {
    return {
        type: actions.logout,
    };
};
