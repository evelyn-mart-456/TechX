const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const dbConfig = require('./dbConfig.js');
const fs = require('fs');
const session = require('express-session');


//load sql files
const PostReviewSQL = fs.readFileSync(path.join(__dirname, 'sql', 'PostReview.sql'), 'utf8');
const GetReviewSQL = fs.readFileSync(path.join(__dirname, 'sql', 'GetReview.sql'), 'utf8');
const get_user_sql = fs.readFileSync(path.join(__dirname, 'sql', 'get_user.sql'), 'utf8');
const create_user = fs.readFileSync(path.join(__dirname, 'sql', 'create_user.sql'), 'utf8');

const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'change-this-later',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));


const db = mysql.createConnection(dbConfig);

app.get('/Review', (req, res) => {
    res.sendFile(path.join(__dirname, 'Review.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT UserID FROM uaccount WHERE Username = ? AND Password = ?';

    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        if (results.length == 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        req.session.UserID = results[0].UserID;
        res.json({ success: true, message: 'Login successful' });
    });
});
//temporarily bring home to the root for testing purposes
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});
//temporarily bring login to the root for testing purposes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
//temporarily bring register to the root for testing purposes
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/signup', (req, res) => {
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
            db.query(create_user, [crypto.randomUUID(), email, username, hashedPassword], (err, results) => {
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


//get the reviews html page
app.get('/Reviews', (req, res) => {
    res.sendFile(path.join(__dirname, 'Reviews.html'));
});

app.get('/api/Reviews', (req, res) => {
    db.query(GetReviewSQL, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err.message });
        }   
        res.json({ success: true, reviews: results });
    });
});

app.post('/submit_review', (req, res) => {
    const reviewID = crypto.randomUUID();
    const prod = req.body.product_name;
    const rating = req.body.rating;
    const review = req.body.review_text;

    
  if (!req.session.UserID) {
    return res.status(401).json({ success: false, message: 'Log in to submit review' });
  }

    db.query(PostReviewSQL, [reviewID, prod, review, rating, req.session.UserID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Log in to submit review" });
        }
        res.json({ success: true, message: "Review submitted successfully" });
    });
});
app.listen(3000, () => {
    console.log("Backend running on port 3000");
});
