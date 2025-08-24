import express from "express";
import pool from "../db.js";

const router = express.Router();

// Create tables if not exist
async function ensureSchema() {
  await pool.query(`CREATE TABLE IF NOT EXISTS polls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    expiry DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    votes INT DEFAULT 0,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
  )`);
}
ensureSchema().catch(console.error);

// Create Poll
router.post("/create", async (req, res) => {
  try {
    const { question, options, expiry } = req.body;
    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: "Question and at least 2 options are required." });
    }

    const [pollResult] = await pool.query(
      "INSERT INTO polls (question, expiry) VALUES (?, ?)",
      [question, expiry ? new Date(expiry) : null]
    );
    const pollId = pollResult.insertId;

    const inserts = options.filter(Boolean).map(opt => [pollId, String(opt).trim()]);
    if (inserts.length === 0) {
      return res.status(400).json({ error: "Options cannot be empty." });
    }
    await pool.query("INSERT INTO options (poll_id, option_text) VALUES ?", [inserts]);

    res.json({ id: pollId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create poll." });
  }
});

// Get Poll
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [[poll]] = await pool.query("SELECT * FROM polls WHERE id = ?", [id]);
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    const [options] = await pool.query("SELECT * FROM options WHERE poll_id = ? ORDER BY id", [id]);
    res.json({ poll, options });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch poll." });
  }
});

// Vote
router.post("/:id/vote", async (req, res) => {
  try {
    const { optionId } = req.body;
    if (!optionId) return res.status(400).json({ error: "optionId is required" });
    const [result] = await pool.query("UPDATE options SET votes = votes + 1 WHERE id = ?", [optionId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Option not found" });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to vote." });
  }
});

// Results
router.get("/:id/results", async (req, res) => {
  try {
    const { id } = req.params;
    const [options] = await pool.query("SELECT id, option_text, votes FROM options WHERE poll_id = ? ORDER BY id", [id]);
    res.json({ options });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch results." });
  }
});



export default router;
