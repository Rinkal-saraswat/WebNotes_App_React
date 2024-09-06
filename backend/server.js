const express = require('express');
require('dotenv').config();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection and i use xampp server for mysql database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Routes
app.get('/api/notes', (req, res) => {
    const sql = 'SELECT * FROM notes';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    const sql = 'INSERT INTO notes (title, content) VALUES (?, ?)';
    db.query(sql, [title, content], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ id: result.insertId, title, content });
    });
});

app.put('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const sql = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
    db.query(sql, [title, content, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ id, title, content });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM notes WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: 'Note deleted successfully!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
