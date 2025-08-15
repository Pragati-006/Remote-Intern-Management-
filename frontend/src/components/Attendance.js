import React, { useEffect, useState } from 'react';
import { fetchInterns, markAttendance, fetchAttendanceReport } from '../services/api';

export default function Attendance() {
  const [interns, setInterns] = useState([]);
  const [internId, setInternId] = useState('');
  const [status, setStatus] = useState('Present');
  const [report, setReport] = useState({ records: [], attendancePercentage: 0 });

  const loadInterns = async () => setInterns((await fetchInterns()).data);
  const loadReport = async () => {
    if (!internId) return setReport({ records: [], attendancePercentage: 0 });
    setReport((await fetchAttendanceReport(internId)).data);
  };

  useEffect(() => { loadInterns(); }, []);
  useEffect(() => { loadReport(); }, [internId]);

  const mark = async () => {
    if (!internId) return alert('Select an intern first');
    await markAttendance({ intern: internId, date: new Date(), status });
    loadReport();
  };

  return (
    <div className="card">
      <h2>Attendance</h2>
      <p className="subtitle">Record daily presence per intern</p>

      <div className="row">
        <label style={{ marginBottom: 0 }}>Intern:</label>
        <select value={internId} onChange={e=>setInternId(e.target.value)} style={{ maxWidth: 260 }}>
          <option value="">-- Select Intern --</option>
          {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
        </select>

        <label style={{ marginBottom: 0 }}>Status:</label>
        <select value={status} onChange={e=>setStatus(e.target.value)} style={{ maxWidth: 160 }}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button className="btn" onClick={mark}>Mark</button>
      </div>

      <div className="mt-2"><b>Attendance %:</b> {report.attendancePercentage}</div>

      <div className="table-wrap mt-2">
        <table>
          <thead><tr><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {report.records.map(r => (
              <tr key={r._id}>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.status}</td>
              </tr>
            ))}
            {internId && report.records.length === 0 && (
              <tr><td colSpan="2" style={{ textAlign:'center' }}>No records yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
