import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ranking from './pages/Ranking';
import Rewards from './pages/Rewards';
import AdminTeachers from './pages/AdminTeachers';
import Reports from './pages/Reports';

const RotaPrivada = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<RotaPrivada><Dashboard /></RotaPrivada>} />
        <Route path="/ranking" element={<RotaPrivada><Ranking /></RotaPrivada>} />
        <Route path="/rewards" element={<RotaPrivada><Rewards /></RotaPrivada>} />
        <Route path="/admin/teachers" element={<RotaPrivada><AdminTeachers /></RotaPrivada>} />
        <Route path="/reports" element={<RotaPrivada><Reports /></RotaPrivada>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;