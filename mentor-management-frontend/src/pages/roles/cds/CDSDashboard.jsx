import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import "../../../assets/styles/cds-dashboard.css";

const CDSDashboard = () => {
  const [issuesCount, setIssuesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Simulate fetching issues count (replace with actual API call)
  useEffect(() => {
    const fetchIssuesCount = async () => {
      try {
        // Replace this with your actual API call
        // const response = await fetch('/api/issues/count');
        // const data = await response.json();
        // setIssuesCount(data.count);

        // Simulated data for now
        setTimeout(() => {
          setIssuesCount(12); // Example count
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to fetch issues count");
        setLoading(false);
        console.error("Error fetching issues count:", err);
      }
    };

    fetchIssuesCount();
  }, []);

  const dashboardCards = [
    {
      id: "all-issues",
      title: "All Issues",
      path: "/all-issues",
      description: "View and manage all reported issues",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.2 12H16.209M12 12H12.009M7.8 12H7.809M16.2 16H16.209M12 16H12.009M7.8 16H7.809"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Content Developer Specialist</h1>
        <div className="cards-grid">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className="dashboard-card"
              onClick={() => navigate(card.path)}
            >
              <div className="card-icon">{card.icon}</div>
              <h3 className="card-title">{card.title}</h3>
              {card.count !== undefined && (
                <div className="card-count">
                  {typeof card.count === "string" ? (
                    <span className="error-text">{card.count}</span>
                  ) : (
                    card.count
                  )}
                </div>
              )}
              <p className="card-description">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CDSDashboard;
