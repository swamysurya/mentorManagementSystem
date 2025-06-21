import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import Navbar from "../components/Navbar";
import "../assets/styles/issues.css";
import IssuesList from "../components/IssuesList";
import api from "../utils/axios";
import { issueService } from "../services/issueService";

const ISSUE_TYPES = [
  { key: "content", label: "Content Issues" },
  { key: "technical", label: "Technical Issues" },
  { key: "general", label: "General Issues" },
];

const CONTENT_CATEGORIES = [
  "Cheatsheet",
  "Questions",
  "Video Content",
  "Classroom Quiz",
  "Daily Quiz",
  "MCQs",
];
const CONTENT_SUBJECTS = [
  "React",
  "Python",
  "SQL",
  "JavaScript",
  "Data Structures",
  "C++",
  "Java",
  "HTML/CSS",
  "Others",
];
const RESOLUTION_STATUSES = ["open", "in_progress", "resolved"];

// Add this function right after RESOLUTION_STATUSES:
const getStatusDisplayName = (status) => {
  const statusMap = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
  };
  return statusMap[status] || status;
};

// Mock past issues

const CloudinaryStatusContext = createContext(null);

function CloudinaryStatusProvider({ children }) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    api
      .get("/api/cloudinary-status")
      .then((res) => setActive(res.data.active))
      .catch(() => setActive(false));
  }, []);
  return (
    <CloudinaryStatusContext.Provider value={active}>
      {children}
    </CloudinaryStatusContext.Provider>
  );
}

