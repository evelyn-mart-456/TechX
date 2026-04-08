const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const dbConfig = require('./dbConfig');
const fs = require('fs');
const session = require('express-session');
const multer = require('multer');
const { connect } = require('http2');

// Loading sql files here
const register_sql = fs.readFileSync('./db/create_user.sql', 'utf8');
const get_user_sql = fs.readFileSync('./db/get_user.sql', 'utf8');
const get_users_sql = fs.readFileSync('./db/get_users.sql', 'utf8');
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
const create_review_sql = fs.readFileSync('./db/create_review.sql', 'utf8');
const get_reviews_sql = fs.readFileSync('./db/get_reviews.sql', 'utf8');
const get_reviews_by_product_sql = fs.readFileSync('./db/get_reviews_by_product.sql', 'utf8');
const get_reviews_by_user_sql = fs.readFileSync('./db/get_reviews_by_user.sql', 'utf8');
const update_review_sql = fs.readFileSync('./db/update_review.sql', 'utf8');

const get_moderators_sql = fs.readFileSync('./db/get_moderators.sql', 'utf8');
const add_moderator_sql = fs.readFileSync('./db/add_moderator.sql', 'utf8');
const delete_moderator_all_sql = fs.readFileSync('./db/delete_moderator_all.sql', 'utf8');
const get_moderated_boards_sql = fs.readFileSync('./db/get_moderated_boards.sql', 'utf8');
const get_threads_sql = fs.readFileSync('./db/get_threads.sql', 'utf8');
const get_thread_sql = fs.readFileSync('./db/get_thread.sql', 'utf8');
const create_thread_sql = fs.readFileSync('./db/create_thread.sql', 'utf8');
const update_thread_sql = fs.readFileSync('./db/update_thread.sql', 'utf8');
const delete_thread_sql = fs.readFileSync('./db/delete_thread.sql', 'utf8');
const create_post_sql = fs.readFileSync('./db/create_post.sql', 'utf8');
const get_post_sql = fs.readFileSync('./db/get_post.sql', 'utf8');
const delete_post_sql = fs.readFileSync('./db/delete_post.sql', 'utf8');

const app = express();
const port = 3000;

const productStorage = multer.diskStorage({
  destination: "public/product-images/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const reviewStorage = multer.diskStorage({
  destination: "public/review-images/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadProductImg = multer({ storage: productStorage });
const uploadReviewImg = multer({ storage: reviewStorage });

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));
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

app.get('/new-tech', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'new-tech.html'));
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

app.get('/board-moderators', (req, res) => {
    if(req.session.staffId) {
        res.sendFile(path.join(__dirname, 'public', 'board-moderators.html'));
    } else {
        res.redirect('/staff-login');
    }
});

app.get('/product/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product.html'));
});
app.get('/Review', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Review.html'));
});

app.get('/Reviews', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Reviews.html'));
});

app.get('/my-reviews', (req, res) => {
    if(req.session.userId) {
        res.sendFile(path.join(__dirname, 'public', 'my-reviews.html'));
    } else {
        res.redirect('/login'); //redirect if not logged in
    }
});


app.get('/api/session', (req, res) => {
    if(req.session.userId && req.session.username) {

        db.query(get_moderated_boards_sql, [req.session.userId], (err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            return res.json({
                loggedIn: true,
                username: req.session.username,
                userID: req.session.userId,
                moderatedBoards: req.session.moderatedBoards
            });
        });
    } else {
        return res.json({loggedIn: false});
    }
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
//get all products for dropdown
app.get('/api/products', (req, res) => {
    db.query(get_products_sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, products: results });
    });
});
//get reviews for a specific product and send them to the frontend
//get product from database and send to frontend
app.get('/api/Product/:id', (req, res) => {
    const productId = req.params.id;
    db.query(get_product_sql, [productId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err.message });
        }
    });
});
//get the reviews for the product and send them to the frontend
app.get('/api/Reviews/:Product_name', (req, res) => {
    const productName = req.params.Product_name;
    db.query(get_reviews_by_product_sql, [productName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, reviews: results });
    });
});

app.get('/api/Reviews/:id', (req, res) => {
    const id = req.params.id;

    db.query(get_reviews_by_product_sql, [id], (err, results) => {
        if(err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: err.message });
        }

        return res.json({ success: true, reviews: results });
    });
});

