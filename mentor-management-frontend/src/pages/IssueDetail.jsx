import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/axios";
import {
  getCategoryOptions,
  getSubjectOptions,
} from "../services/optionService";

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const [issueRes, categoriesRes, subjectsRes] = await Promise.all([
          api.get(`/api/issues/${id}`),
          getCategoryOptions(),
          getSubjectOptions(),
        ]);
        setIssue(issueRes.data);
        setCategories(categoriesRes.data || []);
        setSubjects(subjectsRes.data || []);
      } catch (err) {
        setError("Failed to fetch issue details.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const getCategoryName = (categoryId) => {
    const cat = categories.find(
      (c) => String(c.category_id) === String(categoryId)
    );
    return cat ? cat.category_name : categoryId;
  };
  const getSubjectName = (subjectId) => {
    const subj = subjects.find(
      (s) => String(s.subject_id) === String(subjectId)
    );
    return subj ? subj.subject_name : subjectId;
  };

  if (loading) {
    return <div>Loading issue details...</div>;
  }
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  if (!issue) {
    return <div>Issue not found.</div>;
  }

  // Helper to render media
  const renderMedia = (mediaArr) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
      {mediaArr.map((mediaUrl, idx) => {
        if (typeof mediaUrl === "object" && mediaUrl.media_link)
          mediaUrl = mediaUrl.media_link;
        if (mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return (
            <a
              key={idx}
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <span
                role="img"
                aria-label="image"
                style={{ fontSize: 20, marginRight: 4 }}
              >
                🖼️
              </span>{" "}
              View Image
            </a>
          );
        } else if (mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
          return (
            <a
              key={idx}
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <span
                role="img"
                aria-label="video"
                style={{ fontSize: 20, marginRight: 4 }}
              >
                🎬
              </span>{" "}
              View Video
            </a>
          );
        } else {
          return (
            <a
              key={idx}
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <span
                role="img"
                aria-label="file"
                style={{ fontSize: 20, marginRight: 4 }}
              >
                📎
              </span>{" "}
              View File
            </a>
          );
        }
      })}
    </div>
  );

  return (
    <div className="issues-container">
      <Navbar />
      <main
        className="issues-content"
        style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}
      >
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          style={{ marginBottom: 24 }}
        >
          &larr; Back
        </button>
        <h2>Issue Details</h2>
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px #0001",
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div>
            <strong>Type:</strong> {issue.type}
          </div>
          <div>
            <strong>Title:</strong> {issue.issue_title}
          </div>
          <div>
            <strong>Description:</strong> {issue.description}
          </div>
          <div>
            <strong>Status:</strong> {issue.status}
          </div>
          {issue.page_link && (
            <div>
              <strong>Page Link:</strong>{" "}
              <a
                href={issue.page_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {issue.page_link}
              </a>
            </div>
          )}
          {issue.category_id && (
            <div>
              <strong>Category:</strong> {getCategoryName(issue.category_id)}
            </div>
          )}
          {issue.subject_id && (
            <div>
              <strong>Subject:</strong> {getSubjectName(issue.subject_id)}
            </div>
          )}
          {issue.student_id && (
            <div>
              <strong>Student ID:</strong> {issue.student_id}
            </div>
          )}
          {issue.student_name && (
            <div>
              <strong>Student Name:</strong> {issue.student_name}
            </div>
          )}
          {issue.media && issue.media.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong>Media:</strong>
              {renderMedia(issue.media)}
            </div>
          )}
        </div>
        {/* Chat Interface Placeholder */}
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px #0001",
            padding: 24,
          }}
        >
          <h3>Chat with Resolver</h3>
          <div style={{ color: "#888", fontStyle: "italic" }}>
            (Chat functionality coming soon...)
          </div>
        </div>
      </main>
    </div>
  );
}
