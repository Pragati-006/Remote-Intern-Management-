import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'manager' });
  const [loading, setLoading] = useState(false);
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form.name, form.email, form.password, form.role);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      <p className="subtitle">Create a manager/admin account</p>
      <form className="form-grid" onSubmit={onSubmit}>
        <div>
          <label>Name</label>
          <input name="name" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} required />
        </div>
        <div>
          <label>Role</label>
          <select name="role" value={form.role} onChange={onChange}>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="full">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Register'}</button>
        </div>
      </form>
    </div>
  );
}
