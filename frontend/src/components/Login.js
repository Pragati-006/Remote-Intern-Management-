import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <p className="subtitle">Enter your email and password</p>
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="full">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
        <div className="full">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} required />
        </div>
        <div className="full">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
        </div>
      </form>
    </div>
  );
}
