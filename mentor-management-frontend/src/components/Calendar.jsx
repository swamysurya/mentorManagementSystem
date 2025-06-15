import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isAfter,
} from "date-fns";
import "../assets/styles/calendar.css";
import PropTypes from "prop-types";

const Calendar = ({ onDateSelect, selectedDate, feedbackDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // console.log("Feedback dates:", feedbackDates);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const hasFeedback = (date) => {
    if (!Array.isArray(feedbackDates)) {
      return false;
    }

    const dateStr = format(date, "yyyy-MM-dd");
    return feedbackDates.some((feedbackDate) => {
      const feedbackDateStr =
        typeof feedbackDate === "string"
          ? feedbackDate
          : format(new Date(feedbackDate), "yyyy-MM-dd");
      return dateStr === feedbackDateStr;
    });
  };

  // Check if date is in the future
  const isFutureDate = (date) => {
    return isAfter(date, new Date());
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="calendar-nav-button">
          &lt;
        </button>
        <h2>{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={handleNextMonth} className="calendar-nav-button">
          &gt;
        </button>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          const hasFeedbackForDay = hasFeedback(day);
          const isFuture = isFutureDate(day);

          return (
            <div
              key={day.toString()}
              className={`calendar-day ${isSelected ? "selected" : ""} ${
                isCurrentDay ? "today" : ""
              } ${hasFeedbackForDay ? "has-feedback" : ""} ${
                isFuture ? "future-date" : ""
              }`}
              onClick={() => !isFuture && onDateSelect(day)}
            >
              <span className="day-number">{format(day, "d")}</span>
              {hasFeedbackForDay && <span className="feedback-tick">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Calendar.propTypes = {
  onDateSelect: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  feedbackDates: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  ),
};

export default Calendar;
