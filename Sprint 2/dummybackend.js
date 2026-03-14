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

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false}));
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
app.post('/submit_review', (req, res) => {
    const reviewID = crypto.randomUUID();
    const prod = req.body.product_name;
    const review = req.body.review_text;
    const rating = req.body.rating;

    if (!req.session.UserID) {
        return res.status(401).send('log in to submit review');
    }

    db.query(PostReviewSQL, [reviewID, prod, review, rating], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('server error');
        }
        res.status(200).send('Review submitted successfully');
    });
});
