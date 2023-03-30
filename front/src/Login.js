import React from 'react'
import axios from 'axios'
import { useState } from 'react';

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onClickHandle = async (e) => {
        e.preventDefault();
        const res = await axios.post('http://localhost:5000/api/login', 
        {
            username: username,
            password: password
        });
        console.log(res.data);
        
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