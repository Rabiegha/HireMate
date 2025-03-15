import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CoverLetterList from './CoverLetterList';
import CoverLetterEditor from './CoverLetterEditor';

function CoverLetters() {
  return (
    <Routes>
      <Route index element={<CoverLetterList />} />
      <Route path="new" element={<CoverLetterEditor />} />
      <Route path=":id/edit" element={<CoverLetterEditor />} />
    </Routes>
  );
}

export default CoverLetters;