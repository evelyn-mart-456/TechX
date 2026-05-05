const { v4: uuidv4 } = require('uuid');
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const dbConfig = require('./dbConfig');
const fs = require('fs');
const session = require('express-session');
const multer = require('multer');
const cors = require("cors");
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
const delete_review_sql = fs.readFileSync('./db/delete_review.sql', 'utf8');

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
const update_post_sql = fs.readFileSync('./db/update_post.sql', 'utf8');
const delete_post_sql = fs.readFileSync('./db/delete_post.sql', 'utf8');

const create_cart_sql = fs.readFileSync('./db/create_cart.sql', 'utf8');
const get_cart_sql = fs.readFileSync('./db/get_cart.sql', 'utf8');
const add_item_to_cart_sql = fs.readFileSync('./db/add_item_to_cart.sql', 'utf8');
const get_cart_items_sql = fs.readFileSync('./db/get_cart_items', 'utf8');
const update_cart_item_quantity_sql = fs.readFileSync('./db/update_cart_item_quantity.sql', 'utf8');
const remove_item_from_cart_sql = fs.readFileSync('./db/remove_item_from_cart.sql', 'utf8');
const clear_cart_sql = fs.readFileSync('./db/clear_cart.sql', 'utf8');

const create_order_sql = fs.readFileSync('./db/create_order.sql', 'utf8');
const add_order_item_sql = fs.readFileSync('./db/add_order_item.sql', 'utf8');
const get_orders_by_user_sql = fs.readFileSync('./db/get_orders_by_user.sql', 'utf8');
const get_order_items_sql = fs.readFileSync('./db/get_order_items.sql', 'utf8');
const add_shipping_info_sql = fs.readFileSync('./db/add_shipping_info.sql', 'utf8');
const get_shipping_info_sql = fs.readFileSync('./db/get_shipping_info.sql', 'utf8');

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
        res.redirect('/login');
    }
});

app.get('/shopping-cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shopping-cart.html'));
});

app.get('/purchase-history', (req, res) => {
    if(req.session.userId) {
        res.sendFile(path.join(__dirname, 'public', 'purchase-history.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/api/session', (req, res) => {
    if(req.session.userId && req.session.username) {

        db.query(get_moderated_boards_sql, [req.session.userId], (err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            req.session.moderatedBoards = [];

            results.forEach( result => {
                req.session.moderatedBoards.push(result.ProductID);
            });

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

app.get('/api/Reviews/:id', (req, res) => {
    const id = req.params.id;
    const filter = req.query.filter;
    let query = get_reviews_by_product_sql.trim().replace(/;$/, '');
    const params = [id];
    let orderClause = '';

    if (filter === 'with_images') {
        query += ' AND Reviews.Image IS NOT NULL';
    } else if (['1','2','3','4','5'].includes(filter)) {
        query += ' AND Rating = ?';
        params.push(filter);
    } else if (filter === 'newest') {
        orderClause = ' ORDER BY Reviews.ReviewID DESC';
    } else if (filter === 'oldest') {
        orderClause = ' ORDER BY Reviews.ReviewID ASC';
    } else if (filter === 'highest') {
        orderClause = ' ORDER BY Rating DESC';
    } else if (filter === 'lowest') {
        orderClause = ' ORDER BY Rating ASC';
    }

    if (orderClause) {
        query += orderClause;
    }

    db.query(query, params, (err, results) => {
        if(err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: err.message });
        }

        return res.json({ success: true, reviews: results });
    });
});

app.get('/api/my-reviews', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'You must be logged in to view your reviews.' });
    }

    db.query(get_reviews_by_user_sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: err.message });
        }

        res.json({ success: true, reviews: results });
    });
});

app.delete('/api/delete_review/:id', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Log in to delete review' });
    }

    db.query(delete_review_sql, [req.params.id, req.session.userId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Review not found or not authorized' });
        }
        res.json({ success: true });
    });
});

// Cart routes
app.get('/api/cart', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    // First, get or create cart
    db.query(get_cart_sql, [req.session.userId], (err, cartResults) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        let cartId;
        if (cartResults.length === 0) {
            // Create cart
            db.query(create_cart_sql, [req.session.userId], (err, createResult) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Server error' });
                }
                cartId = createResult.insertId;
                getCartItems(cartId, res);
            });
        } else {
            cartId = cartResults[0].CartID;
            getCartItems(cartId, res);
        }
    });
});

