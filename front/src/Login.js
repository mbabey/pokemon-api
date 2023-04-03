import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import Dashboard from './Dashboard';
import UserPage from './UserPage';

function Login({ SERVER_ADDRESS }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [user, setUser] = useState('');

    const onLoginHandle = async (e) => {
        e.preventDefault();
        const res = await axios.post(`${SERVER_ADDRESS}/login`,
            {
                username: username,
                password: password
            });
        console.log(res.data);
        setUser(res.data);
        const authorization_tokens = res.headers('authorization').split(',');
        setAccessToken(authorization_tokens[1]);
        setRefreshToken(authorization_tokens[0]);
    }

    const onCreateAccountHandle = async (e) => {
        e.preventDefault();
        const res = await axios.post(`${SERVER_ADDRESS}/register`,
            {
                username: username,
                email: email,
                password: password
            });
        console.log(res.data);
        onLoginHandle(e);
    }

    return (
        <div>
            {
                accessToken && user?.role === 'user' && <UserPage />
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
                (<div>
                    <form onSubmit={onLoginHandle}>
                        <input
                            type="text"
                            placeholder="username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Login</button>
                    </form>
                    <form onSubmit={onCreateAccountHandle}>
                        <input
                            type="text"
                            placeholder="username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Create Account</button>
                    </form>
                </div>)
            }

        </div>
    )
}

export default Login