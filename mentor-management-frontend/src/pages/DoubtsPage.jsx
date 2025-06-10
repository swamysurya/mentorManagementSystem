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
        <h3 style={{ marginBottom: 12 }}>Saved Doubts</h3>
        <table className="doubts-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Section</th>
              <th>Description</th>
              <th>Subject</th>
              <th>Resolution</th>
              <th></th> {/* For delete icon */}
            </tr>
          </thead>
          <tbody>
            {doubts.length === 0 ? (
              <tr>
                <td colSpan={6} className="doubts-table-empty">
                  No doubts saved yet.
                </td>
              </tr>
            ) : (
              doubts.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>
                  <td>{row.section}</td>
                  <td>{row.description}</td>
                  <td>{row.subject}</td>
                  <td>{row.resolution}</td>
                  <td>
                    <button
                      className="delete-btn"
                      title="Delete"
                      onClick={() => handleDelete(idx)}
                      type="button"
                      aria-label="Delete"
                    >
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoubtsPage;
