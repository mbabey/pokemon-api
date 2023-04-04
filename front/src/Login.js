import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import Dashboard from './Dashboard';
import UserPage from './UserPage';
import './styles/login-styles.css'

function Login({ SERVER_ADDRESS }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [user, setUser] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    const onLoginHandle = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${SERVER_ADDRESS}/login`,
                {
                    username: username,
                    password: password
                });
            setUser(res.data);
            const authorization_tokens = res.headers['authorization'].split(',');
            setAccessToken(authorization_tokens[0]);
            setRefreshToken(authorization_tokens[1]);
        } catch (err) {
            e.target[2].blur();
            if (err.response.data.search('User') !== -1) {
                console.log("User not found.");
            } else if (err.response.data.search('Password') !== -1) {
                console.log("Password invalid.");
            } else {
                console.log("Unkown error.");
            }
        }
    }

    const onCreateAccountHandle = async (e) => {
        e.preventDefault();
        console.log()

        try {
            await axios.post(`${SERVER_ADDRESS}/register`,
                {
                    username: username,
                    email: email,
                    password: password
                });
            onLoginHandle(e);
        } catch (err) {
            e.target[3].blur();
            if (err.response.data.search('username') !== -1) {
                console.log("Username taken.");
            } else if (err.response.data.search('email') != -1) {
                console.log("Email taken.");
            } else {
                console.log("Unkown error.");
            }
        }
    }

    const onLogoutHandle = async (e) => {
        e.preventDefault();
        try {
            await axios.get(`${SERVER_ADDRESS}/logout?appid=${refreshToken}`);
            setRefreshToken(null);
            setAccessToken(null);
        } catch (err) {
            console.log(err);
            if (err.response.data.search('User not found') !== -1)
            {
                setRefreshToken(null);
                setAccessToken(null);
            }
        }
    }

    return (
        <div>
            {
                accessToken &&
                <div className='logout-button'>
                    <button onClick={onLogoutHandle} >Logout</button>
                </div>
            }
            {
                accessToken && user?.role === 'user' &&
                <UserPage />
            }
            {
                accessToken && user?.role === 'admin' &&
                <Dashboard
                    accessToken={accessToken}
                    setAccessToken={setAccessToken}
                    refreshToken={refreshToken}
                    SERVER_ADDRESS={SERVER_ADDRESS}
                />
            }
            {
                !accessToken &&
                (<div className="forms-container">
                    {
                        (showRegisterForm) ?
                            <form onSubmit={onCreateAccountHandle} className='create-account-form' >
                                <input
                                    type="text"
                                    placeholder="Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="submit">Join!</button>
                            </form>
                            :
                            <form onSubmit={onLoginHandle} className='login-form' >
                                <input
                                    type="text"
                                    placeholder="Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="submit">Login!</button>
                            </form>
                    }
                    <div className="show-register-form-button">
                        <button onClick={() => setShowRegisterForm(!showRegisterForm)} >{(showRegisterForm) ? "I already have an account" : "I don't have an account"}</button>
                    </div>
                </div>)
            }

        </div>
    )
}

export default Login