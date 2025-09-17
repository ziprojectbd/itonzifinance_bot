import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AirdropLayout from './AirdropLayout';
import AirdropDashboard from './Dashboard/Dashboard';
import AirdropTasks from './Tasks/Tasks';
import AirdropUsers from './Users/Users';
import AirdropNotices from './Notices';

const AirdropIndex: React.FC = () => (
  <AirdropLayout>
    <Routes>
      <Route path="dashboard" element={<AirdropDashboard />} />
      <Route path="tasks" element={<AirdropTasks />} />
      <Route path="users" element={<AirdropUsers />} />
      <Route path="notices" element={<AirdropNotices />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  </AirdropLayout>
);

export default AirdropIndex; 