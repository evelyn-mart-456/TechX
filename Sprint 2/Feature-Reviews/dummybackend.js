const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const dbConfig = require('./dbConfig');
const fs = require('fs');
const session = require('express-session');


//load sql files
const PostReviewSQL = fs.readFileSync(path.join(__dirname, 'sql', 'post_review.sql'), 'utf8');
const GetReviewSQL = fs.readFileSync(path.join(__dirname, 'sql', 'get_reviews.sql'), 'utf8');
const app = express()
const port = 3000;

app.get('/Review', (req, res) => {
    res.sendFile(path.join(__dirname, 'Review.html'));
});
app.post('/submit_review', (req, res) => {
const reviewID= crypto.randomUUID();
const prod=req.body.product_name;
const review=req.body.review_text;
const rating=req.body.rating;
}
db.query(PostReviewSQL, [reviewID, prod, review, rating], (err, res, req) => {
    if(!req.session.UserID) {
        return res.status(401).send('log in to submit review');
    }
    if (err) {
        console.error(err);
       return res.status(500).send('server error');
    }  
    res.status(200).send('Review submitted successfully');
    }
});