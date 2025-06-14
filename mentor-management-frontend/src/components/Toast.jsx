import { useEffect } from "react";
import PropTypes from "prop-types";
import "../assets/styles/toast.css";

const Toast = ({ message, type = "error", onClose, index }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000 + index * 500); // Stagger the disappearance

    return () => clearTimeout(timer);
  }, [onClose, index]);

  return (
    <div
      className={`toast toast-${type}`}
      style={{
        zIndex: 1000 - index, // Stack notifications properly
      }}
    >
      <div className="toast-content">
        <svg
          className="toast-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 7v6M12 15v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className="toast-message">{message}</p>
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["error", "success", "info", "warning"]),
  onClose: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default Toast;
