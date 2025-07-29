const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2'); 
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cron = require('node-cron');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const session = require("express-session");
const { error } = require('console');
const MySQLStore = require('express-mysql-session')(session);
const http = require('http');
const socketio = require('socket.io');

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors({
  origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    credentials: true,
}));

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const secretKey = process.env.SESSION_SECRET || 'your-very-secret-key';

app.use(
    session({
      secret: secretKey,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 60 * 1000 
      },
    })
  );



app.set("views", path.join(__dirname, "blogWebPage"));
app.set("view engine", "ejs");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, path.join(__dirname, 'uploads')); 
   },
   filename: (req, file, cb) => {
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
     cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
   },
});
const upload = multer({ storage });

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection =  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    maxIdle: 0,
    idleTimeout: 60000,
    enableKeepAlive: true,
  });


  const transporter = nodemailer.createTransport({
   host: "smpt.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug: true,
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
      
app.set('io', io);

app.use(express.static(path.join(__dirname, "blogWebPage/assets")));
app.use(express.static(path.join(__dirname, "blogWebPage/venobox")));


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/blog', (req, res) => {
  res.render('blog');
});

app.get('/blog-details', (req, res) => {
  res.render('blog-details');
});

app.get('/Admin/login', (req, res) => {
  res.render('Admin/login');
});

app.get('/Admin/blog', (req, res) => {
  res.render('Admin/blog');
});

app.get('/Admin/blog-details', (req, res) => {
  res.render('Admin/blog-details');
});


  function requireAdminLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/Admin/login');
  }
  next();
}


app.get('/Admin/posts', requireAdminLogin, (req, res) => {
  res.render('Admin/posts', { user: req.session.user });
});

app.get('/Admin/post-detail', requireAdminLogin, (req, res) => {
  res.render('Admin/post-detail', { user: req.session.user });
});

app.get('/Admin/settings', requireAdminLogin, (req, res) => {
  res.render('Admin/settings', { user: req.session.user });
});

app.get('/Admin/support', requireAdminLogin, (req, res) => {
  res.render('Admin/support', { user: req.session.user });
});

app.get('/Admin/comments', requireAdminLogin, (req, res) => {
  res.render('Admin/comments', { user: req.session.user });
});

app.get('/Admin/categories-tags', requireAdminLogin, (req, res) => {
  res.render('Admin/categories-tags', { user: req.session.user });
});

app.get('/Admin/commenters', requireAdminLogin, (req, res) => {
  res.render('Admin/commenters', { user: req.session.user });
});

const saltRounds = 10;

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
   
    connection.query('SELECT id FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      if (results.length > 0) return res.status(409).json({ message: 'Email already registered.' });

    
      const hashedPassword = await bcrypt.hash(password, saltRounds);

     
      connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Registration failed.' });
          res.status(201).json({ message: 'User registered successfully.' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

app.post('/ckeditor-upload', upload.single('upload'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ uploaded: false, error: { message: 'No file uploaded.' } });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(201).json({
    uploaded: true,
    url: fileUrl
  });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required.' });
  }
  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials.' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials.' });


    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    res.redirect('/Admin/dashboard');
  });
});

