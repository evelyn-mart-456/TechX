const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const dbConfig = require('./dbConfig');
const fs = require('fs');

// Loading sql files here
const register_sql = fs.readFileSync('./db/create_user.sql', 'utf8');
const get_user_sql = fs.readFileSync('./db/get_user.sql', 'utf8');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection(dbConfig);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/new-tech', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'new-tech.html'));
});

app.post('/register', (req, res) => {
    const username = req.body.username;
    const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');
    const email = req.body.email;

    db.query(get_user_sql, [username], (err, results) => {
        if(err) {
            console.error('Database error:', err);
        }

        if(results.length > 0) {
            res.json({error: "Error: username is taken."});
        } else {
            db.query(register_sql, [crypto.randomUUID(), email, username, hashedPassword], (err, results) => {
                if(err) {
                    console.error('Database error:', err);
                    return res.status(500).send('Server error');
                }
                if(results.affectedRows === 0)
                    return res.json({error: 'Username already taken'});

                res.json({success: true});
            });
        }
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

    db.query(get_user_sql, [username, hashedPassword], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        if(results.length > 0) {
            if(results[0].Password_Hash === hashedPassword && results[0].Username === username)
                res.json( {success: true} );
            else
                res.json( {error: 'Invalid password.'} );
        } else {
            res.json( {error: 'Invalid username.'} );
        }
    });
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}/`);
});