function IssueTypeTabs({ selected, onSelect, onAllIssuesClick }) {
  return (
    <div className="issues-tabs-row">
      <div className="issues-tabs">
        {ISSUE_TYPES.map((tab) => (
          <button
            key={tab.key}
            className={`issues-btn issues-tab-btn${
              selected === tab.key ? " issues-tab-active" : ""
            }`}
            onClick={() => onSelect(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button
        className="issues-btn issues-btn-outline issues-states-tag"
        onClick={onAllIssuesClick}
      >
        All Issues
      </button>
    </div>
  );
}

function ContentIssueForm({ onSubmit }) {
  const [form, setForm] = useState({
    pageLink: "",
    category: "",
    subject: "",
    status: RESOLUTION_STATUSES[0],
    media: [],
  });
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.some((f) => f.size > 10 * 1024 * 1024)) {
      setError("Each file must be less than 10MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const uploadedLinks = [];
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        const res = await api.post("/api/upload-media", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data && res.data.mediaLink) {
          uploadedLinks.push(res.data.mediaLink);
        }
      }
      setForm((prev) => ({
        ...prev,
        media: [...prev.media, ...uploadedLinks],
      }));
      setMediaPreviews((prev) => [...prev, ...uploadedLinks]);
    } catch (err) {
      setError("Failed to upload media.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pageLink || !form.category || !form.subject) {
      setError("Please fill all required fields.");
      return;
    }
    onSubmit({
      id: Date.now().toString(),
      type: "content",
      title: `${form.category} Issue`,
      ...form,
      date: new Date().toISOString().slice(0, 10),
    });
    setForm({
      pageLink: "",
      category: "",
      subject: "",
      status: RESOLUTION_STATUSES[0],
      media: [],
    });
    setMediaPreviews([]);
    setError("");
  };

  return (
    <form className="issues-form" onSubmit={handleSubmit}>
      <label>Page Link*</label>
      <input
        name="pageLink"
        value={form.pageLink}
        onChange={handleChange}
        required
        type="url"
      />
      <label>Issue Category*</label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Select</option>
        {CONTENT_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <label>Subject*</label>
      <select
        name="subject"
        value={form.subject}
        onChange={handleChange}
        required
      >
        <option value="">Select</option>
        {CONTENT_SUBJECTS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <label>Resolution Status</label>
      <select name="status" value={form.status} onChange={handleChange}>
        {RESOLUTION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <CloudinaryStatusIndicator />
      <label>Attach Media (images/videos, max 10MB each)</label>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div className="issues-media-preview">
        {mediaPreviews.map((src, i) =>
          src.match(/\.(jpg|jpeg|png|gif)$/i) ? (
            <img
              key={i}
              src={src}
              alt="preview"
              className="issues-media-thumb"
            />
          ) : src.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              key={i}
              src={src}
              controls
              className="issues-list-media-video"
            />
          ) : null
        )}
      </div>
      {uploading && <div className="issues-uploading">Uploading media...</div>}
      {error && <div className="issues-error">{error}</div>}
      <button className="issues-btn" type="submit" disabled={uploading}>
        Submit
      </button>
    </form>
  );
}

function TechnicalIssueForm({ onSubmit }) {
  const [form, setForm] = useState({
    issueType: "",
    description: "",
    status: RESOLUTION_STATUSES[0],
    media: [],
  });
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.some((f) => f.size > 10 * 1024 * 1024)) {
      setError("Each file must be less than 10MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const uploadedLinks = [];
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        const res = await api.post("/api/upload-media", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data && res.data.mediaLink) {
          uploadedLinks.push(res.data.mediaLink);
        }
      }
      setForm((prev) => ({
        ...prev,
        media: [...prev.media, ...uploadedLinks],
      }));
      setMediaPreviews((prev) => [...prev, ...uploadedLinks]);
    } catch (err) {
      setError("Failed to upload media.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.issueType || !form.description) {
      setError("Please fill all required fields.");
      return;
    }
    onSubmit({
      id: Date.now().toString(),
      type: "technical",
      title: form.issueType,
      ...form,
      date: new Date().toISOString().slice(0, 10),
    });
    setForm({
      issueType: "",
      description: "",
      status: RESOLUTION_STATUSES[0],
      media: [],
    });
    setMediaPreviews([]);
    setError("");
  };

  return (
    <form className="issues-form" onSubmit={handleSubmit}>
      <label>Issue Type*</label>
      <input
        name="issueType"
        value={form.issueType}
        onChange={handleChange}
        required
      />
      <label>Issue Description*</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <label>Resolution Status</label>
      <select name="status" value={form.status} onChange={handleChange}>
        {RESOLUTION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <CloudinaryStatusIndicator />
      <label>Attach Media (optional, max 10MB each)</label>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div className="issues-media-preview">
        {mediaPreviews.map((src, i) =>
          src.match(/\.(jpg|jpeg|png|gif)$/i) ? (
            <img
              key={i}
              src={src}
              alt="preview"
              className="issues-media-thumb"
            />
          ) : src.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              key={i}
              src={src}
              controls
              className="issues-list-media-video"
            />
          ) : null
        )}
      </div>
      {uploading && <div className="issues-uploading">Uploading media...</div>}
      {error && <div className="issues-error">{error}</div>}
      <button className="issues-btn" type="submit" disabled={uploading}>
        Submit
      </button>
    </form>
  );
}

function GeneralIssueForm({ onSubmit }) {
  const [form, setForm] = useState({
    studentId: "",
    studentName: "",
    title: "",
    description: "",
    status: RESOLUTION_STATUSES[0],
    media: [],
  });
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.some((f) => f.size > 10 * 1024 * 1024)) {
      setError("Each file must be less than 10MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const uploadedLinks = [];
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        const res = await api.post("/api/upload-media", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data && res.data.mediaLink) {
          uploadedLinks.push(res.data.mediaLink);
        }
      }
      setForm((prev) => ({
        ...prev,
        media: [...prev.media, ...uploadedLinks],
      }));
      setMediaPreviews((prev) => [...prev, ...uploadedLinks]);
    } catch (err) {
      setError("Failed to upload media.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.studentId ||
      !form.studentName ||
      !form.title ||
      !form.description
    ) {
      setError("Please fill all required fields.");
      return;
    }
    onSubmit({
      id: Date.now().toString(),
      type: "general",
      ...form,
      date: new Date().toISOString().slice(0, 10),
    });
    setForm({
      studentId: "",
      studentName: "",
      title: "",
      description: "",
      status: RESOLUTION_STATUSES[0],
      media: [],
    });
    setMediaPreviews([]);
    setError("");
  };

  return (
    <form className="issues-form" onSubmit={handleSubmit}>
      <label>Student ID*</label>
      <input
        name="studentId"
        value={form.studentId}
        onChange={handleChange}
        required
      />
      <label>Student Name*</label>
      <input
        name="studentName"
        value={form.studentName}
        onChange={handleChange}
        required
      />
      <label>Issue Title*</label>
      <input name="title" value={form.title} onChange={handleChange} required />
      <label>Issue Description*</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <label>Resolution Status</label>
      <select name="status" value={form.status} onChange={handleChange}>
        {RESOLUTION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <CloudinaryStatusIndicator />
      <label>Attach Media (optional, max 10MB each)</label>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div className="issues-media-preview">
        {mediaPreviews.map((src, i) =>
          src.match(/\.(jpg|jpeg|png|gif)$/i) ? (
            <img
              key={i}
              src={src}
              alt="preview"
              className="issues-media-thumb"
            />
          ) : src.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              key={i}
              src={src}
              controls
              className="issues-list-media-video"
            />
          ) : null
        )}
      </div>
      {uploading && <div className="issues-uploading">Uploading media...</div>}
      {error && <div className="issues-error">{error}</div>}
      <button className="issues-btn" type="submit" disabled={uploading}>
        Submit
      </button>
    </form>
  );
}

function IssuesStats({ issues, statuses }) {
  // Count issues by status
  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = issues.filter((i) => i.status === status).length;
    return acc;
  }, {});
  return (
    <div className="issues-status-summary" style={{ marginBottom: "2rem" }}>
      {statuses.map((status) => (
        <div key={status} className="issues-status-count">
          <span className="issues-status-label">{status}:</span>{" "}
          {statusCounts[status]}
        </div>
      ))}
    </div>
  );
}

function CloudinaryStatusIndicator() {
  const active = useContext(CloudinaryStatusContext);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: active === null ? "#ccc" : active ? "#22c55e" : "#ef4444",
          display: "inline-block",
        }}
      />
      <span>
        Cloudinary:{" "}
        {active === null ? "Checking..." : active ? "Active" : "Not Configured"}
      </span>
    </div>
  );
}

