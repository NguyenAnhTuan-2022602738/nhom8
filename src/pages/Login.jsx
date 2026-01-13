import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAdmin, settings }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Sai tên đăng nhập hoặc mật khẩu!');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh' 
    }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', color: settings.primaryColor, marginBottom: '20px' }}>Đăng Nhập Admin</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label>Tên đăng nhập</label>
            <input 
              className="editable-input" 
              style={{ width: '100%', background: 'white' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Mật khẩu</label>
            <input 
              type="password" 
              className="editable-input" 
              style={{ width: '100%', background: 'white' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ background: settings.primaryColor }}>
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