app.post('/create-post', upload.single('feature_image'), async (req, res) => {
 let { title, slug, content, categories, tags, is_featured, status } = req.body;
is_featured = Number(is_featured) ? 1 : 0;

  try {
    categories = JSON.parse(categories);
    tags = JSON.parse(tags);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid category or tag format.' });
  }

  const author_id = req.session.user ? req.session.user.id : null;
  let feature_image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !slug || !content || !categories || !tags || !author_id || !status) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  
  connection.query('SELECT id FROM posts WHERE slug = ?', [slug], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length > 0) {
      return res.status(409).json({ message: 'Slug already exists. Please choose a different slug.' });
    }

  
    connection.query(
      `INSERT INTO posts (title, slug, content, feature_image, is_featured, author_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, content, feature_image, is_featured ? 1 : 0, author_id, status],
      async (err, result) => {
        if (err) {
          console.error('SQL error:', err);
          return res.status(500).json({ message: 'Error creating post.', error: err });
        }

        const postId = result.insertId;

      
        const categoryArr = Array.isArray(categories) ? categories : [categories];
        await Promise.all(categoryArr.map(catId => {
          return connection.promise().query('INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)', [postId, catId]);
        }));

       
        const tagArr = Array.isArray(tags) ? tags : [tags];
        await Promise.all(tagArr.map(async tagSlug => {

        const [tagRows] = await connection.promise().query('SELECT tag_id FROM post_tags WHERE slug = ?', [tagSlug]);
        let tagId;
        if (tagRows.length > 0) {
          tagId = tagRows[0].tag_id;
        } else {

          const [tagInsert] = await connection.promise().query(
            'INSERT INTO post_tags (name, slug) VALUES (?, ?)',
            [tagSlug.replace(/-/g, ' '), tagSlug]
          );
          tagId = tagInsert.insertId;
        }
      
        await connection.promise().query('INSERT INTO posts_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagId]);
      }));

        res.status(201).json({ message: 'Post created successfully.' });
      }
    );
  });
});

app.get('/users', (req, res) => {
  connection.query('SELECT id, name, email FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users.' });
    res.status(200).json(results);
  });
})

app.get('/users/:id', (req, res) => {
  const sessionUser = req.session.user;
  const requestedId = parseInt(req.params.id, 10);

  if (!sessionUser || sessionUser.id !== requestedId) {
    return res.status(403).json({ message: 'Unauthorized or user not found.' });
  }

  res.status(200).json({
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email
  });
});

app.get('/user-post/:id', (req, res) => {
  const requestedId = parseInt(req.params.id, 10);

  connection.query('SELECT id, name, email FROM users WHERE id = ?', [requestedId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user.' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found.' });

    const user = results[0];
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  });
});

app.get('/posts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  connection.query('SELECT COUNT(*) AS count FROM posts', (err, countResults) => {
    if (err) return res.status(500).json({ message: 'Error fetching posts.' });
    const totalPosts = countResults[0].count;
    const totalPages = Math.ceil(totalPosts / limit);

    connection.query(
      `SELECT p.*, u.name AS author_name
       FROM posts p
       JOIN users u ON p.author_id = u.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
      (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching posts.' });
        res.status(200).json({ posts: results, totalPages });
      }
    );
  });
});

app.get('/post/:id/details', (req, res) => {
  const postId = req.params.id;
  connection.query(
    `SELECT p.*, u.name AS author_name
     FROM posts p
     JOIN users u ON p.author_id = u.id
     WHERE p.id = ?`,
    [postId],
    (err, results) => {
      if (err || results.length === 0) return res.status(404).json({ message: 'Post not found.' });
      const post = results[0];

      connection.query(
        `SELECT c.name FROM categories c
         JOIN post_categories pc ON c.id = pc.category_id
         WHERE pc.post_id = ?`,
        [postId],
        (err, catResults) => {
          post.categories = catResults.map(c => c.name);

          connection.query(
            `SELECT t.name FROM post_tags t
             JOIN posts_tags pt ON t.tag_id = pt.tag_id
             WHERE pt.post_id = ?`,
            [postId],
            (err, tagResults) => {
              post.tags = tagResults.map(t => t.name);
              res.status(200).json(post);
            }
          );
        }
      );
    }
  );
});

app.get('/post/:id', (req, res) => {
  const postId = req.params.id;
  connection.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching post.' });
    if (results.length === 0) return res.status(404).json({ message: 'Post not found.' });

    const post = results[0];
   
    connection.query('SELECT category_id FROM post_categories WHERE post_id = ?', [postId], (err, catResults) => {
      if (err) return res.status(500).json({ message: 'Error fetching categories.' });
      post.categories = catResults.map(c => c.category_id);

     
      connection.query('SELECT tag_id FROM posts_tags WHERE post_id = ?', [postId], (err, tagResults) => {
        if (err) return res.status(500).json({ message: 'Error fetching tags.' });
        post.tags = tagResults.map(t => t.tag_id);

        res.status(200).json(post);
      });
    });
  });
});

app.get('/post-users/:id', (req, res) => {
  const postId = req.params.id;

  connection.query('UPDATE posts SET views = views + 1 WHERE id = ?', [postId], (err) => {
    if (err) console.error('Error updating views:', err); 

   
    connection.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching post.' });
      if (results.length === 0) return res.status(404).json({ message: 'Post not found.' });

      const post = results[0];
      connection.query('SELECT category_id FROM post_categories WHERE post_id = ?', [postId], (err, catResults) => {
        if (err) return res.status(500).json({ message: 'Error fetching categories.' });
        post.categories = catResults.map(c => c.category_id);

        connection.query('SELECT tag_id FROM posts_tags WHERE post_id = ?', [postId], (err, tagResults) => {
          if (err) return res.status(500).json({ message: 'Error fetching tags.' });
          post.tags = tagResults.map(t => t.tag_id);

          res.status(200).json(post);
        });
      });
    });
  });
});

