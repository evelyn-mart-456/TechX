<<<<<<< HEAD
require("dotenv").config();
console.log("Loaded DB_USER =", process.env.DB_USER);
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const db = require('./dbConfig');   // <-- use the existing connection
const fs = require('fs');
const session = require('express-session');

const register_sql = fs.readFileSync('./db/create_user.sql', 'utf8');
const get_user_sql = fs.readFileSync('./db/get_user.sql', 'utf8');
const create_vote_sql = fs.readFileSync('./db/create_vote.sql', 'utf8');
const get_votes_sql = fs.readFileSync('./db/get_votes.sql', 'utf8');
const get_user_voted_sql = fs.readFileSync('./db/get_user_voted.sql', 'utf8');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'change-this-later',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

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

    db.query(get_votes_sql, [poll], (err, results) => {
        if (err) {
            console.error("VOTED ROUTE ERROR (get_votes_sql):", err);
            return res.status(500).send("Server error");
        }

        let userVoted = false;

        if (req.session.userId) {
            db.query(get_user_voted_sql, [req.session.userId, poll], (err, votedRows) => {
                if (err) {
                    console.error("VOTED ROUTE ERROR (get_user_voted_sql):", err);
                    return res.status(500).send("Server error");
                }

                if (votedRows.length > 0) userVoted = true;

                res.json({
                    voted: userVoted,
                    results: results
                });
            });
        } else {
            res.json({
                voted: false,
                results: results
            });
        }
    });
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

app.get('/polls', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'polls.html'));
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}/`);
});

=======
require("dotenv").config();
console.log("Loaded DB_USER =", process.env.DB_USER);
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const db = require('./dbConfig');   // <-- use the existing connection
const fs = require('fs');
const session = require('express-session');

const register_sql = fs.readFileSync('./db/create_user.sql', 'utf8');
const get_user_sql = fs.readFileSync('./db/get_user.sql', 'utf8');
const create_vote_sql = fs.readFileSync('./db/create_vote.sql', 'utf8');
const get_votes_sql = fs.readFileSync('./db/get_votes.sql', 'utf8');
const get_user_voted_sql = fs.readFileSync('./db/get_user_voted.sql', 'utf8');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'change-this-later',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

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

    db.query(get_votes_sql, [poll], (err, results) => {
        if (err) {
            console.error("VOTED ROUTE ERROR (get_votes_sql):", err);
            return res.status(500).send("Server error");
        }

        let userVoted = false;

        if (req.session.userId) {
            db.query(get_user_voted_sql, [req.session.userId, poll], (err, votedRows) => {
                if (err) {
                    console.error("VOTED ROUTE ERROR (get_user_voted_sql):", err);
                    return res.status(500).send("Server error");
                }

                if (votedRows.length > 0) userVoted = true;

                res.json({
                    voted: userVoted,
                    results: results
                });
            });
        } else {
            res.json({
                voted: false,
                results: results
            });
        }
    });
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

app.get('/polls', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'polls.html'));
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}/`);
});

>>>>>>> b3116da48a06ae0d8a5f201dbef62220bda28af4
