const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like HTML, CSS, etc.)
app.use(express.static(path.join('C:/Users/Annie/Downloads/foodie (2)/public'))); // Adjust path to your static files

// Connect to MySQL Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'annie_sql2005', // Use your MySQL password
    database: 'mydatabase'
});

// Establish the connection
db.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
        return;
    }
    console.log('Connected to MySQL');
});

// Signup route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.send('User already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
            if (err) throw err;

            res.redirect('/login.html'); // Redirect after successful signup
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.send('No user found with this email.');
        }

        const foundUser = results[0];

        // Compare password
        const validPassword = await bcrypt.compare(password, foundUser.password);
        if (validPassword) {
            res.redirect('/index.html'); // Redirect to the home page after login
        } else {
            res.send('Incorrect password.');
        }
    });
});

// Listen on port 3000
app.listen(3000, () => {
    console.log('Server started on port 3000.');
});