function getCartItems(cartId, res) {
    db.query(get_cart_items_sql, [cartId], (err, items) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        const mappedItems = items.map(item => ({
            productId: item.ProductID,
            name: item.ProductName,
            price: item.Price,
            quantity: item.Quantity,
            image: item.ProductImage
        }));
        res.json({ items: mappedItems });
    });
}

app.post('/api/cart', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
        return res.status(400).json({ error: 'Product ID and quantity required' });
    }

    // Get product price
    db.query(get_product_sql, [productId], (err, productResults) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (productResults.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const price = productResults[0].RetailPrice;

        // Get or create cart
        db.query(get_cart_sql, [req.session.userId], (err, cartResults) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Server error' });
            }

            let cartId;
            if (cartResults.length === 0) {
                db.query(create_cart_sql, [req.session.userId], (err, createResult) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Server error' });
                    }
                    cartId = createResult.insertId;
                    addItemToCart(cartId, productId, quantity, price, res);
                });
            } else {
                cartId = cartResults[0].CartID;
                addItemToCart(cartId, productId, quantity, price, res);
            }
        });
    });
});

function addItemToCart(cartId, productId, quantity, price, res) {
    // First check if item already exists in cart
    db.query("SELECT Quantity FROM cartitem WHERE CartID = ? AND ProductID = ?", [cartId, productId], (err, existing) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (existing.length > 0) {
            // Item exists, update quantity
            const newQuantity = existing[0].Quantity + quantity;
            db.query(update_cart_item_quantity_sql, [newQuantity, cartId, productId], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Server error' });
                }
                res.json({ success: true });
            });
        } else {
            // Item doesn't exist, add new
            db.query(add_item_to_cart_sql, [cartId, productId, quantity, price], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Server error' });
                }
                res.json({ success: true });
            });
        }
    });
}

app.put('/api/cart/:productId', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const productId = req.params.productId;
    const { quantity } = req.body;

    db.query(get_cart_sql, [req.session.userId], (err, cartResults) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (cartResults.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const cartId = cartResults[0].CartID;
        db.query(update_cart_item_quantity_sql, [quantity, cartId, productId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            res.json({ success: true });
        });
    });
});

app.delete('/api/cart/:productId', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const productId = req.params.productId;

    db.query(get_cart_sql, [req.session.userId], (err, cartResults) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (cartResults.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const cartId = cartResults[0].CartID;

        db.query(remove_item_from_cart_sql, [cartId, productId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            res.json({ success: true });
        });
    });
});

app.get('/api/shipping', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    db.query(get_shipping_info_sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (results.length > 0) {
            res.json({ shipping: results[0] });
        } else {
            res.json({ shipping: null });
        }
    });
});

app.post('/api/shipping', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const { address, city, zipCode } = req.body;
    if (!address || !city || !zipCode) {
        return res.status(400).json({ error: 'Address, city, and zip code are required' });
    }

    // Check if shipping info already exists for user
    db.query(get_shipping_info_sql, [req.session.userId], (err, existing) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (existing.length > 0) {
            // Update existing
            db.query("UPDATE shippinginformation SET Address = ?, City = ?, ZipCode = ? WHERE UserID = ?",
                     [address, city, zipCode, req.session.userId], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Server error' });
                }
                res.json({ success: true });
            });
        } else {
            // Insert new
            db.query(add_shipping_info_sql, [req.session.userId, address, city, zipCode], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Server error' });
                }
                res.json({ success: true });
            });
        }
    });
});

