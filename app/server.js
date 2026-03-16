const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const dbConfig = require('./dbConfig');
const fs = require('fs');
const session = require('express-session');

// Loading sql files here
const register_sql = fs.readFileSync('./db/create_user.sql', 'utf8');
const get_user_sql = fs.readFileSync('./db/get_user.sql', 'utf8');
const create_vote_sql = fs.readFileSync('./db/create_vote.sql', 'utf8');
const get_votes_sql = fs.readFileSync('./db/get_votes.sql', 'utf8');
const get_user_voted_sql = fs.readFileSync('./db/get_user_voted.sql', 'utf8');
const create_review_sql = fs.readFileSync('./db/create_review.sql', 'utf8');
const get_reviews_sql = fs.readFileSync('./db/get_reviews.sql', 'utf8');

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

app.get('/Review', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Review.html'));
});

app.get('/Reviews', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Reviews.html'));
});
//gets the reviews from the database and sends them to the frontend
app.get('/api/Reviews', (req, res) => {
    db.query(get_reviews_sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err.message });
        }   
        res.json({ success: true, reviews: results });
    });
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
            if(results[0].Password_Hash === hashedPassword && results[0].Username === username) {
                req.session.userId = results[0].UserID;
                req.session.username = results[0].Username;
                res.json( {success: true} );
            }
            else
                res.json( {error: 'Invalid password.'} );
        } else {
            res.json( {error: 'Invalid username.'} );
        }
    });
});

app.get('/voted', (req, res) => {
    const poll = req.query.PollID;

    if(req.session.userId) {
        db.query(get_user_voted_sql, [req.session.userId, poll], (err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).json({error: 'Server error'});
            }
            if(results.length > 0) {
                db.query(get_votes_sql, [poll], (err, results) => {
                    if(err) {
                        console.error(err);
                        return res.status(500).send('Server error');
                    }

                    res.json({
                        voted: true,
                        results: results
                    });
                });
            } else {
                return res.json({voted: false});
            }
        });
    } else {
        res.json({voted: false});
    }
});

app.post('/votepoll', (req, res) => {
    const poll = req.body.PollID;
    const option = req.body.OptionID;

    if(req.session.userId) {
        db.query(create_vote_sql, [poll, option, req.session.userId], (err, results) => {
            if(err) {
                if(err.code === 'ER_DUP_ENTRY') {
                    db.query(get_votes_sql, [poll], (err, results) => {
                        if(err) {
                            console.error(err);
                            return res.status(500).send('Server error');
                        }

                        return res.json({
                            results: results,
                            message: "You already voted."
                        });
                    });
                } else {
                    console.error(err);
                    return res.status(500).send('Server error');
                }
            }

            db.query(get_votes_sql, [poll], (err, results) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }

                res.json({
                    results: results
                });
            });
        });
    } else {
        res.json( {error: "You must be logged in to vote."} );
    }
});

app.post('/submit_review', (req, res) => {
    const reviewID = crypto.randomUUID();
    const prod = req.body.product_name;
    const rating = req.body.rating;
    const review = req.body.review_text;

    
  if (!req.session.UserID) {
    return res.status(401).json({ success: false, message: 'Log in to submit review' });
  }

    db.query(create_review_sql, [reviewID, prod, review, rating, req.session.UserID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Log in to submit review" });
        }
        res.json({ success: true, message: "Review submitted successfully" });
    });
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}/`);
});
