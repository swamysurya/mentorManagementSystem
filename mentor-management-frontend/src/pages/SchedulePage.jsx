import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../assets/styles/shedule.css';

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <h1>Schedule Management</h1>
          <button className="add-button">
            Add New Session
          </button>
        </div>
        <div className="schedule-list">
          {schedules.length === 0 ? (
            <div className="empty-state">
              <p>No scheduled sessions yet</p>
            </div>
          ) : (
            schedules.map((session) => (
              <div key={session.id} className="schedule-item">
                {/* Schedule item content */}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default SchedulePage;