app.get('/posts/category/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  connection.query(
    `SELECT p.*, u.name AS author_name,
            GROUP_CONCAT(DISTINCT pc.category_id) AS categories,
            GROUP_CONCAT(DISTINCT pt.tag_id) AS tags
     FROM posts p
     JOIN post_categories pc ON p.id = pc.post_id
     LEFT JOIN posts_tags pt ON p.id = pt.post_id
     JOIN users u ON p.author_id = u.id
     WHERE p.id IN (
        SELECT post_id FROM post_categories WHERE category_id = ?
     )
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    [categoryId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching posts.' });
      
      results.forEach(post => {
        post.categories = post.categories ? post.categories.split(',').map(Number) : [];
        post.tags = post.tags ? post.tags.split(',').map(Number) : [];
      });
      res.status(200).json(results);
    }
  );
});

app.get('/posts/tag/:tagId', (req, res) => {
  const tagId = req.params.tagId;
  connection.query(
    `SELECT p.*, u.name AS author_name,
            GROUP_CONCAT(DISTINCT pc.category_id) AS categories,
            GROUP_CONCAT(DISTINCT pt.tag_id) AS tags
     FROM posts p
     LEFT JOIN post_categories pc ON p.id = pc.post_id
     JOIN posts_tags pt ON p.id = pt.post_id
     JOIN users u ON p.author_id = u.id
     WHERE p.id IN (
        SELECT post_id FROM posts_tags WHERE tag_id = ?
     )
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    [tagId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching posts.' });
      results.forEach(post => {
        post.categories = post.categories ? post.categories.split(',').map(Number) : [];
        post.tags = post.tags ? post.tags.split(',').map(Number) : [];
      });
      res.status(200).json(results);
    }
  );
});

app.patch('/post/:id', upload.single('feature_image'), (req, res) => {
  const postId = req.params.id;
  let { title, slug, content, categories, tags, is_featured, status } = req.body;
  let feature_image = req.file ? `/uploads/${req.file.filename}` : req.body.feature_image || undefined;

  // Parse categories/tags if sent as JSON strings
  try {
    if (typeof categories === 'string') categories = JSON.parse(categories);
  } catch (e) { categories = []; }
  try {
    if (typeof tags === 'string') tags = JSON.parse(tags);
  } catch (e) { tags = []; }

  let fields = [];
  let values = [];
  if (title) { fields.push('title=?'); values.push(title); }
  if (slug) { fields.push('slug=?'); values.push(slug); }
  if (content) { fields.push('content=?'); values.push(content); }
  if (typeof feature_image !== 'undefined') { fields.push('feature_image=?'); values.push(feature_image); }
if (typeof is_featured !== 'undefined') {
  fields.push('is_featured=?');
  values.push(is_featured == 1 ? 1 : 0);
}
  if (status) { fields.push('status=?'); values.push(status); }

  if (fields.length === 0) return res.status(400).json({ message: 'No fields to update.' });

  values.push(postId);

  connection.query(
    `UPDATE posts SET ${fields.join(', ')} WHERE id=?`,
    values,
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error updating post.', error: err });

    
      connection.query('DELETE FROM post_categories WHERE post_id=?', [postId], () => {
        if (categories && categories.length) {
          categories.forEach(catId => {
            connection.query('INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)', [postId, catId]);
          });
        }
      });

    
      connection.query('DELETE FROM posts_tags WHERE post_id=?', [postId], () => {
        if (tags && tags.length) {
          tags.forEach(tagId => {
            connection.query('INSERT INTO posts_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagId]);
          });
        }
      });

      res.status(200).json({ message: 'Post updated successfully.' });
    }
  );
});

app.delete('/post/:id', (req, res) => {
  const postId = req.params.id;
 
  connection.query('DELETE FROM posts WHERE id=?', [postId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting post.' });

    connection.query('DELETE FROM post_categories WHERE post_id=?', [postId]);
    connection.query('DELETE FROM posts_tags WHERE post_id=?', [postId]);

    res.status(200).json({ message: 'Post deleted successfully.' });
  });
});


