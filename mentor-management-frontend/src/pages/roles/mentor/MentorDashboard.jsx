import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import "../../../assets/styles/mentor-dashboard.css";

const MentorDashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      id: "schedule",
      title: "Schedule",
      path: "/schedule",
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
        </svg>
      ),
    },
    {
      id: "doubts",
      title: "Doubts Tracker",
      path: "/doubts",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17V17.01M12 14C12 11 15 12 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "feedback",
      title: "Daily Feedback",
      path: "/feedback",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "issues",
      title: "Issues Tracker",
      path: "/issues",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect x="11" y="7" width="2" height="6" rx="1" fill="currentColor" />
          <rect x="11" y="15" width="2" height="2" rx="1" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-content">
        <div className="cards-grid">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className="dashboard-card"
              onClick={() => navigate(card.path)}
            >
              <div className="card-icon">{card.icon}</div>
              <h3 className="card-title">{card.title}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MentorDashboard;
