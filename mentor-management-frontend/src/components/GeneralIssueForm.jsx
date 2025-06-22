import React, { useState } from "react";
import CloudinaryStatusIndicator from "./CloudinaryStatusIndicator";
import api from "../utils/axios";

const RESOLUTION_STATUSES = ["open", "in_progress", "resolved"];

export default function GeneralIssueForm({ onSubmit, categories, subjects }) {
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
    const backendData = {
      type: "general",
      issue_title: form.title,
      description: form.description,
      status: form.status,
      page_link: null,
      category_id: null,
      subject_id: null,
      student_id: form.studentId,
      student_name: form.studentName,
      media: form.media,
    };
    onSubmit(backendData);
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