app.post('/categories', (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required.' });
  }
  connection.query(
    'INSERT INTO categories (name, slug) VALUES (?, ?)',
    [name, slug],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating category.' });
      res.status(201).json({ message: 'Category created successfully.', id: result.insertId });
    }
  );
});



app.get('/categories/:id', (req, res) => {
  connection.query(
    `SELECT c.*, COUNT(pc.post_id) AS post_count
     FROM categories c
     LEFT JOIN post_categories pc ON c.id = pc.category_id
     WHERE c.id = ?
     GROUP BY c.id`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching category.' });
      if (results.length === 0) return res.status(404).json({ message: 'Category not found.' });
      res.status(200).json(results[0]);
    }
  );
});


app.get('/categories', (req, res) => {
  connection.query(
    `SELECT c.*, COUNT(pc.post_id) AS post_count
     FROM categories c
     LEFT JOIN post_categories pc ON c.id = pc.category_id
     GROUP BY c.id`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching categories.' });
      res.status(200).json(results);
    }
  );
});

app.get('/categories_user', (req, res) => {
  connection.query(`
    SELECT c.*, 
      (
        SELECT COUNT(*) 
        FROM post_categories pc
        JOIN posts p ON pc.post_id = p.id
        WHERE pc.category_id = c.id AND p.status = 'publish'
      ) AS post_count
    FROM categories c
    ORDER BY c.name ASC
  `, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching categories.', error: err });
    res.status(200).json(results);
  });
});

app.patch('/categories/:id', (req, res) => {
  const { name, slug } = req.body;
  let fields = [];
  let values = [];
  if (name) { fields.push('name=?'); values.push(name); }
  if (slug) { fields.push('slug=?'); values.push(slug); }
  if (fields.length === 0) return res.status(400).json({ message: 'No fields to update.' });
  values.push(req.params.id);

  connection.query(`UPDATE categories SET ${fields.join(', ')} WHERE id=?`, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating category.' });
    res.status(200).json({ message: 'Category updated successfully.' });
  });
});

app.delete('/categories/:id', (req, res) => {
  connection.query('DELETE FROM categories WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting category.' });
    res.status(200).json({ message: 'Category deleted successfully.' });
  });
});



app.post('/tags', (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required.' });
  }
  connection.query(
    'INSERT INTO post_tags (name, slug) VALUES (?, ?)',
    [name, slug],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating tag.' });
      res.status(201).json({ message: 'Tag created successfully.', id: result.insertId });
    }
  );
});

app.get('/tags', (req, res) => {
  connection.query(
    `SELECT t.*, COUNT(pt.post_id) AS post_count
     FROM post_tags t
     LEFT JOIN posts_tags pt ON t.tag_id = pt.tag_id
     GROUP BY t.tag_id`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching tags.' });
      res.status(200).json(results);
    }
  );
});

app.get('/tags/:id', (req, res) => {
  connection.query(
    `SELECT t.*, COUNT(pt.post_id) AS post_count
     FROM post_tags t
     LEFT JOIN posts_tags pt ON t.tag_id = pt.tag_id
     WHERE t.tag_id = ?
     GROUP BY t.tag_id`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching tag.' });
      if (results.length === 0) return res.status(404).json({ message: 'Tag not found.' });
      res.status(200).json(results[0]);
    }
  );
});

app.patch('/tags/:id', (req, res) => {
  const { name, slug } = req.body;
  let fields = [];
  let values = [];
  if (name) { fields.push('name=?'); values.push(name); }
  if (slug) { fields.push('slug=?'); values.push(slug); }
  if (fields.length === 0) return res.status(400).json({ message: 'No fields to update.' });
  values.push(req.params.id);

  connection.query(`UPDATE post_tags SET ${fields.join(', ')} WHERE tag_id=?`, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating tag.' });
    res.status(200).json({ message: 'Tag updated successfully.' });
  });
});

app.delete('/tags/:id', (req, res) => {
  connection.query('DELETE FROM post_tags WHERE tag_id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting tag.' });
    res.status(200).json({ message: 'Tag deleted successfully.' });
  });
});


