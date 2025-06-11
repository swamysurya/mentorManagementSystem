import React, { useState, useEffect } from "react";
import "./DoubtsPage.css";
import { FiTrash } from "react-icons/fi";

const SECTION_OPTIONS = Array.from({ length: 15 }, (_, i) => `Section ${i + 1}`);
const SUBJECT_OPTIONS = [
  "C++",
  "DSA",
  "Python",
  "HTML/CSS",
  "JS",
  "ReactJS",
  "NodeJs",
];
const RESOLUTION_OPTIONS = ["Resolved", "In Progress", "Unresolved"];

const getToday = () => new Date().toISOString().split("T")[0];

const initialForm = {
  date: getToday(),
  section: SECTION_OPTIONS[0],
  description: "",
  subject: SUBJECT_OPTIONS[0],
  resolution: RESOLUTION_OPTIONS[2], // Default to Unresolved
};

const DoubtsPage = () => {
  const [form, setForm] = useState(initialForm);
  const [doubts, setDoubts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("doubtsData");
    if (stored) setDoubts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("doubtsData", JSON.stringify(doubts));
  }, [doubts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.description || form.description.trim().length === 0) {
      alert("Please enter a valid doubt description.");
      return;
    }
    setDoubts((prev) => [form, ...prev]);
    setForm(initialForm);
  };

  const handleDelete = (idx) => {
    setDoubts((prev) => prev.filter((_, i) => i !== idx));
  };

  // Helper to group doubts by date
  const groupDoubtsByDate = (doubtsArr) => {
    const groups = {};
    doubtsArr.forEach((doubt, idx) => {
      if (!groups[doubt.date]) groups[doubt.date] = [];
      groups[doubt.date].push({ ...doubt, _idx: idx }); // Keep original index for deletion
    });
    return groups;
  };

  return (
    <div className="doubts-container">
      <h2 style={{ marginBottom: 24 }}>Doubt Entry</h2>
      <form onSubmit={handleSave} className="doubts-form">
        <div className="doubts-form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            max={getToday()}
            required
          />
        </div>
        <div className="doubts-form-group">
          <label>Section</label>
          <select
            name="section"
            value={form.section}
            onChange={handleChange}
            required
          >
            {SECTION_OPTIONS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>
        <div className="doubts-form-group description-group">
          <label>Doubt Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter doubt description"
            required
          />
        </div>
        <div className="doubts-form-group">
          <label>Subject</label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
          >
            {SUBJECT_OPTIONS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
        <div className="doubts-form-group">
          <label>Resolution</label>
          <select
            name="resolution"
            value={form.resolution}
            onChange={handleChange}
            required
          >
            {RESOLUTION_OPTIONS.map((res) => (
              <option key={res} value={res}>
                {res}
              </option>
            ))}
          </select>
        </div>
      </form>
      <button onClick={handleSave} className="doubts-save-btn">
        Save
      </button>
      <div className="doubts-table-container">
        <h3 className="doubts-table-title">Saved Doubts</h3>
        <div className="doubts-table-head-wrapper">
          <table className="doubts-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Section</th>
                <th>Description</th>
                <th>Subject</th>
                <th>Resolution</th>
                <th></th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="doubts-table-body-wrapper">
          <table className="doubts-table">
            <tbody>
              {doubts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="doubts-table-empty">
                    No doubts saved yet.
                  </td>
                </tr>
              ) : (
                Object.entries(groupDoubtsByDate(doubts))
                  .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)) // Newest date first
                  .map(([date, group]) => (
                    <React.Fragment key={date}>
                      <tr className="date-group-row">
                        <td
                          colSpan={6}
                          style={{
                            fontWeight: "bold",
                            background: "#f5f5f5",
                          }}
                        >
                          {date}
                        </td>
                      </tr>
                      {group.map((row) => (
                        <tr key={row._idx}>
                          <td>{row.date}</td>
                          <td>{row.section}</td>
                          <td>{row.description}</td>
                          <td>{row.subject}</td>
                          <td>{row.resolution}</td>
                          <td>
                            <button
                              className="delete-btn"
                              title="Delete"
                              onClick={() => handleDelete(row._idx)}
                              type="button"
                              aria-label="Delete"
                            >
                              <FiTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoubtsPage;
