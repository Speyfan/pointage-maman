const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// Middleware API key
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!process.env.API_KEY) return next(); // pas de clé => pas de check
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// ---- Enfants ----

app.get("/api/children", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM children ORDER BY first_name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/children error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/children", async (req, res) => {
  const { firstName, lastName, birthDate, notes, color } = req.body;
  if (!firstName) {
    return res.status(400).json({ error: "firstName obligatoire" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO children (first_name, last_name, birth_date, notes, color)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [firstName, lastName || null, birthDate || null, notes || null, color || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/children error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.patch("/api/children/:id", async (req, res) => {
  const { id } = req.params;
  const { active, firstName, lastName, birthDate, notes, color } = req.body;

  const fields = [];
  const values = [];
  let idx = 1;

  if (active !== undefined) {
    fields.push(`active = $${idx++}`);
    values.push(active);
  }
  if (firstName !== undefined) {
    fields.push(`first_name = $${idx++}`);
    values.push(firstName);
  }
  if (lastName !== undefined) {
    fields.push(`last_name = $${idx++}`);
    values.push(lastName);
  }
  if (birthDate !== undefined) {
    fields.push(`birth_date = $${idx++}`);
    values.push(birthDate);
  }
  if (notes !== undefined) {
    fields.push(`notes = $${idx++}`);
    values.push(notes);
  }
  if (color !== undefined) {
    fields.push(`color = $${idx++}`);
    values.push(color);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "Rien à mettre à jour" });
  }

  values.push(id);

  try {
    const result = await pool.query(
      `UPDATE children SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Enfant introuvable" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("PATCH /api/children/:id error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ---- Pointage ----

app.post("/api/attendance/check-in", async (req, res) => {
  const { childId, date, time } = req.body;
  if (!childId) return res.status(400).json({ error: "childId obligatoire" });

  const d = date || new Date().toISOString().slice(0, 10);
  const now = new Date();
  const t =
    time ||
    `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

  try {
    const existing = await pool.query(
      `SELECT * FROM attendance
       WHERE child_id = $1 AND date = $2 AND check_out IS NULL`,
      [childId, d]
    );
    if (existing.rows.length > 0) {
      return res.status(200).json(existing.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO attendance (child_id, date, check_in)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [childId, d, t]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/attendance/check-in error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/attendance/check-out", async (req, res) => {
  const { childId, date, time } = req.body;
  if (!childId) return res.status(400).json({ error: "childId obligatoire" });

  const d = date || new Date().toISOString().slice(0, 10);
  const now = new Date();
  const t =
    time ||
    `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

  try {
    const open = await pool.query(
      `SELECT * FROM attendance
       WHERE child_id = $1 AND date = $2 AND check_out IS NULL
       ORDER BY check_in DESC
       LIMIT 1`,
      [childId, d]
    );
    if (open.rows.length === 0) {
      return res.status(404).json({ error: "Aucune présence ouverte" });
    }
    const id = open.rows[0].id;
    const result = await pool.query(
      `UPDATE attendance
       SET check_out = $1
       WHERE id = $2
       RETURNING *`,
      [t, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/attendance/check-out error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/api/attendance", async (req, res) => {
  const { childId, start, end } = req.query;
  if (!childId || !start || !end) {
    return res
      .status(400)
      .json({ error: "childId, start et end sont obligatoires" });
  }
  try {
    const result = await pool.query(
      `SELECT * FROM attendance
       WHERE child_id = $1 AND date BETWEEN $2 AND $3
       ORDER BY date ASC, check_in ASC`,
      [childId, start, end]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/attendance error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/children/:id
app.delete("/api/children/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM children WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Enfant introuvable" });
    }
    // 204 No Content : suppression ok, pas de body
    return res.status(204).send();
  } catch (err) {
    console.error("DELETE /api/children/:id error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


app.listen(port, () => {
  console.log(`API pointage en écoute sur le port ${port}`);
});
