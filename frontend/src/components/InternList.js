import React, { useEffect, useState } from 'react';
import { fetchInterns, deleteIntern } from '../services/api';

export default function InternList() {
  const [interns, setInterns] = useState([]);

  const load = async () => {
    try {
      const res = await fetchInterns();
      setInterns(res.data);
    } catch (e) {
      alert('Failed to load interns');
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this intern?')) return;
    await deleteIntern(id);
    load();
  };

  return (
    <div className="card">
      <h2>Interns</h2>
      <p className="subtitle">Manage registered interns</p>
      <div className="table-wrap mt-2">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Department</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {interns.map(i => (
              <tr key={i._id}>
                <td>{i.name}</td>
                <td>{i.email}</td>
                <td>{i.department}</td>
                <td>
                  <button className="btn danger" onClick={() => onDelete(i._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {interns.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign:'center' }}>No interns yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
