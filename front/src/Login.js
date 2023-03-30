import React from 'react'
import axios from 'axios'
import { useState } from 'react';

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    

    const onClickHandle = async (e) => {
        e.preventDefault();
        const res = await axios.post('http://localhost:5000/login', 
        {
            username: username,
            password: password
        });
        console.log(res.data);
        const authorization_tokens = res.headers('authorization').split(',');
        accessToken = authorization_tokens[1];
        refreshToken = authorization_tokens[0];
        console.log(authorization_tokens);
    }

  return (
    <div>

        <form onSubmit={onClickHandle}>
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
    </div>
  )
}

export default Login