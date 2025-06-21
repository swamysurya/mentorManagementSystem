import * as IssueModel from "../models/issueModel.js";
import * as MediaModel from "../models/issueMediaModel.js";

export const createIssue = async (req, res) => {
  try {
    const { media, ...issueFields } = req.body;
    const reported_by = req.user.userId; // from auth middleware
    const issue = await IssueModel.createIssue({ ...issueFields, reported_by });
    if (media && media.length > 0) {
      await MediaModel.addMediaLinks(issue.id, media);
    }
    const mediaLinks = await MediaModel.getMediaByIssueId(issue.id);
    res
      .status(201)
      .json({ ...issue, media: mediaLinks.map((m) => m.media_link) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllIssues = async (req, res) => {
  try {
    const issues = await IssueModel.getAllIssues();
    const issuesWithMedia = await Promise.all(
      issues.map(async (issue) => {
        const media = await MediaModel.getMediaByIssueId(issue.id);
        return { ...issue, media: media.map((m) => m.media_link) };
      })
    );
    res.json(issuesWithMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const issue = await IssueModel.getIssueById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    const media = await MediaModel.getMediaByIssueId(issue.id);
    res.json({ ...issue, media: media.map((m) => m.media_link) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await IssueModel.updateIssueStatus(req.params.id, status);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
