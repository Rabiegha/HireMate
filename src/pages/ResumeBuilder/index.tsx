import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ResumeList from './ResumeList';
import ResumeEditor from './ResumeEditor';

function ResumeBuilder() {
  return (
    <Routes>
      <Route index element={<ResumeList />} />
      <Route path="new" element={<ResumeEditor />} />
      <Route path=":id/edit" element={<ResumeEditor />} />
    </Routes>
  );
}

export default ResumeBuilder;