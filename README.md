# Library of Seville 📚

### 📖 About the Project

**Library of Seville (مكتبة إشبيلية)** is a modern online bookstore built specifically for the Algerian market. Drawing inspiration from Seville’s 300-year legacy as an intellectual and cultural capital of Al-Andalus, the platform combines timeless literary appreciation with a lightweight, secure web architecture.

#### 🌟 Key Highlights:
- **🌍 Native Bilingual Experience**: Seamless live switching between English and Arabic (`dir="rtl"`) with localized book metadata.
- **🚚 Algerian Logistics Ready**: Custom checkout flow covering all **69 official administrative wilayas of Algeria** with bilingual region selection.
- **📱 Instant Mobile Order Alerts**: Integrated with Telegram Bot API to deliver new customer orders and messages straight to the owner's phone in real time.
- **📸 Device Image Uploads**: Interactive admin dashboard with live image previews and direct photo uploads from phone/PC for new book additions.
- **🛡️ Built-in Security**: Includes rate limiting (anti-spam / anti-flood), `helmet` security headers, sanitized file uploads, and timing-safe admin authentication.
- **🎨 Modern Design System**: Responsive layout with automatic system-preference detection and an instant Dark/Light mode switcher.
- **⚡ Fast & Dependency-Light**: Powered by Express 5 on the backend and pure, framework-free Vanilla HTML5, CSS3, and JavaScript on the frontend.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer)
- npm (bundled with Node.js)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/zakariaSHKI/library-of-seville-V2.git
cd library-of-seville-V2
npm install
```

### 3. Environment Setup
Copy `.env.example` to create your own `.env`:
```bash
cp .env.example .env
```
Open `.env` and configure your settings:
- `ADMIN_API_KEY`: A secure key used to access the admin dashboard at `/admin.html`.
- `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID`: (Optional) Your Telegram bot credentials for instant mobile order alerts.
- `ORDERS_TO`: Your email address for customer orders (`libraryseville@gmail.com`).

### 4. Running the Website
Start the development server:
```bash
npm start
```
The website will be live at:
👉 **http://localhost:3000**

---

## 📁 Project Structure

```
├── data/
│   ├── booksStore.js       # Book data access logic
│   ├── booksStore.json     # Initial catalog data
│   ├── contactsStore.js    # Contact storage logic
│   └── ordersStore.js      # Order storage logic
├── public/                 # Static web assets served to visitors
│   ├── index.html          # Homepage with featured books
│   ├── books.html          # Full catalog & search
│   ├── order.html          # Order placement form (69 wilayas)
│   ├── contact.html        # Contact & inquiry form
│   ├── admin.html          # Admin dashboard & book manager
│   ├── styles.css          # Design system, themes & typography
│   ├── i18n.js             # Internationalization engine (EN/AR)
│   ├── theme.js            # Dark/Light mode engine
│   ├── nav.js              # Mobile navigation handler
│   └── output/images/      # Bookstore logo and book covers
├── .env.example            # Environment variables template
├── .gitignore              # Files excluded from Git tracking
├── package.json            # Project dependencies & scripts
└── server.js               # Express 5 backend server
```

---

## 📄 License
ISC License.
