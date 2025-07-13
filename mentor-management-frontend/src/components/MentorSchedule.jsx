import React, { useEffect, useState } from "react";
import "../assets/styles/mentor-schedule.css";

// Mock Data
const mentors = [
  { id: "m1", name: "Madhavi", isPresent: true },
  { id: "m2", name: "Sai Krishna", isPresent: true },
  { id: "m3", name: "Radhika", isPresent: true },
  { id: "m4", name: "Manikanta", isPresent: true },
  { id: "m5", name: "Kushal", isPresent: true },
  { id: "m6", name: "Sudheer", isPresent: true },
  { id: "m7", name: "Durga", isPresent: true },
  { id: "m8", name: "Syamala", isPresent: true },
  { id: "m9", name: "Veda", isPresent: true },
  { id: "m10", name: "Swarnjali", isPresent: true },
  { id: "m11", name: "Saketh", isPresent: true },
  { id: "m12", name: "Charan", isPresent: true },
  { id: "m13", name: "Yashoda", isPresent: true },
  { id: "m14", name: "Siddanth", isPresent: true },
  { id: "m15", name: "Sravani", isPresent: true },
  { id: "m16", name: "Lekhya", isPresent: true },
];

const sections = [
  { id: "section1", name: "Section 1 (Veda)" },
  { id: "section2", name: "Section 2 (Sai Krishna)" },
  { id: "section3", name: "Section 3 (Radhika)" },
  { id: "section4", name: "Section 4 (Lekhya)" },
  { id: "section5", name: "Section 5 (Kushal)" },
  { id: "section7", name: "Section 7 (Syamala)" },
  { id: "section10", name: "Section 10 (Siddanth)" },
  { id: "section11", name: "Section 11 (Sravani)" },
  { id: "section12", name: "Section 12 (Sudheer)" },
  { id: "ib1", name: "IB 1 (Yashoda)" },
  { id: "ib2", name: "IB 2 (Madhavi)" },
  { id: "ib3", name: "IB 3 (Manikanta)" },
  { id: "ib4", name: "IB 4 (Swarnjali)" },
  { id: "ib5", name: "IB 5 (Charan)" },
];

const timeSlots = [
  {
    id: "slot1",
    time: "8:30 - 9:30",
    isLunchBreak: false,
    isPracticeSession: false,
  },
  {
    id: "slot2",
    time: "9:30 - 10:30",
    isLunchBreak: false,
    isPracticeSession: false,
  },
  {
    id: "slot3",
    time: "10:30 - 11:30",
    isLunchBreak: false,
    isPracticeSession: false,
  },
  {
    id: "slot4",
    time: "11:30 - 12:30",
    isLunchBreak: false,
    isPracticeSession: false,
  },
  {
    id: "slot5",
    time: "12:30 - 1:30",
    isLunchBreak: true,
    isPracticeSession: false,
  },
  {
    id: "slot6",
    time: "1:30 - 2:30",
    isLunchBreak: false,
    isPracticeSession: false,
  },
  {
    id: "slot7",
    time: "2:30 - 3:30",
    isLunchBreak: false,
    isPracticeSession: false,
  },
  {
    id: "slot8",
    time: "3:30 - 4:30",
    isLunchBreak: false,
    isPracticeSession: false,
  },
  {
    id: "slot9",
    time: "5:00 - 7:00",
    isLunchBreak: false,
    isPracticeSession: true,
  },
];

const getScheduleKey = (date) => `mentor-schedule-${date}`;

const getMentorColor = (id) => {
  // Generate a pastel color based on mentor id
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const h = hash % 360;
  return `hsl(${h}, 70%, 85%)`;
};

