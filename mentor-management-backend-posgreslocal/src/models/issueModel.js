import db from "../config/db.js";

export const createIssue = async (issue) => {
  const {
    type,
    issue_title,
    description,
    status,
    page_link,
    category_id,
    subject_id,
    student_id,
    student_name,
    reported_by,
  } = issue;
  const result = await db.query(
    `INSERT INTO issues
      (type, issue_title, description, status, page_link, category_id, subject_id, student_id, student_name, reported_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      type,
      issue_title,
      description,
      status,
      page_link,
      category_id,
      subject_id,
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

export const getAllIssuesWithMedia = async () => {
  const result = await db.query(`
    SELECT i.*, c.category_name, s.subject_name,
      COALESCE(json_agg(json_build_object('media_link', m.media_link, 'media_type', m.media_type))
        FILTER (WHERE m.id IS NOT NULL), '[]') AS media
    FROM issues i
    LEFT JOIN category_options c ON i.category_id = c.category_id
    LEFT JOIN subject_options s ON i.subject_id = s.subject_id
    LEFT JOIN issue_media m ON i.id = m.issue_id
    GROUP BY i.id, c.category_name, s.subject_name
    ORDER BY i.date_submitted DESC
  `);
  return result.rows;
};

export const getIssueByIdWithMedia = async (id) => {
  const result = await db.query(
    `
    SELECT i.*, c.category_name, s.subject_name,
      COALESCE(json_agg(json_build_object('media_link', m.media_link, 'media_type', m.media_type))
        FILTER (WHERE m.id IS NOT NULL), '[]') AS media
    FROM issues i
    LEFT JOIN category_options c ON i.category_id = c.category_id
    LEFT JOIN subject_options s ON i.subject_id = s.subject_id
    LEFT JOIN issue_media m ON i.id = m.issue_id
    WHERE i.id = $1
    GROUP BY i.id, c.category_name, s.subject_name
  `,
    [id]
  );
  return result.rows[0];
};