app.post('/social_links', (req, res) => {
  const { platform, url } = req.body;
  if (!platform || !url) {
    return res.status(400).json({ message: 'Platform and URL are required.' });
  }
  connection.query(
    'INSERT INTO social_links (platform, url) VALUES (?, ?)',
    [platform, url],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating social link.' });
      res.status(201).json({ message: 'Social link created successfully.', id: result.insertId });
    }
  );
});

app.get('/social_links', (req, res) => {
  connection.query('SELECT * FROM social_links', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching social links.' });
    res.status(200).json(results);
  });
});

app.get('/social_links/:id', (req, res) => {
  connection.query('SELECT * FROM social_links WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching social link.' });
    if (results.length === 0) return res.status(404).json({ message: 'Social link not found.' });
    res.status(200).json(results[0]);
  });
});

app.patch('/social_links/:id', (req, res) => {
  const { platform, url } = req.body;
  let fields = [];
  let values = [];
  if (platform) { fields.push('platform=?'); values.push(platform); }
  if (url) { fields.push('url=?'); values.push(url); }
  if (fields.length === 0) return res.status(400).json({ message: 'No fields to update.' });
  values.push(req.params.id);

  connection.query(`UPDATE social_links SET ${fields.join(', ')} WHERE id=?`, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating social link.' });
    res.status(200).json({ message: 'Social link updated successfully.' });
  });
});

app.delete('/social_links/:id', (req, res) => {
  connection.query('DELETE FROM social_links WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting social link.' });
    res.status(200).json({ message: 'Social link deleted successfully.' });
  });
});

app.post('/ads', (req, res) => {
  const {position, url} = req.body;
  if (!position || !url) {
    return res.status(400).json({ message: 'Position and URL are required.' });
  } 

  connection.query(
    'INSERT INTO ads (position, url) VALUES (?, ?)',
    [position, url],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating ad.' });
      res.status(201).json({ message: 'Ad created successfully.', id: result.insertId });
    }
  );
});

app.get('/ads', (req, res) => {
  connection.query('SELECT * FROM ads', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching ads.' });
    res.status(200).json(results);
  });
});

app.get('/ads/:id', (req, res) => {
  connection.query('SELECT * FROM ads WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching ad.' });
    if (results.length === 0) return res.status(404).json({ message: 'Ad not found.' });
    res.status(200).json(results[0]);
  });
});

app.patch('/ads/:id', (req, res) => {
  const { position, url } = req.body;
  let fields = [];
  let values = [];
  if (position) { fields.push('position=?'); values.push(position); }
  if (url) { fields.push('url=?'); values.push(url); }
  if (fields.length === 0) return res.status(400).json({ message: 'No fields to update.' });
  values.push(req.params.id);

  connection.query(`UPDATE ads SET ${fields.join(', ')} WHERE id=?`, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating ad.' });
    res.status(200).json({ message: 'Ad updated successfully.' });
  });
});

app.delete('/ads/:id', (req, res) => {
  connection.query('DELETE FROM ads WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting ad.' });
    res.status(200).json({ message: 'Ad deleted successfully.' });
  });
});

app.post('/support', (req, res) => {
  const { name, email, message, status } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }
  const supportStatus = status || 'not_seen';
  connection.query(
    'INSERT INTO support (name, email, message, status) VALUES (?, ?, ?, ?)',
    [name, email, message, supportStatus],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error submitting support message.' });

     
      transporter.sendMail({
        from: EMAIL_USER,
        to: BLOG_EMAIL,
        subject: `New Support Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p>${message.replace(/\n/g, '<br>')}</p>`
      }, (mailErr, info) => {
        if (mailErr) {
          return res.status(201).json({ message: 'Support message submitted, but failed to send email.', id: result.insertId });
        }
        res.status(201).json({ message: 'Support message submitted successfully.', id: result.insertId });
      });
    }
  );
});

app.get('/support', (req, res) => {
  connection.query('SELECT * FROM support', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching support messages.' });
    res.status(200).json(results);
  });
});

app.get('/support/:id', (req, res) => {
  connection.query('SELECT * FROM support WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching support message.' });
    if (results.length === 0) return res.status(404).json({ message: 'Support message not found.' });
    res.status(200).json(results[0]);
  });
});


app.delete('/support/:id', (req, res) => {
  connection.query('DELETE FROM support WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting support message.' });
    res.status(200).json({ message: 'Support message deleted successfully.' });
  });
});


