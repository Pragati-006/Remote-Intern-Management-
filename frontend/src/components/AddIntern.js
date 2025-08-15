import React, { useState } from 'react';
import { createIntern } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddIntern() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', department:'', startDate:'' });
  const [loading, setLoading] = useState(false);
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createIntern(form);
      alert('Intern added');
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add intern');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Add New Intern</h2>
      <p className="subtitle">Create a profile to start assigning tasks</p>

      <form className="form-grid mt-2" onSubmit={onSubmit}>
        <div>
          <label>Name</label>
          <input name="name" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label>Department</label>
          <input name="department" value={form.department} onChange={onChange} required />
        </div>
        <div>
          <label>Start Date</label>
          <input name="startDate" type="date" value={form.startDate} onChange={onChange} required />
        </div>
        <div className="full">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Saving…' : 'Add Intern'}</button>
        </div>
      </form>
    </div>
  );
}
