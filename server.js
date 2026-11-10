require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const booksStore = require('./data/booksStore');
const contactsStore = require('./data/contactsStore');
const ordersStore = require('./data/ordersStore');

const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ORDERS_TO = process.env.ORDERS_TO || process.env.CONTACT_TO || 'libraryseville@gmail.com';
const ORDERS_FROM = process.env.ORDERS_FROM || process.env.CONTACT_FROM || process.env.SMTP_USER || 'libraryseville@gmail.com';

// Resolve admin API key — generate a random one if the default is still set
let ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';
if (!ADMIN_API_KEY || ADMIN_API_KEY === 'change-me') {
    ADMIN_API_KEY = crypto.randomBytes(24).toString('hex');
    console.warn(`⚠  No secure ADMIN_API_KEY configured — generated a temporary key for this session:`);
    console.warn(`   ${ADMIN_API_KEY}`);
    console.warn(`   Set ADMIN_API_KEY in .env to use a persistent key.`);
}

// Trust proxy if behind reverse proxy (helps rate limiting)
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Configure CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.length === 0) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    }
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many contact requests. Please try again later.' }
});

// Rate limiting for API
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please slow down.' }
});

const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many order attempts. Please try again later.' }
});

app.use('/api/', apiLimiter);

// Static files — served from public/ directory (with clean extensionless URLs)
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

// Explicit page routes (guarantees /books, /books/, /contact, /contact/, etc. always load cleanly)
const servePage = (fileName) => (req, res) => res.sendFile(path.join(__dirname, 'public', fileName));

app.get(['/', '/index', '/index.html'], servePage('index.html'));
app.get(['/books', '/books/', '/books.html'], servePage('books.html'));
app.get(['/contact', '/contact/', '/contact.html'], servePage('contact.html'));
app.get(['/order', '/order/', '/order.html'], servePage('order.html'));
app.get(['/admin', '/admin/', '/admin.html'], servePage('admin.html'));

// Telegram Notification Helper (optional)
async function sendTelegramAlert(htmlText) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: htmlText,
                parse_mode: 'HTML'
            })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            console.error('Telegram API error:', data.description || 'Unknown error');
        } else {
            console.log('📱 Telegram notification delivered successfully!');
        }
    } catch (err) {
        console.error('Failed to send Telegram alert:', err.message);
    }
}

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), environment: NODE_ENV });
});

// Books API (public read)
app.get('/api/books', (req, res) => {
    try {
        const books = booksStore.getAll();
        res.json(books);
    } catch (err) {
        console.error('Failed to read books:', err);
        res.status(500).json({ error: 'Failed to load books.' });
    }
});

app.get('/api/books/search', (req, res) => {
    const query = (req.query.q || '').toString().trim().toLowerCase();
    if (!query) return res.status(400).json({ error: "Query parameter 'q' is required." });

    try {
        const books = booksStore.getAll();
        const filtered = books.filter((book) =>
            String(book.title).toLowerCase().includes(query) ||
            String(book.author).toLowerCase().includes(query)
        );
        res.json(filtered);
    } catch (err) {
        console.error('Search failed:', err);
        res.status(500).json({ error: 'Search failed.' });
    }
});

app.get('/api/books/:id', (req, res) => {
    try {
        const book = booksStore.getById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found.' });
        res.json(book);
    } catch (err) {
        console.error('Failed to read book:', err);
        res.status(500).json({ error: 'Failed to load book.' });
    }
});

// Admin auth middleware for CRUD
function requireAdmin(req, res, next) {
    if (!ADMIN_API_KEY) {
        return res.status(403).json({ error: 'Admin access disabled — no API key configured.' });
    }
    const key = req.headers['x-api-key'] || req.query.api_key;
    if (!key || typeof key !== 'string') {
        return res.status(401).json({ error: 'Unauthorized.' });
    }
    const keyBuffer = Buffer.from(key);
    const adminBuffer = Buffer.from(ADMIN_API_KEY);
    if (keyBuffer.length !== adminBuffer.length || !crypto.timingSafeEqual(keyBuffer, adminBuffer)) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }
    next();
}