app.post('/support_reply', (req, res) => {
  const { support_id, subject, reply, reply_email } = req.body;
  if (!support_id || !subject || !reply || !reply_email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  connection.query(
    'INSERT INTO support_reply (support_id, subject, reply, reply_email) VALUES (?, ?, ?, ?)',
    [support_id, subject, reply, reply_email],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error sending reply.' });

    
      connection.query(
        'UPDATE support SET status = "replied" WHERE id = ?',
        [support_id],
        (err2) => {
          if (err2) return res.status(500).json({ message: 'Reply sent, but failed to update support status.' });

          
          transporter.sendMail({
            from: `"Blog Support" <${EMAIL_USER}>`,
            to: reply_email,
            subject: subject,
            text: reply,
            html: `<p>${reply.replace(/\n/g, '<br>')}</p>`
          }, (mailErr, info) => {
            if (mailErr) {
              return res.status(201).json({ message: 'Reply sent, but failed to email user.', id: result.insertId });
            }
            res.status(201).json({ message: 'Reply sent and user emailed.', id: result.insertId });
          });
        }
      );
    }
  );
});

app.get('/support_reply/:support_id', (req, res) => {
  connection.query(
    'SELECT * FROM support_reply WHERE support_id = ?',
    [req.params.support_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching support replies.' });
      res.status(200).json(results);
    }
  );
});

app.post('/comment', (req, res) => {
  const { post_id, post_title, comment, commenter, email, in_reply_to } = req.body;
  if (!post_id || !post_title || !comment || !commenter || !email) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  connection.query(
    'INSERT INTO comment (post_id, post_title, comment, commenter, email, in_reply_to) VALUES (?, ?, ?, ?, ?, ?)',
    [post_id, post_title, comment, commenter, email, in_reply_to || 'no'],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating comment.', error: err });

      
      connection.query(
        'SELECT * FROM commenters WHERE email = ?',
        [email],
        (err2, results) => {
          if (err2) return res.status(500).json({ message: 'Error updating commenter.' });
          const now = new Date();
          if (results.length === 0) {
            connection.query(
              'INSERT INTO commenters (name, email, total_comments, first_comment_date, last_comment_date) VALUES (?, ?, ?, ?, ?)',
              [commenter, email, 1, now, now]
            );
          } else {
            connection.query(
              'UPDATE commenters SET total_comments = total_comments + 1, last_comment_date = ? WHERE email = ?',
              [now, email]
            );
          }
        }
      );

      res.status(201).json({ message: 'Comment created.', id: result.insertId });
      const io = req.app.get('io');
io.emit('new_comment', {
  type: 'comment',
  comment: {
    id: result.insertId,
    post_id,
    post_title,
    comment,
    commenter,
    email,
    in_reply_to: in_reply_to || 'no',
    created_at: new Date()
  }
});
    }
  );
});

