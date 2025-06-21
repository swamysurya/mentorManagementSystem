import db from "../config/db.js";

export const addMediaLinks = async (issueId, mediaLinks) => {
  if (!mediaLinks || mediaLinks.length === 0) return [];
  const values = mediaLinks
    .map((link, i) => `($1, $${i + 2}, $${i + 2 + mediaLinks.length})`)
    .join(",");
  const params = [issueId, ...mediaLinks, ...mediaLinks.map(getMediaType)];
  const result = await db.query(
    `INSERT INTO issue_media (issue_id, media_link, media_type) VALUES ${values} RETURNING *`,
    params
  );
  return result.rows;
};

export const getMediaByIssueId = async (issueId) => {
  const result = await db.query(
    "SELECT * FROM issue_media WHERE issue_id = $1",
    [issueId]
  );
  return result.rows;
};

function getMediaType(link) {
  if (link.match(/\.(jpg|jpeg|png|gif)$/i)) return "image";
  if (link.match(/\.(mp4|webm|ogg)$/i)) return "video";
  return "other";
}
