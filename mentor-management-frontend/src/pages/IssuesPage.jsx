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
import {
  getCategoryOptions,
  getSubjectOptions,
} from "../services/optionService";
import ContentIssueForm from "../components/ContentIssueForm";
import TechnicalIssueForm from "../components/TechnicalIssueForm";
import GeneralIssueForm from "../components/GeneralIssueForm";
import { CloudinaryStatusProvider } from "../context/CloudinaryStatusContext";
import { useNavigate } from "react-router-dom";

const ISSUE_TYPES = [
  { key: "content", label: "Content Issues" },
  { key: "technical", label: "Technical Issues" },
  { key: "general", label: "General Issues" },
];

const RESOLUTION_STATUSES = ["open", "in_progress", "resolved"];

// Mock past issues

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

export default function IssuesPage() {
  const [tab, setTab] = useState("content");
  const [issues, setIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllIssuesView, setShowAllIssuesView] = useState(false);
  const allIssuesRef = useRef(null);
  const [issueType, setIssueType] = useState("content");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [issuesRes, categoriesRes, subjectsRes] = await Promise.all([
        issueService.getAllIssues(),
        getCategoryOptions(),
        getSubjectOptions(),
      ]);
      setIssues(issuesRes);
      setCategories(categoriesRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (err) {
      setError("Failed to fetch issues or options");
      console.error("Error fetching issues/options:", err);
    } finally {
      setLoading(false);
    }
  };
  // console.log(issues);

  const handleAddIssue = async (issueData) => {
    try {
      const backendData = {
        type: null,
        issue_title: null,
        description: null,
        status: null,
        page_link: null,
        category_id: null,
        subject_id: null,
        student_id: null,
        student_name: null,
        media: [],
        ...issueData,
      };
      const newIssue = await issueService.createIssue(backendData);
      setIssues((prev) => [newIssue, ...prev]);
      console.log("Issue created successfully:", newIssue);
    } catch (err) {
      console.error("Error creating issue:", err);
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
            onIssueClick={(issue) => navigate(`/issues/${issue.id}`)}
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
          <button onClick={fetchAllData}>Retry</button>
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
          {tab === "content" && (
            <ContentIssueForm
              onSubmit={handleAddIssue}
              categories={categories}
              subjects={subjects}
            />
          )}
          {tab === "technical" && (
            <TechnicalIssueForm
              onSubmit={handleAddIssue}
              categories={categories}
              subjects={subjects}
            />
          )}
          {tab === "general" && (
            <GeneralIssueForm
              onSubmit={handleAddIssue}
              categories={categories}
              subjects={subjects}
            />
          )}
          <div className="issues-past-section" ref={allIssuesRef}>
            <h3>All Reported Issues</h3>
            <IssuesList
              issues={issues}
              onIssueClick={(issue) => navigate(`/issues/${issue.id}`)}
              onStatusChange={handleStatusChange}
            />
          </div>
        </main>
      </div>
    </CloudinaryStatusProvider>
  );
}