app.get('/comments', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;
  const email = req.query.email;

  let baseQuery = `
    SELECT c.*, p.title as post_title,
      (SELECT COUNT(*) FROM comment_thread t WHERE t.comment_id = c.id) AS reply_count
    FROM comment c
    LEFT JOIN posts p ON c.post_id = p.id
  `;
  let countQuery = `SELECT COUNT(*) as total FROM comment c`;
  let where = '';
  let params = [];

  if (email) {
    where = 'WHERE c.email = ?';
    params.push(email);
  }

  const orderLimit = `ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  connection.query(
    `${baseQuery} ${where} ${orderLimit}`,
    params,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching comments.' });

     
      connection.query(
        `${countQuery} ${where}`,
        email ? [email] : [],
        (err2, countResults) => {
          if (err2) return res.status(500).json({ message: 'Error fetching total.' });
          res.status(200).json({
            comments: results,
            total: countResults[0].total,
            page,
            limit
          });
        }
      );
    }
  );
});

app.get('/comments/:post_id', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  connection.query(
    'SELECT SQL_CALC_FOUND_ROWS * FROM comment WHERE post_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [req.params.post_id, limit, offset],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching comments.' });
      connection.query('SELECT FOUND_ROWS() as total', (err2, totalResults) => {
        if (err2) return res.status(500).json({ message: 'Error fetching total.' });
        res.status(200).json({
          comments: results,
          total: totalResults[0].total,
          page,
          limit
        });
      });
    }
  );
});

app.get('/comment/:id', (req, res) => {
  connection.query('SELECT * FROM comment WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching comment.' });
    if (results.length === 0) return res.status(404).json({ message: 'Comment not found.' });
    res.status(200).json(results[0]);
  });
});

app.delete('/comment/:id', (req, res) => {
  connection.query('DELETE FROM comment WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting comment.' });
    res.status(200).json({ message: 'Comment deleted.' });
  });
});

app.post('/comment_thread', (req, res) => {
  const { comment_id, thread_comment, thread_commenter, thread_email } = req.body;
  if (!comment_id || !thread_comment || !thread_commenter || !thread_email) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  connection.query(
    'INSERT INTO comment_thread (comment_id, thread_comment, thread_commenter, thread_email) VALUES (?, ?, ?, ?)',
    [comment_id, thread_comment, thread_commenter, thread_email],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error adding to thread.', error: err });

    
      connection.query(
        'SELECT * FROM commenters WHERE email = ?',
        [thread_email],
        (err2, results) => {
          if (err2) return res.status(500).json({ message: 'Error updating commenter.' });
          const now = new Date();
          if (results.length === 0) {
            connection.query(
              'INSERT INTO commenters (name, email, total_comments, first_comment_date, last_comment_date) VALUES (?, ?, ?, ?, ?)',
              [thread_commenter, thread_email, 1, now, now]
            );
          } else {
            connection.query(
              'UPDATE commenters SET total_comments = total_comments + 1, last_comment_date = ? WHERE email = ?',
              [now, thread_email]
            );
          }
        }
      );

      res.status(201).json({ message: 'Thread comment added.', id: result.insertId });
      io.emit('new_comment', {
  type: 'thread',
  comment: {
    id: result.insertId,
    comment_id,
    thread_comment,
    thread_commenter,
    thread_email,
    created_at: new Date()
  }
});
    }
  );
});

app.get('/comment_thread/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const offset = (page - 1) * limit;

  connection.query(
    'SELECT COUNT(*) AS total FROM comment_thread WHERE comment_id = ?',
    [commentId],
    (err, countResults) => {
      if (err) return res.status(500).json({ message: 'Error fetching thread count.' });
      const total = countResults[0].total;

      connection.query(
        'SELECT * FROM comment_thread WHERE comment_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [commentId, limit, offset],
        (err, threads) => {
          if (err) return res.status(500).json({ message: 'Error fetching thread replies.' });
          res.json({ threads, total });
        }
      );
    }
  );
});


app.get('/commenters', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;
  connection.query(
    'SELECT SQL_CALC_FOUND_ROWS * FROM commenters ORDER BY last_comment_date DESC LIMIT ? OFFSET ?',
    [limit, offset],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching commenters.' });
      connection.query('SELECT FOUND_ROWS() as total', (err2, totalResults) => {
        if (err2) return res.status(500).json({ message: 'Error fetching total.' });
        res.status(200).json({
          commenters: results,
          total: totalResults[0].total,
          page,
          limit
        });
      });
    }
  );
});


app.get('/commenters/export', (req, res) => {
  connection.query('SELECT name, email, total_comments, first_comment_date, last_comment_date FROM commenters', (err, results) => {
    if (err) return res.status(500).send('Error exporting commenters.');
    let csv = 'Name,Email,Total Comments,First Comment,Last Comment\n';
    results.forEach(row => {
      csv += `"${row.name}","${row.email}",${row.total_comments},"${row.first_comment_date ? row.first_comment_date.toISOString().slice(0,10) : ''}","${row.last_comment_date ? row.last_comment_date.toISOString().slice(0,10) : ''}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="commenters.csv"');
    res.send(csv);
  });
});
app.get('/commenters/:id', (req, res) => {
  connection.query('SELECT * FROM commenters WHERE id = ?', [req.params.id], (err
, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching commenter.' });
    if (results.length === 0) return res.status(404).json({ message: 'Commenter not found.' });
    res.status(200).json(results[0]);
  });
});

app.get('/commenters/:email', (req, res) => {
  connection.query('SELECT * FROM commenters WHERE email = ?', [req.params.email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching commenter.' });
    if (results.length === 0) return res.status(404).json({ message: 'Commenter not found.' });
    res.status(200).json(results[0]);
  });
});


app.delete('/commenters/:id', (req, res) => {
  connection.query('DELETE FROM commenters WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting commenter.' });
    res.status(200).json({ message: 'Commenter deleted.' });
  });
});


