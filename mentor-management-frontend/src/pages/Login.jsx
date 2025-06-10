// src/pages/Login.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/login', {
        email, password
      });
      login(res.data.token, res.data.role);
      console.log(res)
      if (res.data.role === 'RP') navigate('/admin');
      else navigate('/mentor');
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
        <div className="login-box">
            <h1 className="login-title">Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email" className="input-label">Email</label>
                    <input id="email" className="login-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                    
                </div>
                <div className="input-group">
                    <label htmlFor="password" className="input-label">Password</label>
                    <input id="password" className="login-input" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
                    
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    </div>
    
  );
}
