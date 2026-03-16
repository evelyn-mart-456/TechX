const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const dbConfig = require('./dbConfig');
const fs = require('fs');
const session = require('express-session');
const multer = require('multer');

// Loading sql files here
const register_sql = fs.readFileSync('./db/create_user.sql', 'utf8');
const get_user_sql = fs.readFileSync('./db/get_user.sql', 'utf8');
const create_vote_sql = fs.readFileSync('./db/create_vote.sql', 'utf8');
const get_votes_sql = fs.readFileSync('./db/get_votes.sql', 'utf8');
const get_user_voted_sql = fs.readFileSync('./db/get_user_voted.sql', 'utf8');

const create_staff_sql = fs.readFileSync('./db/create_staff.sql', 'utf8');
const get_staff_sql = fs.readFileSync('./db/get_staff.sql', 'utf8');
const get_all_staff_sql = fs.readFileSync('./db/get_all_staff.sql', 'utf8');
const activate_staff_sql = fs.readFileSync('./db/activate_staff.sql', 'utf8');

const create_product_sql = fs.readFileSync('./db/create_product.sql', 'utf8');
const update_product_sql = fs.readFileSync('./db/update_product.sql', 'utf8');
const update_product_noimg_sql = fs.readFileSync('./db/update_product_noimg.sql', 'utf8');
const delete_product_sql = fs.readFileSync('./db/delete_product.sql', 'utf8');
const get_product_sql = fs.readFileSync('./db/get_product.sql', 'utf8');
const get_products_sql = fs.readFileSync('./db/get_products.sql', 'utf8');
const get_featured_products_sql = fs.readFileSync('./db/get_featured_products.sql', 'utf8');
const get_categories_sql = fs.readFileSync('./db/get_product_categories.sql', 'utf8');
const create_product_category_sql = fs.readFileSync('./db/create_product_category.sql', 'utf8');
const update_product_category_sql = fs.readFileSync('./db/update_product_category.sql', "utf8");
const delete_product_category_sql = fs.readFileSync('./db/delete_product_category.sql', 'utf8');

const app = express();
const port = 3000;

const productStorage = multer.diskStorage({
  destination: "public/product-images/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadProductImg = multer({ storage: productStorage });

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'change-this-later',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

const db = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

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

app.get('/tech', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tech.html'));
});

app.get('/tech/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tech.html'));
});

app.get('/staff-login', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'staff-login.html'));
});

app.get('/staff-register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'staff-register.html'));
});

app.get('/staff', (req, res) => {
    if(req.session.staffId) {
        res.sendFile(path.join(__dirname, 'public', 'staff.html'));
    } else {
        res.redirect('/staff-login');
    }
});

app.get('/product/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

function requireStaff(req, res, next) {
  if (!req.session.staffId) {
    return res.sendStatus(403);
  }

  next();
}

app.get('/staff-session', (req, res) => {
    if(req.session.staffId && req.session.staffUsername) {
        res.json({staffId: req.session.staffId, staffUsername: req.session.staffUsername });
    } else {
        res.json({error: "You are not logged in."});
    }
});

app.get('/product-management', (req, res) => {
    if(req.session.staffId) {
        res.sendFile(path.join(__dirname, 'public', 'product-management.html'));
    } else {
        res.redirect('/staff-login');
    }
});

app.get('/get-staff', requireStaff, (req, res) => {
    if(req.session.staffId) {
        db.query(get_all_staff_sql, [], (err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            res.json({results: results});
        });
    } else {
        res.json({error: "You do not have permission to view this."});
    }
})

app.get('/get-products', (req, res) => {
    db.query(get_products_sql, [], (err, products) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        db.query(get_categories_sql, [], (err, categories) => {
            if(err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            res.json({products: products, categories: categories});
        })
    });
});

app.get('/featured-products', (req, res) => {
    db.query(get_featured_products_sql, [], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        res.json({results: results});
    });
});

app.post('/categories', requireStaff, (req, res) => {
    const name = req.body.name;

    if(!name.trim())
        return res.json({error: "You must supply a category name"});

    db.query(create_product_category_sql, [name], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        res.json({success: "true"});
    });
});

