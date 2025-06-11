import '../../assets/styles/dashboard-card.css';

const DashboardCard = ({ title, icon, onClick }) => {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{title}</h3>
    </div>
  );
};

export default DashboardCard;