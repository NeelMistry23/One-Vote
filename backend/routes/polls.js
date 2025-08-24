import express from "express";
import pool from "../db.js";

const router = express.Router();

// Create tables if not exist (runs once at startup)
async function ensureSchema() {
  try {
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
    
    console.log(" Database schema ensured.");
  } catch (err) {
    console.error(" Error ensuring schema:", err);
  }
}
ensureSchema();


//  Create Poll

router.post("/create", async (req, res) => {
  try {
    const { question, options, expiry } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: "Question and at least 2 options are required." });
    }

    // Insert poll
    const [pollResult] = await pool.query(
      "INSERT INTO polls (question, expiry) VALUES (?, ?)",
      [question, expiry ? new Date(expiry) : null]
    );

    const pollId = pollResult.insertId;

    // Insert options
    const inserts = options.filter(opt => opt && opt.trim()).map(opt => [pollId, opt.trim()]);
    if (inserts.length < 2) {
      return res.status(400).json({ error: "At least 2 non-empty options are required." });
    }

    await pool.query("INSERT INTO options (poll_id, option_text) VALUES ?", [inserts]);

    res.status(201).json({ id: pollId, message: "Poll created successfully" });
  } catch (err) {
    console.error(" Error creating poll:", err);
    res.status(500).json({ error: "Failed to create poll." });
  }
});


//  Get Poll

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [[poll]] = await pool.query("SELECT * FROM polls WHERE id = ?", [id]);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    const [options] = await pool.query("SELECT * FROM options WHERE poll_id = ? ORDER BY id", [id]);

    res.json({ poll, options });
  } catch (err) {
    console.error("❌ Error fetching poll:", err);
    res.status(500).json({ error: "Failed to fetch poll." });
  }
});


//  Vote

router.post("/:id/vote", async (req, res) => {
  try {
    const { optionId } = req.body;
    if (!optionId) return res.status(400).json({ error: "optionId is required" });

    const [result] = await pool.query("UPDATE options SET votes = votes + 1 WHERE id = ?", [optionId]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Option not found" });

    res.json({ success: true, message: "Vote recorded" });
  } catch (err) {
    console.error(" Error voting:", err);
    res.status(500).json({ error: "Failed to vote." });
  }
});


//  Results

router.get("/:id/results", async (req, res) => {
  try {
    const { id } = req.params;

    const [options] = await pool.query(
      "SELECT id, option_text, votes FROM options WHERE poll_id = ? ORDER BY id",
      [id]
    );

    res.json({ options });
  } catch (err) {
    console.error(" Error fetching results:", err);
    res.status(500).json({ error: "Failed to fetch results." });
  }
});

export default router;
