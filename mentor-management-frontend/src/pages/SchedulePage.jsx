import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import "../assets/styles/shedule.css";
import MentorWorkflow from "../components/MentorWorkflow";
import AdvancedMentorTable from "../components/AdvancedMentorTable";

const SchedulePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("advanced");

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg
            className="back-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: 6, verticalAlign: "middle" }}
            width={22}
            height={22}
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Dashboard
        </button>
        <div className="dashboard-card schedule-card">
          <div className="schedule-header-row">
            <span className="schedule-header-title">Schedule and Workflow</span>
          </div>
          <div className="schedule-sections">
            <section className="schedule-section">
              <h2>Schedule</h2>
              <div className="schedule-tabs">
                <button
                  className={activeTab === "advanced" ? "tab-active" : ""}
                  onClick={() => setActiveTab("advanced")}
                >
                  Advanced Mentor Table
                </button>
              </div>

              <AdvancedMentorTable />
            </section>
            <section className="workflow-section">
              <h2>Workflow</h2>
              <MentorWorkflow />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchedulePage;