app.get('/admin/dashboard', requireAdminLogin, (req, res) => {
  const user = req.session.user;
  connection.query('SELECT COUNT(*) AS total_posts FROM posts', (err, postResults) => {
    if (err) return res.status(500).send('Error fetching total posts');
    const total_posts = postResults[0].total_posts;

    connection.query('SELECT COUNT(*) AS recent_posts FROM posts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)', (err, recentPostResults) => {
      if (err) return res.status(500).send('Error fetching recent posts');
      const recent_posts = recentPostResults[0].recent_posts;
      const posts_percentage = total_posts > 0 ? Math.round((recent_posts / total_posts) * 100) : 0;

      connection.query('SELECT COUNT(*) AS total_published_posts FROM posts WHERE status = "publish"', (err, publishedResults) => {
        if (err) return res.status(500).send('Error fetching published posts');
        const total_published_posts = publishedResults[0].total_published_posts;

        connection.query('SELECT COUNT(*) AS total_draft_posts FROM posts WHERE status = "draft"', (err, draftResults) => {
          if (err) return res.status(500).send('Error fetching draft posts');
          const total_draft_posts = draftResults[0].total_draft_posts;

          connection.query('SELECT COUNT(*) AS total_comments FROM comment', (err, commentResults) => {
            if (err) return res.status(500).send('Error fetching total comments');
            const total_comments = commentResults[0].total_comments;

            // Add thread comments count here
            connection.query('SELECT COUNT(*) AS total_thread_comments FROM comment_thread', (err, threadResults) => {
              if (err) return res.status(500).send('Error fetching total thread comments');
              const total_thread_comments = threadResults[0].total_thread_comments;

              connection.query('SELECT COUNT(*) AS total_commenters FROM commenters', (err, commenterResults) => {
                if (err) return res.status(500).send('Error fetching total commenters');
                const total_commenters = commenterResults[0].total_commenters;

                connection.query(
  'SELECT id, title, views FROM posts ORDER BY views DESC LIMIT 1',
  (err, mostViewedResults) => {
    if (err) return res.status(500).send('Error fetching most viewed post');
    const most_viewed_post = mostViewedResults[0] || { title: 'No posts', views: 0 };


                connection.query('SELECT COUNT(*) AS recent_comments FROM comment WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)', (err, recentCommentResults) => {
                  if (err) return res.status(500).send('Error fetching recent comments');
                  const recent_comments = recentCommentResults[0].recent_comments;
                  const comments_percentage = total_comments > 0 ? Math.round((recent_comments / total_comments) * 100) : 0;

                 
                  connection.query('SELECT COUNT(*) AS recent_thread_comments FROM comment_thread WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)', (err, recentThreadResults) => {
                    if (err) return res.status(500).send('Error fetching recent thread comments');
                    const recent_thread_comments = recentThreadResults[0].recent_thread_comments;

                    connection.query('SELECT COUNT(*) AS total_categories FROM categories', (err, catResults) => {
                      if (err) return res.status(500).send('Error fetching categories');
                      const total_categories = catResults[0].total_categories;

                      connection.query('SELECT COUNT(*) AS total_tags FROM post_tags', (err, tagResults) => {
                        if (err) return res.status(500).send('Error fetching tags');
                        const total_tags = tagResults[0].total_tags;

                        connection.query(`
                          SELECT p.id, p.title, p.author_id, p.slug, p.status, p.created_at,
                          GROUP_CONCAT(pc.category_id) AS categories
                          FROM posts p
                          LEFT JOIN post_categories pc ON p.id = pc.post_id
                          GROUP BY p.id
                          ORDER BY p.created_at DESC
                          LIMIT 5`,
                          (err, recentPostsResults) => {
                            if (err) return res.status(500).send('Error fetching recent posts');

                            res.render('Admin/dashboard', {
                              user,
                              total_posts,
                              recent_posts,
                              posts_percentage,
                              total_comments,
                              total_thread_comments, 
                              recent_thread_comments,
                              comments_percentage,
                              total_commenters,
                              recent_comments,
                              total_categories,
                              total_tags,
                              total_published_posts,
                              total_draft_posts,
                              recent_posts_data: recentPostsResults,
                              most_viewed_post
                            });
                          }
                        );
                      });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    }
    res.clearCookie('connect.sid');
    res.redirect('/Admin/login');
  });
});

