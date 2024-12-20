const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'zoo' 
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


app.get('/animals', (req, res) => {
  db.query('SELECT * FROM animals', (err, results) => {
    if (err) {
      console.error('Error fetching animals:', err);
      return res.status(500).send('Error fetching animals');
    }
    res.json(results);
  });
});

app.post('/animals', (req, res) => {
  const { name, species, age, description } = req.body;

  const query = 'INSERT INTO animals (name, species, age, description) VALUES (?, ?, ?, ?)';
  db.query(query, [name, species, age, description], (err, result) => {
    if (err) {
      console.error('Error adding animal:', err);
      return res.status(500).send('Error adding animal');
    }
    res.status(201).json({ id: result.insertId, name, species, age, description });
  });
});

app.get('/animals/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM animals WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching animal:', err);
      return res.status(500).send('Error fetching animal');
    }
    if (results.length === 0) {
      return res.status(404).send('Animal not found');
    }
    res.json(results[0]);
  });
});

    console.log(results);
    res.render('animals', { animals: results });

app.put('/animals/:id', (req, res) => {
  const { id } = req.params;
  const { name, species, age, description } = req.body;

  const query = 'UPDATE animals SET name = ?, species = ?, age = ?, description = ? WHERE id = ?';
  db.query(query, [name, species, age, description, id], (err, result) => {
    if (err) {
      console.error('Error updating animal:', err);
      return res.status(500).send('Error updating animal');
    }
    res.json({ id, name, species, age, description });
  });
});

app.delete('/animals/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM animals WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting animal:', err);
      return res.status(500).send('Error deleting animal');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Animal not found');
    }
    res.status(204).send();
  });
});

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