// Multer configuration for book cover image uploads
const bookCoversDir = path.join(__dirname, 'public', 'output', 'images', 'books');
if (!fs.existsSync(bookCoversDir)) {
    fs.mkdirSync(bookCoversDir, { recursive: true });
}

const coverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, bookCoversDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const cleanBase = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 30);
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e4);
        cb(null, `book-${cleanBase ? cleanBase + '-' : ''}${unique}${ext}`);
    }
});

const uploadCover = multer({
    storage: coverStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedExts = /\.(jpg|jpeg|png|webp|gif|avif)$/i;
        const allowedMimes = /^image\/(jpeg|png|webp|gif|avif)$/i;
        if (allowedExts.test(file.originalname) && allowedMimes.test(file.mimetype)) {
            return cb(null, true);
        }
        cb(new Error('Invalid file type. Only JPG, PNG, WebP, GIF, and AVIF images are allowed.'));
    }
});

// Upload book cover image (admin only)
app.post('/api/upload-cover', requireAdmin, (req, res) => {
    uploadCover.single('coverImage')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File too large. Maximum image size is 5MB.' });
            }
            return res.status(400).json({ error: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ error: err.message || 'Image upload failed.' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Please choose an image file to upload.' });
        }
        const webUrl = `/output/images/books/${req.file.filename}`;
        console.log(`[COVER UPLOAD] Stored: ${req.file.filename} (${req.file.size} bytes)`);
        res.status(200).json({
            success: true,
            url: webUrl,
            filename: req.file.filename,
            size: req.file.size
        });
    });
});

// Books CRUD (admin only)
app.post('/api/books', requireAdmin, async (req, res) => {
    try {
        const { title, author, summary } = req.body || {};
        if (!title || !author) {
            return res.status(400).json({ error: 'Title and author are required.' });
        }
        const book = await booksStore.createBook(req.body);
        res.status(201).json(book);
    } catch (err) {
        console.error('Failed to create book:', err);
        res.status(500).json({ error: 'Failed to create book.' });
    }
});

app.put('/api/books/:id', requireAdmin, async (req, res) => {
    try {
        const book = await booksStore.updateBook(req.params.id, req.body || {});
        if (!book) return res.status(404).json({ error: 'Book not found.' });
        res.json(book);
    } catch (err) {
        console.error('Failed to update book:', err);
        res.status(500).json({ error: 'Failed to update book.' });
    }
});