export default function IssuesPage() {
  const [tab, setTab] = useState("content");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllIssuesView, setShowAllIssuesView] = useState(false);
  const allIssuesRef = useRef(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await issueService.getAllIssues();
      setIssues(data);
    } catch (err) {
      setError("Failed to fetch issues");
      console.error("Error fetching issues:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIssue = async (issueData) => {
    try {
      // Transform the form data to match backend schema
      const backendData = {
        type: issueData.type,
        title: issueData.title,
        description: issueData.description || `${issueData.type} issue`,
        status: "open",
        page_link: issueData.pageLink,
        category: issueData.category || issueData.issueType || "general",
        subject: issueData.subject || "General",
        issue_type: issueData.issueType || "general",
        student_id: issueData.studentId || "",
        student_name: issueData.studentName || "",
        media: issueData.media || [],
      };

      const newIssue = await issueService.createIssue(backendData);
      setIssues((prev) => [newIssue, ...prev]);

      // Show success message or toast
      console.log("Issue created successfully:", newIssue);
    } catch (err) {
      console.error("Error creating issue:", err);
      // Show error message to user
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updatedIssue = await issueService.updateIssueStatus(id, status);
      setIssues((prev) =>
        prev.map((issue) => (issue.id === id ? updatedIssue : issue))
      );
    } catch (err) {
      console.error("Error updating issue status:", err);
      // Show error message to user
    }
  };

  const handleRowClick = (issue) => {
    // No action for now; chat functionality will be implemented later
  };

  const handleAllIssuesClick = () => {
    setShowAllIssuesView(true);
  };

  const handleCloseAllIssuesView = () => {
    setShowAllIssuesView(false);
  };

  if (showAllIssuesView) {
    return (
      <div className="issues-container">
        <Navbar />
        <main className="issues-content">
          <button
            className="issues-btn issues-btn-outline"
            style={{ marginBottom: 24 }}
            onClick={handleCloseAllIssuesView}
          >
            &larr; Back
          </button>
          <h2 style={{ marginBottom: 16 }}>All Issues Overview</h2>
          <IssuesStats issues={issues} statuses={RESOLUTION_STATUSES} />
          <IssuesList
            issues={issues}
            onIssueClick={handleRowClick}
            onStatusChange={handleStatusChange}
          />
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="issues-container">
        <Navbar />
        <div className="issues-content">
          <div>Loading issues...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="issues-container">
        <Navbar />
        <div className="issues-content">
          <div>Error: {error}</div>
          <button onClick={fetchIssues}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <CloudinaryStatusProvider>
      <div className="issues-container">
        <Navbar />
        <main className="issues-content">
          <button onClick={() => window.history.back()} className="back-button">
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
          <div className="issues-header">
            <h2>Report an Issue</h2>
            <p className="issues-desc">
              Select the type of issue you'd like to report and fill out the
              form below.
            </p>
          </div>
          <IssueTypeTabs
            selected={tab}
            onSelect={setTab}
            onAllIssuesClick={handleAllIssuesClick}
          />
          {tab === "content" && <ContentIssueForm onSubmit={handleAddIssue} />}
          {tab === "technical" && (
            <TechnicalIssueForm onSubmit={handleAddIssue} />
          )}
          {tab === "general" && <GeneralIssueForm onSubmit={handleAddIssue} />}
          <div className="issues-past-section" ref={allIssuesRef}>
            <h3>All Reported Issues</h3>
            <IssuesList
              issues={issues}
              onIssueClick={handleRowClick}
              onStatusChange={handleStatusChange}
            />
          </div>
        </main>
      </div>
    </CloudinaryStatusProvider>
  );
}
