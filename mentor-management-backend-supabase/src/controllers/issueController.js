import * as IssueModel from "../models/issueModel.js";
import * as MediaModel from "../models/issueMediaModel.js";

// console.log(IssueModel);

export const createIssue = async (req, res) => {
  try {
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
      media,
    } = req.body;
    const issueData = {
      type,
      issue_title,
      description,
      status,
      page_link: page_link || null,
      category_id: category_id ? Number(category_id) : null,
      subject_id: subject_id ? Number(subject_id) : null,
      student_id: student_id || null,
      student_name: student_name || null,
      reported_by: req.user.userId,
    };
    const newIssue = await IssueModel.createIssue(issueData);
    // console.log("new issue", newIssue);
    // console.log("media", media);
    if (media && Array.isArray(media) && media.length > 0) {
      await MediaModel.addMediaLinks(newIssue.id, media);
    }
    const issueWithMedia = await MediaModel.getMediaByIssueId(newIssue.id);
    res.status(201).json(issueWithMedia);
  } catch (err) {
    res.status(500).json({ error: "Failed to create issue" });
  }
};

export const getAllIssues = async (req, res) => {
  // console.log("inside controller");
  try {
    const issues = await IssueModel.getIssues();
    // console.log(issues);
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch issues" });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const issue = await IssueModel.getIssueById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch issue" });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    // console.log("inside update issue status", status);
    const updated = await IssueModel.updateIssueStatus(req.params.id, status);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMediaToIssue = async (req, res) => {
  try {
    const { media } = req.body;
    const { id } = req.params;
    if (!media || !Array.isArray(media) || media.length === 0) {
      return res.status(400).json({ error: "No media provided" });
    }
    await MediaModel.addMediaLinks(id, media);
    const issueWithMedia = await MediaModel.getMediaByIssueId(id);
    res.json(issueWithMedia);
  } catch (err) {
    res.status(500).json({ error: "Failed to add media" });
  }
};
