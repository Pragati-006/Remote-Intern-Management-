import React, { useEffect, useState } from 'react';
import { fetchInterns, fetchTasks, createTask, updateTask, deleteTask } from '../services/api';

export default function TaskList() {
  const [interns, setInterns] = useState([]);
  const [internId, setInternId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', deadline:'' });

  const loadInterns = async () => setInterns((await fetchInterns()).data);
  const loadTasks = async () => {
    if (!internId) return setTasks([]);
    setTasks((await fetchTasks(internId)).data);
  };

  useEffect(() => { loadInterns(); }, []);
  useEffect(() => { loadTasks(); /* when intern changes */ }, [internId]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const add = async (e) => {
    e.preventDefault();
    if (!internId) return alert('Select an intern first');
    await createTask({ ...form, intern: internId });
    setForm({ title:'', description:'', deadline:'' });
    loadTasks();
  };

  const complete = async (id) => { await updateTask(id, { status: 'Completed' }); loadTasks(); };
  const remove = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id); loadTasks();
  };

  return (
    <div className="card">
      <h2>Tasks</h2>
      <p className="subtitle">Assign and track tasks per intern</p>

      <div className="row mt-1">
        <label style={{ marginBottom: 0 }}>Intern:</label>
        <select value={internId} onChange={e=>setInternId(e.target.value)} style={{ maxWidth: 260 }}>
          <option value="">-- Select Intern --</option>
          {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
        </select>
      </div>

      <form className="form-grid mt-2" onSubmit={add}>
        <div className="full">
          <label>Title</label>
          <input name="title" value={form.title} onChange={onChange} required />
        </div>
        <div className="full">
          <label>Description</label>
          <textarea name="description" rows="2" value={form.description} onChange={onChange} />
        </div>
        <div>
          <label>Deadline</label>
          <input type="date" name="deadline" value={form.deadline} onChange={onChange} />
        </div>
        <div className="row" style={{ alignItems:'end' }}>
          <button className="btn" type="submit">Add Task</button>
        </div>
      </form>

      <div className="mt-2">
        {tasks.map(t => (
          <div key={t._id} className="card" style={{ padding:'12px', marginBottom:10 }}>
            <div className="row" style={{ justifyContent:'space-between' }}>
              <div>
                <b>{t.title}</b>
                <div className="subtitle">{t.description}</div>
              </div>
              <div className="row">
                <span className="btn secondary">{t.status}</span>
                {t.status !== 'Completed' && (
                  <button className="btn success" onClick={() => complete(t._id)}>Complete</button>
                )}
                <button className="btn danger" onClick={() => remove(t._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {internId && tasks.length === 0 && <div className="subtitle">No tasks yet.</div>}
      </div>
    </div>
  );
}
