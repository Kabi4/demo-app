import React, { useState } from 'react';
import { Input } from '../../Components/index';
import './Index.css';
import axios from 'axios';
import { local_url } from '../../localUrl';
import * as Actions from '../../Store/ActionCreator/Index';
import { connect } from 'react-redux';
const Signin = ({ ...props }) => {
    const [email, setEmail] = useState('smithcheryl@yahoo.com');
    const [password, setPassword] = useState('12345678');
    const [requestin, setRequesting] = useState(false);
    const signInHanlder = async (e) => {
        e.preventDefault();
        setRequesting(true);
        let token = '';
        await axios
            .post(
                `${local_url}/login`,
                {
                    email: 'smithcheryl@yahoo.com',
                    password: '12345678',
                },
                { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
            )
            .then((res) => {
                token = res.data.results.token;

                return axios.get(
                    `${local_url}/user`,

                    {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            })
            .then((res) => {
                props.loginuser({ token: token, id: res.data.results.user_id, username: res.data.results.name });
                setRequesting(false);
            })
            .catch((err) => {
                setRequesting(false);
                alert('Please check your network!');
            });
    };

    return (
        <div className="signin">
            <div className="box">
                <h2 className="heading_primary">Sign In</h2>
                <form className="form_signin" action="submit">
                    <Input
                        Label="Email"
                        name="email"
                        type="email"
                        value={email}
                        change={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <Input
                        Label="Password"
                        name="password"
                        type="password"
                        value={password}
                        change={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <button disabled={requestin} type="submit" onClick={signInHanlder} className="btn-primary">
                        {requestin ? 'Processing....' : 'Signin'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginuser: ({ id, token, username }) => {
            dispatch(Actions.login({ id, token, username }));
        },
    };
};

export default connect(null, mapDispatchToProps)(Signin);
