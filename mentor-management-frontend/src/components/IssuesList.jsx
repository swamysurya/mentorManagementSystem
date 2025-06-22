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
    <div className="issues-list-card" onClick={onClick}>
      <div className="issues-list-card-header">
        <span
          className={`issues-list-status-badge issues-list-status-${issue.status?.replace(
            "_",
            ""
          )}`}
        >
          {getStatusDisplayName(issue.status)}
        </span>
        <span className="issues-list-type-badge">
          {issue.type?.charAt(0).toUpperCase() + issue.type?.slice(1)}
        </span>
      </div>
      <div className="issues-list-card-title">{issue.issue_title}</div>
      <div className="issues-list-card-desc">{issue.description}</div>

      {/* Content Issue Fields */}
      {issue.type === "content" && (
        <>
          {issue.page_link && (
            <div className="issues-list-card-link">
              <a
                href={issue.page_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span role="img" aria-label="link">
                  🔗
                </span>{" "}
                Page Link
              </a>
            </div>
          )}
        </>
      )}

      {/* General Issue Fields */}
      {issue.type === "general" && (
        <>
          <div>
            <strong>Student ID:</strong> {issue.student_id}
          </div>
          <div>
            <strong>Student Name:</strong> {issue.student_name}
          </div>
        </>
      )}

      {/* Media */}
      {issue.media &&
        issue.media.length > 0 &&
        (() => {
          // Separate images and videos
          const images = issue.media.filter((mediaUrl) => {
            if (typeof mediaUrl === "object" && mediaUrl.media_link)
              mediaUrl = mediaUrl.media_link;
            return mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i);
          });
          const videos = issue.media.filter((mediaUrl) => {
            if (typeof mediaUrl === "object" && mediaUrl.media_link)
              mediaUrl = mediaUrl.media_link;
            return mediaUrl.match(/\.(mp4|webm|ogg)$/i);
          });
          const files = issue.media.filter((mediaUrl) => {
            if (typeof mediaUrl === "object" && mediaUrl.media_link)
              mediaUrl = mediaUrl.media_link;
            return !mediaUrl.match(/\.(jpg|jpeg|png|gif|mp4|webm|ogg)$/i);
          });

          return (
            <div
              className="issue-media-row"
              style={{ display: "flex", gap: 24 }}
            >
              {/* Images Column */}
              {images.length > 0 && (
                <div className="media-col">
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                    Images
                  </div>
                  {images.map((mediaUrl, idx) => {
                    if (typeof mediaUrl === "object" && mediaUrl.media_link)
                      mediaUrl = mediaUrl.media_link;
                    return (
                      <div key={idx} style={{ marginBottom: 4 }}>
                        <a
                          href={mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="media-link"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            role="img"
                            aria-label="image"
                            style={{ fontSize: 20, marginRight: 4 }}
                          >
                            🖼️
                          </span>
                          View Image
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Videos Column */}
              {videos.length > 0 && (
                <div className="media-col">
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                    Videos
                  </div>
                  {videos.map((mediaUrl, idx) => {
                    if (typeof mediaUrl === "object" && mediaUrl.media_link)
                      mediaUrl = mediaUrl.media_link;
                    return (
                      <div key={idx} style={{ marginBottom: 4 }}>
                        <a
                          href={mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="media-link"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            role="img"
                            aria-label="video"
                            style={{ fontSize: 20, marginRight: 4 }}
                          >
                            🎬
                          </span>
                          View Video
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Other Files Column (optional) */}
              {files.length > 0 && (
                <div className="media-col">
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                    Files
                  </div>
                  {files.map((mediaUrl, idx) => {
                    if (typeof mediaUrl === "object" && mediaUrl.media_link)
                      mediaUrl = mediaUrl.media_link;
                    return (
                      <div key={idx} style={{ marginBottom: 4 }}>
                        <a
                          href={mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="media-link"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            role="img"
                            aria-label="file"
                            style={{ fontSize: 20, marginRight: 4 }}
                          >
                            📎
                          </span>
                          View File
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

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
