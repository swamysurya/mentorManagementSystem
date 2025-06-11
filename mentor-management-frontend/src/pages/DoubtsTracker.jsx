import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../assets/styles/doubts.css';

const DoubtsTracker = () => {
  const [doubts, setDoubts] = useState([]);

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <h1>Doubts Tracker</h1>
          <button className="add-button">
            Add New Doubt
          </button>
        </div>
        <div className="doubts-list">
          {doubts.length === 0 ? (
            <div className="empty-state">
              <p>No doubts recorded yet</p>
            </div>
          ) : (
            doubts.map((doubt) => (
              <div key={doubt.id} className="doubt-item">
                {/* Doubt item content */}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DoubtsTracker;