import { Router } from "express";
import { Log } from "affordmed-logging-middleware";
import pool from "../config/db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { limit = 20, page = 1, notification_type } = req.query;
  try {
    await Log("backend", "info", "controller", "GET notifications");
    let query = "SELECT * FROM notifications";
    const params = [];
    if (notification_type) {
      query += " WHERE type = ?";
      params.push(notification_type);
    }
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit));
    params.push((parseInt(page) - 1) * parseInt(limit));
    const [rows] = await pool.query(query, params);
    await Log("backend", "info", "repository", "fetched " + rows.length + " rows");
    res.json({ notifications: rows });
  } catch (err) {
    await Log("backend", "error", "controller", "fetch failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { student_id, type, message } = req.body;
  try {
    await Log("backend", "info", "controller", "POST notification");
    if (!student_id || !type || !message) {
      await Log("backend", "warn", "handler", "missing fields");
      return res.status(400).json({ error: "missing fields" });
    }
    if (!["Event", "Result", "Placement"].includes(type)) {
      await Log("backend", "warn", "handler", "invalid type");
      return res.status(400).json({ error: "invalid type" });
    }
    const id = crypto.randomUUID();
    await pool.query(
      "INSERT INTO notifications (id,student_id,type,message) VALUES (?,?,?,?)",
      [id, student_id, type, message]
    );
    const [rows] = await pool.query("SELECT * FROM notifications WHERE id=?", [id]);
    await Log("backend", "info", "service", "notification created");
    res.status(201).json(rows[0]);
  } catch (err) {
    await Log("backend", "error", "service", "create failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    await Log("backend", "info", "controller", "PATCH mark read");
    const [result] = await pool.query(
      "UPDATE notifications SET is_read=TRUE WHERE id=?",
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      await Log("backend", "warn", "repository", "not found");
      return res.status(404).json({ error: "not found" });
    }
    const [rows] = await pool.query("SELECT * FROM notifications WHERE id=?", [req.params.id]);
    await Log("backend", "info", "service", "marked as read");
    res.json(rows[0]);
  } catch (err) {
    await Log("backend", "error", "service", "mark read failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;