app.delete('/api/books/:id', requireAdmin, async (req, res) => {
    try {
        const deleted = await booksStore.deleteBook(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Book not found.' });
        res.status(204).send();
    } catch (err) {
        console.error('Failed to delete book:', err);
        res.status(500).json({ error: 'Failed to delete book.' });
    }
});

// Contact form
app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const entry = {
        id: uuidv4(),
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        subject: subject ? String(subject).trim() : '',
        message: String(message).trim(),
        ip: req.ip,
        userAgent: req.get('user-agent') || '',
        createdAt: new Date().toISOString(),
        emailed: false
    };

    try {
        await contactsStore.saveContact(entry);

        // Attempt to email if SMTP is configured
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT) || 587,
                    secure: Number(process.env.SMTP_PORT) === 465,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });

                await transporter.sendMail({
                    from: process.env.CONTACT_FROM || process.env.SMTP_USER,
                    to: process.env.CONTACT_TO || 'libraryseville@gmail.com',
                    subject: `Library of Seville - ${entry.subject || 'New Contact Message'}`,
                    replyTo: entry.email,
                    text: `Name: ${entry.name}\nEmail: ${entry.email}\nSubject: ${entry.subject}\n\n${entry.message}`,
                    html: `<h2>New Contact Message</h2>
                           <p><strong>Name:</strong> ${entry.name}</p>
                           <p><strong>Email:</strong> ${entry.email}</p>
                           <p><strong>Subject:</strong> ${entry.subject || '(none)'}</p>
                           <h3>Message</h3>
                           <p>${entry.message.replace(/\n/g, '<br>')}</p>`
                });
                entry.emailed = true;
            } catch (mailErr) {
                console.error('Failed to send contact email:', mailErr.message);
            }
        }

        // Send Telegram alert if configured
        const escapeHtml = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const tgContactMsg = `💬 <b>New Contact Message</b>\n\n` +
            `👤 <b>Name:</b> ${escapeHtml(entry.name)}\n` +
            `✉️ <b>Email:</b> ${escapeHtml(entry.email)}\n` +
            `📋 <b>Subject:</b> ${escapeHtml(entry.subject || '(none)')}\n\n` +
            `<b>Message:</b>\n${escapeHtml(entry.message)}`;
        await sendTelegramAlert(tgContactMsg);

        console.log(`[CONTACT] ${entry.name} <${entry.email}> - ${entry.subject || 'no subject'}`);
        res.status(200).json({ success: true, message: 'Thank you! We received your message and will get back to you shortly.' });
    } catch (err) {
        console.error('Failed to save contact:', err);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

// Admin: view contacts
app.get('/api/admin/contacts', requireAdmin, (req, res) => {
    try {
        res.json(contactsStore.getAll());
    } catch (err) {
        res.status(500).json({ error: 'Failed to load contacts.' });
    }
});

// Orders
app.post('/api/orders', orderLimiter, async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        wilaya,
        postalCode,
        bookId,
        bookTitle,
        quantity,
        notes
    } = req.body || {};

    if (!firstName || !lastName || !phone || !address || !city || !wilaya) {
        return res.status(400).json({ error: 'Please fill in all required shipping/contact fields.' });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    const order = {
        id: uuidv4(),
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: email ? String(email).trim().toLowerCase() : '',
        phone: String(phone).trim(),
        address: String(address).trim(),
        city: String(city).trim(),
        wilaya: String(wilaya).trim(),
        postalCode: postalCode ? String(postalCode).trim() : '',
        bookId: bookId || null,
        bookTitle: bookTitle ? String(bookTitle).trim() : '',
        quantity: qty,
        notes: notes ? String(notes).trim() : '',
        ip: req.ip,
        userAgent: req.get('user-agent') || '',
        createdAt: new Date().toISOString(),
        status: 'pending',
        emailed: false
    };

    try {
        if (bookId) {
            const book = booksStore.getById(bookId);
            if (book) order.bookTitle = order.bookTitle || book.title;
        }

        await ordersStore.saveOrder(order);

        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT) || 587,
                    secure: Number(process.env.SMTP_PORT) === 465,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });

                await transporter.sendMail({
                    from: ORDERS_FROM,
                    to: ORDERS_TO,
                    replyTo: order.email || undefined,
                    subject: `New Order - Library of Seville - ${order.bookTitle || 'Book Order'}`,
                    text: `Order ID: ${order.id}\n\nCustomer:\n${order.firstName} ${order.lastName}\nPhone: ${order.phone}\n${order.email ? 'Email: ' + order.email + '\n' : ''}\nShipping:\n${order.address}\n${order.city}, ${order.wilaya}\n${order.postalCode ? 'Postal: ' + order.postalCode : ''}\n\nBook: ${order.bookTitle || 'N/A'}\nBook ID: ${order.bookId || 'N/A'}\nQuantity: ${order.quantity}\n\nNotes:\n${order.notes || '(none)'}\n\nPlaced at: ${order.createdAt}`,
                    html: `<h2>New Order Received</h2>
                           <p><strong>Order ID:</strong> ${order.id}</p>
                           <hr>
                           <h3>Customer</h3>
                           <p>${order.firstName} ${order.lastName}<br>Phone: ${order.phone}${order.email ? '<br>Email: ' + order.email : ''}</p>
                           <h3>Shipping Address</h3>
                           <p>${order.address.replace(/\n/g, '<br>')}<br>${order.city}, ${order.wilaya}${order.postalCode ? '<br>Postal Code: ' + order.postalCode : ''}</p>
                           <h3>Order Details</h3>
                           <p><strong>Book:</strong> ${order.bookTitle || 'N/A'}<br><strong>Book ID:</strong> ${order.bookId || 'N/A'}<br><strong>Quantity:</strong> ${order.quantity}</p>
                           <h3>Notes</h3>
                           <p>${order.notes ? order.notes.replace(/\n/g, '<br>') : '(none)'}</p>
                           <hr>
                           <p><small>Placed at: ${order.createdAt}</small></p>`
                });
                order.emailed = true;
            } catch (mailErr) {
                console.error('Failed to send order email:', mailErr.message);
            }
        }

        // Send Telegram alert if configured
        const escapeHtmlOrder = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const tgOrderMsg = `📚 <b>New Order Received!</b>\n\n` +
            `<b>Order ID:</b> <code>${escapeHtmlOrder(order.id.slice(0, 8))}</code>\n` +
            `<b>Book:</b> ${escapeHtmlOrder(order.bookTitle || 'N/A')} (Qty: ${order.quantity})\n\n` +
            `👤 <b>Customer:</b> ${escapeHtmlOrder(order.firstName)} ${escapeHtmlOrder(order.lastName)}\n` +
            `📞 <b>Phone:</b> <code>${escapeHtmlOrder(order.phone)}</code>\n` +
            (order.email ? `✉️ <b>Email:</b> ${escapeHtmlOrder(order.email)}\n` : '') +
            `📍 <b>Address:</b> ${escapeHtmlOrder(order.address)}\n` +
            `🏙️ <b>Wilaya:</b> ${escapeHtmlOrder(order.wilaya)}\n` +
            `🏠 <b>City:</b> ${escapeHtmlOrder(order.city)}\n` +
            (order.notes ? `📝 <b>Notes:</b> ${escapeHtmlOrder(order.notes)}\n` : '') +
            `\n⏰ <b>Time:</b> ${new Date().toLocaleString()}`;
        await sendTelegramAlert(tgOrderMsg);

        console.log(`[ORDER] ${order.id} - ${order.firstName} ${order.lastName} - ${order.bookTitle || 'unknown'}`);
        res.status(200).json({ success: true, message: 'Order placed successfully! We will contact you to confirm delivery details.', orderId: order.id });
    } catch (err) {
        console.error('Failed to place order:', err);
        res.status(500).json({ error: 'Failed to place order. Please try again later.' });
    }
});

// Admin: view orders
app.get('/api/admin/orders', requireAdmin, (req, res) => {
    try {
        res.json(ordersStore.getAll());
    } catch (err) {
        res.status(500).json({ error: 'Failed to load orders.' });
    }
});

// API 404
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
    if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
        return res.status(400).json({ error: 'Invalid JSON body.' });
    }
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error.' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Library of Seville server running on http://localhost:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
        if (!allowedOrigins.length && NODE_ENV === 'production') {
            console.warn('WARNING: ALLOWED_ORIGINS not set in production - CORS allows all origins.');
        }

        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
            console.log(`📱 Telegram notifications: ENABLED (Sending alerts to Chat ID: ${process.env.TELEGRAM_CHAT_ID})`);
        } else {
            console.log(`📱 Telegram notifications: DISABLED (Set TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID in .env)`);
        }

        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            console.log(`✉️  Email delivery: ENABLED (Orders will be sent to: ${ORDERS_TO})`);
        } else {
            console.log(`✉️  Email delivery: DISABLED (No SMTP credentials configured)`);
        }
    });
}

module.exports = app;
