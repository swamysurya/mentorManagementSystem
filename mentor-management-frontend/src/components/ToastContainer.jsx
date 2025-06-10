import PropTypes from 'prop-types';
import Toast from './Toast';
import '../assets/styles/toast.css';

const ToastContainer = ({ messages, removeMessage }) => {
  // Only show the last 3 messages
  const visibleMessages = messages.slice(-3);

  return (
    <div className="toast-container">
      {visibleMessages.map((msg, index) => (
        <Toast
          key={msg.id}
          message={msg.text}
          type={msg.type}
          onClose={() => removeMessage(msg.id)}
          index={index}
        />
      ))}
    </div>
  );
};

ToastContainer.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ).isRequired,
  removeMessage: PropTypes.func.isRequired,
};

export default ToastContainer;