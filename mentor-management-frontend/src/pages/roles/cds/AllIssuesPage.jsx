import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../../../components/common/Navbar";
import IssuesList from "../../../components/IssuesList";
import { issueService } from "../../../services/issueService";
import "../../../assets/styles/all-issues-page.css";

const AllIssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const issuesData = await issueService.getAllIssues();
        setIssues(issuesData);
      } catch (err) {
        setError("Failed to fetch issues. Please try again later.");
        console.error("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleIssueClick = (issue) => {
    // Navigate to issue detail page or open in a modal
    navigate(`/issues/${issue.id}`);
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await issueService.updateIssueStatus(issueId, newStatus);
      // Update the local state with the new status
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (err) {
      console.error("Error updating issue status:", err);
      setError("Failed to update issue status. Please try again.");
    }
  };

  return (
    <div className="all-issues-page">
      <Navbar />
      <div className="all-issues-container">
        <div className="page-header">
          <button onClick={handleGoBack} className="back-button">
            <FaArrowLeft className="back-icon" /> Back
          </button>
          <h1>All Issues</h1>
        </div>
        <main className="issues-list-container">
          {loading ? (
            <div className="loading-state">Loading issues...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : (
            <IssuesList
              issues={issues}
              onIssueClick={handleIssueClick}
              onStatusChange={handleStatusChange}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AllIssuesPage;