app.post('/api/checkout', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    // Check if shipping info exists
    db.query(get_shipping_info_sql, [req.session.userId], (err, shippingResults) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (shippingResults.length === 0) {
            return res.status(400).json({ error: 'Shipping information required before checkout' });
        }
        const shippingId = shippingResults[0].ShippingID;

        // Get cart
        db.query(get_cart_sql, [req.session.userId], (err, cartResults) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            if (cartResults.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }
            const cartId = cartResults[0].CartID;

            // Get cart items to calculate total and create order items
            db.query(get_cart_items_sql, [cartId], (err, cartItems) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Server error' });
                }
                if (cartItems.length === 0) {
                    return res.status(400).json({ error: 'Cart is empty' });
                }

                // Calculate total
                const total = cartItems.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);

                // Get next order number for user
                db.query('SELECT COALESCE(MAX(OrderNumber), 0) + 1 AS nextNum FROM orders WHERE UserID = ?', [req.session.userId], (err, numResult) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Server error' });
                    }
                    const nextOrderNumber = numResult[0].nextNum;

                    // Create order
                    db.query('INSERT INTO orders (UserID, OrderNumber, Total, ShippingID, CreatedAt) VALUES (?, ?, ?, ?, NOW())', [req.session.userId, nextOrderNumber, total, shippingId], (err, orderResult) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ error: 'Server error' });
                        }
                        const orderId = orderResult.insertId;

                        // Insert order items
                        const orderItemPromises = cartItems.map(item =>
                            new Promise((resolve, reject) => {
                                db.query(add_order_item_sql, [orderId, item.ProductID, item.Quantity, item.Price], (err) => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            })
                        );

                        Promise.all(orderItemPromises)
                            .then(() => {
                                // Clear cart
                                db.query(clear_cart_sql, [cartId], (err) => {
                                    if (err) {
                                        console.error('Database error:', err);
                                        return res.status(500).json({ error: 'Server error' });
                                    }
                                    res.json({ success: true, orderId });
                                });
                            })
                            .catch(err => {
                                console.error('Database error:', err);
                                res.status(500).json({ error: 'Server error' });
                            });
                    });
                });
            });
        });
    });
});

app.get('/api/orders', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    db.query(get_orders_by_user_sql, [req.session.userId], (err, orders) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        // Get order items for each order
        const orderPromises = orders.map(order =>
            new Promise((resolve, reject) => {
                db.query(get_order_items_sql, [order.OrderID], (err, items) => {
                    if (err) reject(err);
                    else resolve({ ...order, orderNumber: order.OrderNumber, items });
                });
            })
        );

        Promise.all(orderPromises)
            .then(ordersWithItems => {
                res.json({ orders: ordersWithItems });
            })
            .catch(err => {
                console.error('Database error:', err);
                res.status(500).json({ error: 'Server error' });
            });
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

    db.query(get_user_sql, [username], (err, results) => {
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

// POST vote for a poll option
app.post("/votepoll", (req, res) => {
    const { PollID, OptionID } = req.body;
    const poll = polls.find(p => p.id === PollID);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    const option = poll.options.find(o => o.OptionID === OptionID);
    if (!option) return res.status(404).json({ error: "Option not found" });

    option.Votes += 1;
    res.json({ results: poll.options });
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

app.get('/api/products', (req, res) => {
    db.query(get_products_sql, [], (err, products) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.json({success: true, products: products});
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
if (rating < 1 || rating > 5) {
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

const polls = []; // In-memory storage

// GET all polls
app.get("/getpolls", (req, res) => {
    res.json({ polls });
});

// POST create a new poll
app.post("/createpoll", (req, res) => {
    const { question, options } = req.body;
    if (!question || !options || options.length < 2) {
        return res.status(400).json({ error: "Question and at least 2 options required" });
    }

    const newPoll = {
        id: uuidv4(),
        question,
        options: options.map((opt, i) => ({
            OptionID: `opt${i + 1}`,
            OptionName: opt,
            Votes: 0
        }))
    };

    polls.push(newPoll);
    res.json({ success: true, poll: newPoll });
});

let articles = [];

// Load existing articles
if (fs.existsSync("articles.json")) {
    articles = JSON.parse(fs.readFileSync("articles.json"));
}

app.post("/createarticle", (req, res) => {
    const { title, author, content } = req.body;

    const newArticle = {
        id: "article_" + Date.now(),
        title,
        author,
        content
    };

    articles.push(newArticle);

    // SAVE TO FILE
    fs.writeFileSync("articles.json", JSON.stringify(articles, null, 2));

    res.json({ success: true });
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

app.patch('/product/:id/post/:pid', (req, res) => {
    if(req.session.userId) {
        if(req.session.moderatedBoards && req.session.moderatedBoards.includes(Number(req.params.id))) {
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
            db.query(delete_post_sql, [req.params.pid], (err, result) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }

                return res.json({success: true});
            });
        } else {
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

            return res.redirect(`/product/${req.params.pid}/thread/${req.params.tid}/#${result.insertId}`);
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

app.get("/getarticles", (req, res) => {
    res.json({ articles });
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}/`);
});
