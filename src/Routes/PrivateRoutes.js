import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = function PrivateRoute({ fallback, children, token, ...props }) {
    return (
        <Route
            {...props}
            render={({ location }) => {
                if (token) {
                    return children;
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: fallback,
                                state: { from: location },
                            }}
                        />
                    );
                }
            }}
        />
    );
};
const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token,
    };
};

export default connect(mapStateToProps, null)(PrivateRoute);
