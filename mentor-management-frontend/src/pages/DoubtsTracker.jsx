import React from 'react';
import Navbar from '../components/Navbar';
import DoubtsPage from './DoubtsPage';
import '../assets/styles/doubts.css';

const DoubtsTracker = () => {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <DoubtsPage />
      </main>
    </div>
  );
};

export default DoubtsTracker;