//get reviews for a specific user and send them to the frontend
app.get('/api/my-reviews', (req, res) => {
    if(!req.session.userId) {
        return res.status(401).json({ success: false, message: 'You must be logged in to view your reviews.' });
    }

    db.query(get_reviews_by_user_sql, [req.session.userId], (err, results) => {
        if(err) {
            console.error('Database error:', err);
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
                req.session.moderatedBoards = [];

                db.query(get_moderated_boards_sql, [results[0].UserID], (err, modresults) => {
                    if(err) {
                        console.error(err);
                        return res.status(500).send('Server error');
                    }

                    req.session.moderatedBoards = modresults.map(row => row.ProductID)

                    res.json( {success: true} );
                });
            }
            else
                res.json( {error: 'Invalid password.'} );
        } else {
            res.json( {error: 'Invalid username.'} );
        }
    });
});

app.get('/logout', (req, res) => {
    delete req.session.userId;
    delete req.session.username;
    delete req.session.moderatedBoards;

    res.json({loggedOut: true});
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
                    return db.query(get_votes_sql, [poll], (err, results) => {
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

            return db.query(get_votes_sql, [poll], (err, results) => {
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

app.post('/submit_review', uploadReviewImg.fields([{ name: 'review_image', maxCount: 1 }]), (req, res) => {
    console.log('submit_review called');
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    const reviewID = crypto.randomUUID();
    const prodId = req.body.product_id;
    const prodName = req.body.product_name;
    const rating = req.body.rating;
    const review = req.body.review_text;
    const imagePath = req.files?.review_image?.[0]?.filename || null;
    console.log('imagePath:', imagePath);

    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Log in to submit review' });
    }

    if (prodId) {
        // Fetch productName from product_id
        db.query(get_product_sql, [prodId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            const productName = results[0].ProductName;
            db.query(create_review_sql, [reviewID, prodId, productName, review, rating, req.session.userId, imagePath], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: err.message });
                }
                res.json({ success: true, message: "Review submitted successfully" });
            });
        });
    } else if (prodName) {
        // Use product_name directly, but need to get product_id for insert
        // Assuming product_name is unique, fetch product_id
        db.query('SELECT ProductID FROM Product WHERE ProductName = ?', [prodName], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            const productId = results[0].ProductID;
            db.query(create_review_sql, [reviewID, productId, prodName, review, rating, req.session.userId, imagePath], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: err.message });
                }
                res.json({ success: true, message: "Review submitted successfully", imagePath });
            });
        });
    } else {
        return res.status(400).json({ success: false, message: 'Product ID or name required' });
    }
});

app.put('/api/update_review/:id', uploadReviewImg.fields([{ name: 'review_image', maxCount: 1 }]), (req, res) => {
if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Log in to update review' });
}
const {review_text, rating} = req.body;
const reviewId = req.params.id;
const imagePath = req.files?.review_image?.[0]?.filename || req.body.existing_image || null;
//validate rating
if(rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'invalid rating' });
}
db.query(update_review_sql, [review_text, rating, imagePath, reviewId, req.session.userId], (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
    if(result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Review not found or you do not own the review' });
    }
    res.json({ success: true, message: 'Review updated' });
});
});

app.delete('/api/delete_review/:id', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Log in to delete review' });
    }

    const reviewId = req.params.id;

    db.query(
        'DELETE FROM Reviews WHERE ReviewID = ? AND UserID = ?',
        [reviewId, req.session.userId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Review not found or you do not own this review' });
            }
            res.json({ success: true, message: 'Review deleted successfully' });
        }
    );
});

app.get('/moderators', requireStaff, (req, res) => {
    db.query(get_moderators_sql, [], (err, moderators) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        db.query(get_users_sql, [], (err, users) => {
            if(err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            db.query(get_products_sql, [], (err, products) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }

                res.json({moderators: moderators, users: users, products: products});
            });
        })
    });
});

app.post('/moderators', requireStaff, (req, res) => {
    db.query(delete_moderator_all_sql, [req.body.userID], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        if(!req.body.moderators || req.body.moderators.length === 0) {
            return res.json({success: true});
        }
        else {
            const values = req.body.moderators.map(m => [m.userID, m.productID]);

            db.query(add_moderator_sql, [values], (err, results) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }
                
                if(results.affectedRows === 0)
                    res.json({success: false});
                else
                    res.json({success: true});
            });
        }
    });
});

app.post('/delete-moderator', requireStaff, (req, res) => {
    db.query(delete_moderator_all_sql, [req.body.userID], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        
        if(results.affectedRows === 0)
            res.json({success: false});
        else
            res.json({success: true});
    });
});

app.get('/threads/:id', (req, res) => {
    db.query(get_threads_sql, [req.params.id], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        return res.json(results);
    })
});

app.get('/product/:pid/thread/:tid', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'thread.html'));
});

app.get('/product/:pid/posts/:tid', (req, res) => {
    const productId = req.params.pid;
    const threadId = req.params.tid;

    db.query(get_thread_sql, [threadId], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        return res.json({posts: results});
    });
});

