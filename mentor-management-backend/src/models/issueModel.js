import db from "../config/db.js";

export const createIssue = async (issue) => {
  const {
    type,
    title,
    description,
    status,
    page_link,
    category,
    subject,
    issue_type,
    student_id,
    student_name,
    reported_by,
  } = issue;
  const result = await db.query(
    `INSERT INTO issues
      (type, title, description, status, page_link, category, subject, issue_type, student_id, student_name, reported_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      type,
      title,
      description,
      status,
      page_link,
      category,
      subject,
      issue_type,
      student_id,
      student_name,
      reported_by,
    ]
  );
  return result.rows[0];
};

export const getAllIssues = async () => {
  const result = await db.query(
    "SELECT * FROM issues ORDER BY date_submitted DESC"
  );
  return result.rows;
};

export const getIssueById = async (id) => {
  const result = await db.query("SELECT * FROM issues WHERE id = $1", [id]);
  return result.rows[0];
};

export const updateIssueStatus = async (id, status) => {
  const result = await db.query(
    "UPDATE issues SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
};
