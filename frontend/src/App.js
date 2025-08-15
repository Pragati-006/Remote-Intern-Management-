import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import InternList from './components/InternList';
import AddIntern from './components/AddIntern';
import TaskList from './components/TaskList';
import Attendance from './components/Attendance';
import Evaluation from './components/Evaluation';

function PrivateRoute({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <div className="navbar">
        <Link to="/">Interns</Link>
        <Link to="/add">Add Intern</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/evaluation">Evaluation</Link>
        <span className="spacer" />
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>

      <div className="container">
        <Routes>
          {/* public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* private */}
          <Route path="/" element={<PrivateRoute><InternList /></PrivateRoute>} />
          <Route path="/add" element={<PrivateRoute><AddIntern /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
          <Route path="/evaluation" element={<PrivateRoute><Evaluation /></PrivateRoute>} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
