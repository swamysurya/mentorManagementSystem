import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/DoubtsPage.css";
import { FiTrash } from "react-icons/fi";
import "../assets/styles/doubts.css";
import Navbar from "../components/Navbar";
import api from "../utils/axios";

const RESOLUTION_OPTIONS = ["Resolved", "In Progress", "Unresolved"];

const getToday = () => new Date().toISOString().split("T")[0];

const initialForm = {
  date: getToday(),
  section_id: "",
  description: "",
  subject_id: "",
  resolution: RESOLUTION_OPTIONS[2], // Default to Unresolved
};

const DoubtsPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [doubts, setDoubts] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sections and subjects on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const [sectionsResponse, subjectsResponse] = await Promise.all([
          api.get("/options/sections"),
          api.get("/options/subjects"),
        ]);

        setSections(sectionsResponse.data.data);
        setSubjects(subjectsResponse.data.data);

        // Set initial form values if options are available
        if (
          sectionsResponse.data.data.length > 0 &&
          subjectsResponse.data.data.length > 0
        ) {
          setForm((prev) => ({
            ...prev,
            section_id: sectionsResponse.data.data[0].section_id,
            subject_id: subjectsResponse.data.data[0].subject_id,
          }));
        }
      } catch (err) {
        setError("Failed to load options. Please try again later.");
        console.error("Error fetching options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // Fetch doubts on component mount
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const response = await api.get("/doubts");
        setDoubts(response.data.data);
      } catch (err) {
        console.error("Error fetching doubts:", err);
        setError("Failed to load doubts. Please try again later.");
      }
    };

    fetchDoubts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      section_id: sections[0]?.section_id || "",
      subject_id: subjects[0]?.subject_id || "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.description || form.description.trim().length === 0) {
      alert("Please enter a valid doubt description.");
      return;
    }

    try {
      const response = await api.post("/doubts", {
        description: form.description,
        section_id: parseInt(form.section_id), // Ensure it's a number
        subject_id: parseInt(form.subject_id), // Ensure it's a number
        resolution_status: form.resolution,
        date: form.date,
      });
      // console.log("doubts response", response);
      setDoubts((prev) => [response.data.data, ...prev]);
      resetForm();
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        requestData: form,
      });

      // Show more specific error message
      const errorMessage =
        err.response?.data?.message ||
        "Failed to save doubt. Please try again.";
      alert(errorMessage);
    }
  };

  const handleDelete = async (doubtId) => {
    try {
      await api.delete(`/doubts/${doubtId}`);
      setDoubts((prev) => prev.filter((doubt) => doubt.doubt_id !== doubtId));
    } catch (err) {
      console.error("Error deleting doubt:", err);
      alert("Failed to delete doubt. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/mentor");
  };

  // Helper to group doubts by date
  const groupDoubtsByDate = (doubtsArr) => {
    const groups = {};
    doubtsArr.forEach((doubt) => {
      if (!groups[doubt.date]) groups[doubt.date] = [];
      groups[doubt.date].push(doubt);
    });
    // console.log(groups);
    return groups;
  };

  // Function to get section name from section_id
  const getSectionName = (sectionId) => {
    const section = sections.find((s) => s.section_id === parseInt(sectionId));
    return section ? section.section_name : "Unknown Section";
  };

  // Function to get subject name from subject_id
  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.subject_id === parseInt(subjectId));
    return subject ? subject.subject_name : "Unknown Subject";
  };

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="page-content">
          <div className="loading">Loading...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="page-content">
          <div className="error">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="doubts-container">
          <div className="page-header">
            <button onClick={handleBack} className="back-button">
              <svg
                className="back-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Dashboard
            </button>
            <h2 style={{ marginBottom: 24 }}>Doubt Entry</h2>
          </div>
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
                name="section_id"
                value={form.section_id}
                onChange={handleChange}
                required
              >
                {sections.map((section) => (
                  <option key={section.section_id} value={section.section_id}>
                    {section.section_name}
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
                name="subject_id"
                value={form.subject_id}
                onChange={handleChange}
                required
              >
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.subject_name}
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
            <div className="doubts-table-wrapper">
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
                <tbody>
                  {doubts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="doubts-table-empty">
                        No doubts saved yet.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(groupDoubtsByDate(doubts))
                      .sort(
                        ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
                      )
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
                            <tr key={row.doubt_id}>
                              <td>{row.date}</td>
                              <td>{getSectionName(row.section_id)}</td>
                              <td>{row.description}</td>
                              <td>{getSubjectName(row.subject_id)}</td>
                              <td>{row.resolution_status}</td>
                              <td>
                                <button
                                  className="delete-btn"
                                  title="Delete"
                                  onClick={() => handleDelete(row.doubt_id)}
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
      </main>
    </div>
  );
};

export default DoubtsPage;