app.patch('/post/:pid', (req, res) => {
    if(req.session.userId) {
        if(req.session.moderatedBoards && req.session.moderatedBoards.includes(Number(req.params.pid))) {
            db.query(update_post_sql, [req.body.message, req.params.pid], (err, result) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }

                return res.json({success: true});
            });
        } else {
            db.query(get_post_sql, [req.params.pid], (err, results) => {
                if(results[0].UserID === req.session.userId) {
                    db.query(update_post_sql, [req.body.message, req.params.pid], (err, result) => {
                        if(err) {
                            console.error(err);
                            return res.status(500).send('Server error');
                        }

                        return res.json({success: true});
                    });
                } else
                    return res.status(403).send('Forbidden');
            });
        }
    } else {
        return res.status(403).send('Forbidden');
    }
});

app.delete('/product/:id/post/:pid', (req, res) => {
    if(req.session.userId) {
        if(req.session.moderatedBoards && req.session.moderatedBoards.includes(Number(req.params.id))) {
            console.log("Mod delete path.");
            db.query(delete_post_sql, [req.params.pid], (err, result) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }

                return res.json({success: true});
            });
        } else {
            console.log("Logged in user delete path");
            db.query(get_post_sql, [req.params.pid], (err, results) => {
                if(results[0].UserID === req.session.userId) {
                    db.query(delete_post_sql, [req.params.pid], (err, result) => {
                        if(err) {
                            console.error(err);
                            return res.status(500).send('Server error');
                        }

                        return res.json({success: true});
                    });
                } else
                    return res.status(403).send('Forbidden');
            });
        }
    } else {
        console.log("Forbidden - not logged in");
        return res.status(403).send('Forbidden');
    }
});

app.post('/product/:pid/thread/:tid', (req, res) => {
    if(req.session.userId) {
        db.query(create_post_sql, [req.session.userId, req.params.tid, req.body.message], (err, result) => {
            if(err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            return res.redirect(`/product/${req.params.pid}/thread/${req.params.tid}`);
        });
    } else
        return res.status(403).send('Forbidden');
})

app.patch('/product/:pid/thread/:tid', (req, res) => {
    if(req.session.userId) {
        if(req.session.moderatedBoards && req.session.moderatedBoards.includes(Number(req.params.pid))) {
            db.query(update_thread_sql, [req.body.title, req.params.tid], (err, results) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }

                return res.json({success: true});
            });
        } else {
            db.query(get_thread_sql, [req.params.tid], (err, result) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }

                if(result.length > 0 && result[0].UserID === req.session.userId) {
                    db.query(update_thread_sql, [req.body.title, req.params.tid], (err, results) => {
                        if(err) {
                            console.error(err);
                            return res.status(500).send('Server error');
                        }

                        return res.json({success: true});
                    });
                } else {
                    return res.status(403).send('Forbidden');
                }
            });
        }
    }
});

app.delete('/product/:pid/thread/:tid', (req, res) => {
    if(req.session.userId) {
        if(req.session.moderatedBoards && req.session.moderatedBoards.includes(Number(req.params.pid))) {
            db.query(delete_thread_sql, [req.params.tid], (err, results) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }

                return res.json({success: true});
            });
        } else {
            db.query(get_thread_sql, [req.params.tid], (err, result) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }

                if(result.length > 0 && result[0].UserID === req.session.userId) {
                    db.query(delete_thread_sql, [req.params.tid], (err, results) => {
                        if(err) {
                            console.error(err);
                            return res.status(500).send('Server error');
                        }

                        return res.json({success: true});
                    });
                } else {
                    return res.status(403).send('Forbidden');
                }
            });
        }
    }
});

app.post('/product/:id/thread', (req, res) => {
    if(req.session.userId) {
        db.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            connection.beginTransaction(err => {
                if(err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }

                connection.query(create_thread_sql, [req.session.userId, req.params.id, req.body.title], (err, threadResult) => {
                    if(err) {
                        return connection.rollback(() => {
                            console.error(err);
                            return res.status(500).send('Server error');
                        });
                    }

                    const threadId = threadResult.insertId;

                    connection.query(create_post_sql, [req.session.userId, threadId, req.body.message], (err) => {
                        if(err) {
                            return connection.rollback(() => {
                                console.error(err);
                                return res.status(500).send('Server error');
                            });
                        }
                        
                        connection.commit(err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.error(err);
                                    return res.status(500).send('Server error');
                                });
                            }

                            connection.release();
                            return res.redirect(`/product/${req.params.id}/thread/${threadId}`);
                        });
                    });
                });

            })
        });
    }
    else
        return res.redirect("/login");
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}/`);
});
