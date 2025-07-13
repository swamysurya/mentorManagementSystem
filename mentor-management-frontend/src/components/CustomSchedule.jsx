import React, { useState, useEffect } from "react";

const mentors = [
  { id: "m1", name: "Madhavi" },
  { id: "m2", name: "Sai Krishna" },
  { id: "m3", name: "Radhika" },
  { id: "m4", name: "Manikanta" },
  { id: "m5", name: "Kushal" },
  { id: "m6", name: "Sudheer" },
  { id: "m7", name: "Durga" },
  { id: "m8", name: "Syamala" },
  { id: "m9", name: "Veda" },
  { id: "m10", name: "Swarnjali" },
  { id: "m11", name: "Saketh" },
  { id: "m12", name: "Charan" },
  { id: "m13", name: "Yashoda" },
  { id: "m14", name: "Siddanth" },
  { id: "m15", name: "Sravani" },
  { id: "m16", name: "Lekhya" },
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

const emptyCell = { name: "", subject: "", topic: "" };
const initialGrid = () => {
  const saved = localStorage.getItem("custom-schedule-grid");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === sections.length)
        return parsed;
    } catch {}
  }
  return sections.map(() => timeSlots.map(() => ({ ...emptyCell })));
};

const CustomSchedule = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [editing, setEditing] = useState({ row: null, col: null });
  const [editValue, setEditValue] = useState(emptyCell);
  const [nameSuggestions, setNameSuggestions] = useState([]);

  // Track focus for cell editor
  let blurTimeout = null;
  const handleEditorBlur = () => {
    blurTimeout = setTimeout(() => {
      handleInputBlur();
    }, 100);
  };
  const handleEditorFocus = () => {
    if (blurTimeout) clearTimeout(blurTimeout);
  };

  useEffect(() => {
    localStorage.setItem("custom-schedule-grid", JSON.stringify(grid));
  }, [grid]);

  const handleCellClick = (rowIdx, colIdx) => {
    setEditing({ row: rowIdx, col: colIdx });
    setEditValue(grid[rowIdx][colIdx] || emptyCell);
    setNameSuggestions([]);
  };

  const handleInputChange = (field, value) => {
    setEditValue((prev) => ({ ...prev, [field]: value }));
    if (field === "name") {
      const filtered = value
        ? mentors.filter((m) =>
            m.name.toLowerCase().includes(value.toLowerCase())
          )
        : [];
      setNameSuggestions(filtered);
    } else {
      setNameSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setEditValue((prev) => ({ ...prev, name }));
    setNameSuggestions([]);
  };

  const handleInputBlur = () => {
    if (editing.row !== null && editing.col !== null) {
      const newGrid = grid.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          rIdx === editing.row && cIdx === editing.col ? editValue : cell
        )
      );
      setGrid(newGrid);
      setEditing({ row: null, col: null });
      setEditValue(emptyCell);
      setNameSuggestions([]);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      handleInputBlur();
    } else if (e.key === "Escape") {
      setEditing({ row: null, col: null });
      setEditValue(emptyCell);
      setNameSuggestions([]);
    }
  };

  return (
    <div className="mentor-schedule-container">
      <h3 style={{ textAlign: "center", marginBottom: 16 }}>
        Customisable Schedule (Experiment)
      </h3>
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
            {sections.map((section, rowIdx) => (
              <tr key={section.id}>
                <td className="schedule-grid-td schedule-grid-td-section">
                  {section.name}
                </td>
                {timeSlots.map((slot, colIdx) => {
                  const isEditing =
                    editing.row === rowIdx && editing.col === colIdx;
                  const cell = grid[rowIdx][colIdx] || emptyCell;
                  return (
                    <td
                      key={slot.id}
                      className="schedule-grid-td"
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      style={{
                        cursor: "pointer",
                        background: isEditing ? "#e0f2fe" : undefined,
                      }}
                    >
                      {isEditing ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            position: "relative",
                          }}
                          tabIndex={-1}
                          onBlur={handleEditorBlur}
                          onFocus={handleEditorFocus}
                        >
                          <input
                            type="text"
                            value={editValue.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            onKeyDown={handleInputKeyDown}
                            placeholder="Mentor Name"
                            autoFocus
                            style={{ width: "100%", marginBottom: 2 }}
                          />
                          {nameSuggestions.length > 0 && (
                            <div
                              style={{
                                background: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                position: "absolute",
                                zIndex: 10,
                              }}
                            >
                              {nameSuggestions.map((m) => (
                                <div
                                  key={m.id}
                                  style={{
                                    padding: "2px 8px",
                                    cursor: "pointer",
                                  }}
                                  onMouseDown={() =>
                                    handleSuggestionClick(m.name)
                                  }
                                >
                                  {m.name}
                                </div>
                              ))}
                            </div>
                          )}
                          <input
                            type="text"
                            value={editValue.subject}
                            onChange={(e) =>
                              handleInputChange("subject", e.target.value)
                            }
                            onKeyDown={handleInputKeyDown}
                            placeholder="Subject"
                            style={{ width: "100%", marginBottom: 2 }}
                          />
                          <input
                            type="text"
                            value={editValue.topic}
                            onChange={(e) =>
                              handleInputChange("topic", e.target.value)
                            }
                            onKeyDown={handleInputKeyDown}
                            placeholder="Topic Name"
                            style={{ width: "100%" }}
                          />
                        </div>
                      ) : cell.name || cell.subject || cell.topic ? (
                        <span>
                          {cell.name || "-"}-{cell.subject || "-"}-
                          {cell.topic || "-"}
                        </span>
                      ) : (
                        <span style={{ color: "#bbb" }}>Click to edit</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomSchedule;
