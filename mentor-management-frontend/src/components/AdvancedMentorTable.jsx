import { useEffect, useState } from "react";
import "../assets/styles/advanced-mentor-table.css";

const SHEET_ID = "1mYxvdJm6ocCCjMW7_sXHutArpWSqd_WkblMAJ5Uc2zM"; // <-- Replace with your actual Sheet ID
const API_KEY = "AIzaSyD9HoKwiD-PwEHuCxpI-Z8_HE3dAw1vG7A"; // <-- Replace with your actual API Key
const RANGE = "Sheet1"; // or e.g. "Sheet1!A1:H10"

const SHEET_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

const AdvancedMentorTable = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(SHEET_API_URL);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      if (!json.values || json.values.length < 2)
        throw new Error("No data found");
      const [headers, ...rows] = json.values;
      const parsed = rows.map((row) =>
        Object.fromEntries(headers.map((header, i) => [header, row[i] || ""]))
      );
      setScheduleData(parsed);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Failed to fetch schedule data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
    const interval = setInterval(() => {
      fetchScheduleData();
    }, 5000); // 5 seconds
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const getTimeSlots = () => {
    if (scheduleData.length === 0) return [];
    const firstRow = scheduleData[0];
    return Object.keys(firstRow).filter((key) => key !== "Section");
  };

  const isLunchBreak = (content) => {
    return content.toLowerCase().includes("lunch break");
  };

  const parseMentorSession = (content) => {
    if (isLunchBreak(content)) {
      return { mentor: "", session: "Lunch Break", isLunch: true };
    }
    const parts = content.split(" – ");
    if (parts.length >= 2) {
      return {
        mentor: parts[0].trim(),
        session: parts.slice(1).join(" – ").trim(),
        isLunch: false,
      };
    }
    return { mentor: "", session: content.trim(), isLunch: false };
  };

  const getMentorColor = (mentor) => {
    const colors = [
      "mentor-blue",
      "mentor-green",
      "mentor-purple",
      "mentor-orange",
      "mentor-pink",
      "mentor-indigo",
      "mentor-teal",
      "mentor-red",
    ];
    let hash = 0;
    for (let i = 0; i < mentor.length; i++) {
      hash = mentor.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getMentorSessionCounts = () => {
    const mentorCounts = {};

    scheduleData.forEach((row) => {
      Object.entries(row).forEach(([timeSlot, content]) => {
        if (timeSlot !== "Section" && content) {
          const { mentor } = parseMentorSession(content);
          if (mentor) {
            mentorCounts[mentor] = (mentorCounts[mentor] || 0) + 1;
          }
        }
      });
    });

    return mentorCounts;
  };

  const mentorSessionCounts = getMentorSessionCounts();
  const specifiedMentors = ["Kushal", "Karna", "Dharma", "Priya"];
  const mentors = specifiedMentors.filter(
    (mentor) => mentorSessionCounts[mentor] !== undefined
  );

  if (loading && scheduleData.length === 0) {
    return (
      <div className="amt-card amt-w-full">
        <div className="amt-card-header">
          <div className="amt-card-title amt-flex amt-items-center amt-gap-2">
            <span className="amt-spinner" />
            Loading Schedule...
          </div>
        </div>
        <div className="amt-card-content">
          <div className="amt-animate-pulse amt-space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="amt-h-12 amt-bg-gray amt-rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="amt-card amt-w-full">
        <div className="amt-card-header">
          <div className="amt-card-title amt-text-red">
            Error Loading Schedule
          </div>
        </div>
        <div className="amt-card-content">
          <p className="amt-text-red amt-mb-4">{error}</p>
          <button
            onClick={fetchScheduleData}
            className="amt-btn amt-flex amt-items-center amt-gap-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const timeSlots = getTimeSlots();

  return (
    <div className="amt-w-full amt-space-y-4">
      <div className="amt-card">
        <div className="amt-card-header">
          <div className="amt-flex amt-flex-col amt-sm-flex-row amt-sm-items-center amt-sm-justify-between amt-gap-4">
            <div className="amt-card-title amt-flex amt-items-center amt-gap-2">
              Mentor Schedule
            </div>
            <div className="amt-flex amt-items-center amt-gap-4">
              <div className="amt-flex amt-items-center amt-gap-2 amt-text-sm amt-text-gray">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <div className="amt-flex amt-items-center amt-gap-2 amt-text-sm amt-text-gray">
                Current time: {currentTime.toLocaleTimeString()}
              </div>
              <button
                onClick={fetchScheduleData}
                disabled={loading}
                className="amt-btn amt-btn-outline amt-btn-sm amt-flex amt-items-center amt-gap-2"
              >
                {loading ? (
                  <>
                    <span className="amt-spinner amt-spinner-sm" />
                    Refreshing...
                  </>
                ) : (
                  "Refresh"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="amt-card-content">
          <div className="amt-overflow-x-auto">
            <div className="amt-min-w-800">
              {/* Header Row */}
              <div className="amt-grid amt-grid-cols amt-gap-2 amt-mb-4">
                <div className="amt-header-cell">Section</div>
                {timeSlots.map((timeSlot, index) => (
                  <div
                    key={index}
                    className={`amt-header-cell amt-text-sm ${
                      timeSlot === "12:30–1:30"
                        ? "amt-bg-orange amt-text-orange"
                        : "amt-bg-gray amt-text-gray"
                    }`}
                  >
                    {timeSlot}
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {scheduleData.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="amt-grid amt-grid-cols amt-gap-2 amt-mb-2"
                >
                  <div className="amt-section-cell">{row.Section}</div>
                  {timeSlots.map((timeSlot, colIndex) => {
                    const content = row[timeSlot] || "";
                    const { mentor, session, isLunch } =
                      parseMentorSession(content);
                    return (
                      <div
                        key={colIndex}
                        className={`amt-cell amt-flex amt-flex-col amt-justify-center amt-items-center amt-text-center ${
                          isLunch
                            ? "amt-bg-lunch amt-text-lunch"
                            : "amt-bg-white amt-border amt-hover-shadow amt-transition"
                        }`}
                      >
                        {isLunch ? (
                          <div className="amt-font-medium amt-text-lunch">
                            🍽️ Lunch Break
                          </div>
                        ) : (
                          <div className="amt-space-y-2">
                            {mentor && (
                              <span
                                className={`amt-badge ${getMentorColor(
                                  mentor
                                )}`}
                              >
                                {mentor}
                              </span>
                            )}
                            <div className="amt-session-text">{session}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {/* Mobile Instructions */}
          <div className="amt-mobile-instructions">
            <p>
              📱 <strong>Mobile users:</strong> Scroll horizontally to view all
              time slots. The table auto-refreshes every 5 seconds to show the
              latest updates.
            </p>
          </div>
        </div>
      </div>
      <div className="amt-card">
        <div className="amt-card-header">
          <div className="amt-card-title">Mentor Session Summary</div>
        </div>
        <div className="amt-card-content">
          <div className="amt-overflow-x-auto">
            <table className="amt-w-full amt-border-collapse">
              <thead>
                <tr className="amt-bg-gray-100">
                  <th className="amt-px-4 amt-py-3 amt-text-center amt-text-sm amt-font-medium amt-text-gray-600 amt-uppercase amt-tracking-wider">
                    Mentor
                  </th>
                  <th className="amt-px-4 amt-py-3 amt-text-center amt-text-sm amt-font-medium amt-text-gray-600 amt-uppercase amt-tracking-wider">
                    Sessions
                  </th>
                </tr>
              </thead>
              <tbody className="amt-bg-white amt-divide-y amt-divide-gray-200">
                {mentors.map((mentor) => (
                  <tr key={mentor} className="amt-hover:bg-gray-50">
                    <td className="amt-px-4 amt-py-3 amt-whitespace-nowrap amt-text-sm amt-font-medium amt-text-gray-900 amt-align-middle">
                      {mentor}
                    </td>
                    <td className="amt-px-4 amt-py-3 amt-whitespace-nowrap amt-text-right amt-text-sm amt-font-semibold amt-text-gray-900 amt-align-middle">
                      {mentorSessionCounts[mentor]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMentorTable;