app.patch('/categories/:id', requireStaff, (req, res) => {
    const name = req.body.name;
    const id = req.params.id;

    if(!name.trim())
        return res.json({error: "You must supply a category name"});

    db.query(update_product_category_sql, [name, id], (err, results) =>{
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        res.json({success: "true"});
    });
});

app.delete('/categories/:id', requireStaff, (req, res) => {
    const id = req.params.id;

    db.query(delete_product_category_sql, [id], (err, results) =>{
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        res.json({success: "true"});
    });
});

app.get('/products/:id', (req, res) => {
    const id = req.params.id;

    db.query(get_product_sql, [id], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        res.json({results: results});
    });
});

app.post('/products', requireStaff, uploadProductImg.single("image"), (req, res) => {
    const file = req.file;
    const filename = req.file.filename;

    const name = req.body.name;
    const desc = req.body.desc;
    const link = req.body.link;
    const catID = req.body.catID;
    const price = Number(req.body.price);

    const featured = req.body.featured === "true";

    if(!name || !desc || !link || !catID || !price)
        return res.json({error: "You must fill in all fields."});

    if(!Number.isFinite(price))
        return res.json({error: "The price must be a number."});

    db.query(create_product_sql, [name, desc, filename, featured, link, catID, price], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        res.json({success: "true"});
    });
    
});

app.patch('/products/:id', requireStaff, uploadProductImg.single("image"), (req, res) => {
    const file = req.file;

    const name = req.body.name;
    const desc = req.body.desc;
    const link = req.body.link;
    const catID = req.body.catID;
    const price = Number(req.body.price);

    const featured = req.body.featured === "true";

    const id = req.params.id;

    if(!name || !desc || !link || !catID || !price)
        return res.json({error: "You must fill in all fields."});

    if(!Number.isFinite(price))
        return res.json({error: "The price must be a number."});

    if(file) {
        const filename = req.file.filename;
        db.query(update_product_sql, [name, desc, filename, featured, link, catID, price, id], (err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            res.json({success: "true"});
        });
    } else {
        db.query(update_product_noimg_sql, [name, desc, featured, link, catID, price, id], (err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            res.json({success: "true"});
        });
    }

});

app.delete('/products/:id', requireStaff, (req, res) => {
    if(req.session.staffId) {
        const id = req.params.id;

        db.query(delete_product_sql, [id], (err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            res.json({success: "true"});
        });
    } else {
        res.json({error: "You do not have permission to do this."});
    }
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

app.post('/staff-login', (req, res) => {
    const username = req.body.username;
    const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

    db.query(get_staff_sql, [username, hashedPassword], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        if(results.length > 0) {
            if(results[0].Password_Hash === hashedPassword && results[0].Username === username) {
                if(results[0].Activated) {
                    req.session.staffId = results[0].StaffID;
                    req.session.staffUsername = results[0].Username;
                    res.redirect('/staff');
                }
                else
                    res.json( {error: "Your staff acount has not been activated."});
            }
            else
                res.json( {error: 'Invalid password.'} );
        } else {
            res.json( {error: 'Invalid username.'} );
        }
    });
});

app.get('/staff-logout', (req, res) => {
    delete req.session.staffId;
    delete req.session.staffUsername;
    
    res.redirect('/staff-login');
});

app.post('/staff-register', (req, res) => {
    const username = req.body.username;

    if(!req.body.password)
        return res.json({error: 'You must enter a password.'});

    const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');
    const email = req.body.email;

    db.query(get_staff_sql, [username], (err, results) => {
        if(err) {
            console.error('Database error:', err);
        }

        if(results.length > 0) {
            res.json({error: "Error: username is taken."});
        } else {
            db.query(create_staff_sql, [email, username, hashedPassword], (err, results) => {
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

app.post('/staff-activate', requireStaff, (req, res) => {
    if(req.session.staffId) {
        if(req.body.staffId != req.session.staffId) {
            db.query(activate_staff_sql, [req.body.staffId], (err, results) => {
                if(err) {
                    console.error('Database error:', err);
                }
                
                if(results.affectedRows === 0)
                    return res.json({success: false});
                else
                    return res.json({success: true});
            });
        } else
            return res.json({success: true});
    }
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}/`);
});
