import { useState, useEffect } from 'react';
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

export default ToastContainer;