const MentorSchedule = () => {
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [assignments, setAssignments] = useState([]);
  const [mentorPresence, setMentorPresence] = useState({});
  const [toast, setToast] = useState(null);

  // Load schedule and presence
  useEffect(() => {
    const saved = localStorage.getItem(getScheduleKey(date));
    if (saved) {
      const data = JSON.parse(saved);
      setAssignments(data.assignments);
    } else {
      setAssignments(
        sections.flatMap((section) =>
          timeSlots.map((slot) => ({
            section: section.id,
            timeSlot: slot.id,
            mentorId: null,
          }))
        )
      );
    }
    // Load mentor presence
    const presence = {};
    mentors.forEach((m) => (presence[m.id] = m.isPresent));
    setMentorPresence(presence);
  }, [date]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Save schedule
  const saveSchedule = () => {
    localStorage.setItem(
      getScheduleKey(date),
      JSON.stringify({ date, assignments })
    );
    setToast({ msg: "Schedule saved!", type: "success" });
  };

  // Clear schedule
  const clearSchedule = () => {
    localStorage.removeItem(getScheduleKey(date));
    setAssignments(
      sections.flatMap((section) =>
        timeSlots.map((slot) => ({
          section: section.id,
          timeSlot: slot.id,
          mentorId: null,
        }))
      )
    );
    setToast({ msg: "Schedule cleared!", type: "info" });
  };

  // Reset assignments
  const resetSchedule = () => {
    setAssignments(assignments.map((a) => ({ ...a, mentorId: null })));
    setToast({ msg: "Schedule reset!", type: "info" });
  };

  // Assignment logic
  const handleAssignment = (sectionId, timeSlotId, mentorId) => {
    if (
      mentorId &&
      assignments.some(
        (a) =>
          a.timeSlot === timeSlotId &&
          a.mentorId === mentorId &&
          a.section !== sectionId
      )
    ) {
      setToast({
        msg: "Mentor already assigned in this time slot!",
        type: "error",
      });
      return;
    }
    setAssignments((prev) =>
      prev.map((a) =>
        a.section === sectionId && a.timeSlot === timeSlotId
          ? { ...a, mentorId }
          : a
      )
    );
  };

  // Mentor presence toggle
  const handlePresenceChange = (mentorId, isPresent) => {
    setMentorPresence((prev) => ({ ...prev, [mentorId]: isPresent }));
  };

  // Calculate mentor hours
  const mentorHours = mentors.map((m) => {
    let hours = 0;
    assignments.forEach((a) => {
      if (a.mentorId === m.id) {
        const slot = timeSlots.find((ts) => ts.id === a.timeSlot);
        if (slot)
          hours += slot.isPracticeSession ? 2 : slot.isLunchBreak ? 0 : 1;
      }
    });
    return { ...m, hours };
  });

  return (
    <div className="mentor-schedule-container">
      <div className="mentor-schedule-header">
        <label className="mentor-schedule-label">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mentor-schedule-date-input"
        />
        <div className="mentor-schedule-controls">
          <button
            onClick={saveSchedule}
            className="mentor-schedule-btn mentor-schedule-btn-save"
          >
            Save
          </button>
          <button
            onClick={clearSchedule}
            className="mentor-schedule-btn mentor-schedule-btn-clear"
          >
            Clear
          </button>
          <button
            onClick={resetSchedule}
            className="mentor-schedule-btn mentor-schedule-btn-reset"
          >
            Reset
          </button>
        </div>
      </div>
      {/* Mentor List */}
      <div className="mentor-list-section">
        <div className="mentor-list-title">Mentors</div>
        <div className="mentor-list">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="mentor-list-item mentor-color-bg"
              data-mentor-id={mentor.id}
            >
              <span
                className={`mentor-list-status ${
                  mentorPresence[mentor.id]
                    ? "mentor-list-status-present"
                    : "mentor-list-status-absent"
                }`}
              ></span>
              <span className="mentor-list-name">{mentor.name}</span>
              <input
                type="checkbox"
                checked={mentorPresence[mentor.id]}
                onChange={(e) =>
                  handlePresenceChange(mentor.id, e.target.checked)
                }
                className="mentor-list-checkbox"
                title="Toggle presence"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Schedule Grid */}
      <div className="schedule-grid-section">
        <table className="schedule-grid-table">
          <thead>
            <tr>
              <th className="schedule-grid-th">Section</th>
              {timeSlots.map((slot) => (
                <th key={slot.id} className="schedule-grid-th">
                  {slot.time}
                  {slot.isLunchBreak && (
                    <span className="schedule-grid-lunch-label"> (Lunch)</span>
                  )}
                  {slot.isPracticeSession && (
                    <span className="schedule-grid-practice-label">
                      {" "}
                      (Practice)
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id}>
                <td className="schedule-grid-td schedule-grid-td-section">
                  {section.name}
                </td>
                {timeSlots.map((slot) => {
                  const assignment = assignments.find(
                    (a) => a.section === section.id && a.timeSlot === slot.id
                  );
                  const assignedMentorIds = assignments
                    .filter((a) => a.timeSlot === slot.id && a.mentorId)
                    .map((a) => a.mentorId);
                  return (
                    <td key={slot.id} className="schedule-grid-td">
                      {slot.isLunchBreak ? (
                        <span className="schedule-grid-unavailable">-</span>
                      ) : (
                        <select
                          className="schedule-grid-select"
                          value={assignment?.mentorId || ""}
                          onChange={(e) =>
                            handleAssignment(
                              section.id,
                              slot.id,
                              e.target.value || null
                            )
                          }
                        >
                          <option value="">Unassigned</option>
                          {mentors.map((mentor) => (
                            <option
                              key={mentor.id}
                              value={mentor.id}
                              disabled={
                                assignedMentorIds.includes(mentor.id) &&
                                assignment?.mentorId !== mentor.id
                              }
                            >
                              {mentor.name}{" "}
                              {mentorPresence[mentor.id] ? "" : "(Absent)"}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mentor Hours Summary */}
      <div className="mentor-hours-summary-section">
        <div className="mentor-hours-summary-title">Mentor Hours</div>
        <div className="mentor-hours-summary-list">
          {mentorHours.map((m) => (
            <div
              key={m.id}
              className="mentor-hours-summary-item mentor-color-bg"
              data-mentor-id={m.id}
            >
              <span className="mentor-hours-summary-name">{m.name}</span>
              <span className="mentor-hours-summary-hours">{m.hours} hrs</span>
            </div>
          ))}
        </div>
      </div>
      {/* Toast Notification */}
      {toast && (
        <div className={`mentor-toast mentor-toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default MentorSchedule;
