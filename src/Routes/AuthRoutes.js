import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = function AuthRoute({ fallback, children, ...props }) {
    return (
        <Route
            {...props}
            render={({ location }) => {
                if (props.token === null) {
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

export default connect(mapStateToProps, null)(AuthRoute);
