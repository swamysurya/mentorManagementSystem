import React, { useState, useMemo } from "react";

const STATUS_OPTIONS = ["open", "in_progress", "resolved"];
const TYPE_OPTIONS = [
  { key: "content", label: "Content" },
  { key: "technical", label: "Technical" },
  { key: "general", label: "General" },
];

const getStatusDisplayName = (status) => {
  const statusMap = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
  };
  return statusMap[status] || status;
};

export default function IssuesList({ issues, onIssueClick, onStatusChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        (issue.title &&
          issue.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.description &&
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || issue.status === statusFilter;
      const matchesType = typeFilter === "all" || issue.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [issues, searchTerm, statusFilter, typeFilter]);

  return (
    <div className="issues-list-section">
      <div className="issues-list-filters">
        <input
          type="text"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="issues-list-search"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="issues-list-cards">
        {filteredIssues.length === 0 ? (
          <div className="issues-list-empty">
            No issues found matching your criteria.
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={() => onIssueClick(issue)}
              onStatusChange={onStatusChange}
              getStatusDisplayName={getStatusDisplayName}
            />
          ))
        )}
      </div>
    </div>
  );
}

function IssueCard({ issue, onClick, onStatusChange, getStatusDisplayName }) {
  return (
    <div className="issues-list-card">
      <div className="issues-list-card-header">
        <span
          className={`issues-list-status-badge issues-list-status-${issue.status.replace(
            "_",
            ""
          )}`}
        >
          {getStatusDisplayName(issue.status)}
        </span>
        <span className="issues-list-type-badge">
          {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
        </span>
      </div>
      <div className="issues-list-card-title">
        {issue.title || issue.subject}
      </div>
      {issue.pageLink && (
        <div className="issues-list-card-link">
          <a href={issue.pageLink} target="_blank" rel="noopener noreferrer">
            Page Link
          </a>
        </div>
      )}
      <div className="issues-list-card-desc">{issue.description}</div>
      {issue.media && issue.media.length > 0 && (
        <div className="issues-list-media-preview">
          {issue.media.map((file, idx) => {
            if (
              typeof file === "string" &&
              file.match(/\.(jpg|jpeg|png|gif)$/i)
            ) {
              return (
                <a
                  key={idx}
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="issues-list-media-link"
                >
                  <span role="img" aria-label="image">
                    🖼️
                  </span>{" "}
                  Image
                </a>
              );
            } else if (
              typeof file === "string" &&
              file.match(/\.(mp4|webm|ogg)$/i)
            ) {
              return (
                <a
                  key={idx}
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="issues-list-media-link"
                >
                  <span role="img" aria-label="video">
                    🎬
                  </span>{" "}
                  Video
                </a>
              );
            } else {
              return null;
            }
          })}
        </div>
      )}
      <div className="issues-list-card-actions">
        <select
          value={issue.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange(issue.id, e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
