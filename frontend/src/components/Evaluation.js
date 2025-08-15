import React, { useEffect, useState } from 'react';
import { fetchInterns, submitEvaluation, fetchPerformanceReport } from '../services/api';

export default function Evaluation() {
  const [interns, setInterns] = useState([]);
  const [internId, setInternId] = useState('');
  const [criteria, setCriteria] = useState('');
  const [score, setScore] = useState(0);
  const [comments, setComments] = useState('');
  const [report, setReport] = useState(null);

  const loadInterns = async () => setInterns((await fetchInterns()).data);
  const loadReport = async () => {
    if (!internId) return setReport(null);
    setReport((await fetchPerformanceReport(internId)).data);
  };

  useEffect(() => { loadInterns(); }, []);
  useEffect(() => { loadReport(); }, [internId]);

  const submit = async () => {
    if (!internId) return alert('Select an intern first');
    await submitEvaluation({ intern: internId, criteria, score, comments });
    setCriteria(''); setScore(0); setComments('');
    loadReport();
  };

  return (
    <div className="card">
      <h2>Evaluation</h2>
      <p className="subtitle">Submit scores and view combined report</p>

      <div className="row">
        <label style={{ marginBottom: 0 }}>Intern:</label>
        <select value={internId} onChange={e=>setInternId(e.target.value)} style={{ maxWidth: 260 }}>
          <option value="">-- Select Intern --</option>
          {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
        </select>
      </div>

      <div className="form-grid mt-2">
        <div className="full">
          <label>Criteria</label>
          <input value={criteria} onChange={e=>setCriteria(e.target.value)} />
        </div>
        <div>
          <label>Score (0–10)</label>
          <input type="number" min="0" max="10" value={score} onChange={e=>setScore(+e.target.value)} />
        </div>
        <div className="full">
          <label>Comments</label>
          <textarea rows="3" value={comments} onChange={e=>setComments(e.target.value)} />
        </div>
        <div className="full">
          <button className="btn" onClick={submit}>Submit Evaluation</button>
        </div>
      </div>

      {report && (
        <div className="card" style={{ marginTop: 12 }}>
          <b>Report</b>
          <div className="row mt-1">
            <span className="btn secondary">Tasks: {report.taskCompletionPercentage}%</span>
            <span className="btn secondary">Attendance: {report.attendancePercentage}%</span>
            <span className="btn secondary">Avg Score: {report.avgEvaluationScore}</span>
            <span className="btn secondary">Final: {report.finalScore}</span>
          </div>
        </div>
      )}
    </div>
  );
}
