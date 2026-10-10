# 🏅 AeroSport Pro — All-In-One Sports, Health, Fitness & Shop Platform

**AeroSport Pro** is a modern full-stack web application combining sports event management, marathon registration, bicycle competitions, mini football pitch & gym hall booking, personal trainer discovery & hiring, and a comprehensive sports equipment e-commerce store.

---

## 🚀 Live Services & Ports
- **Frontend URL:** [http://localhost:5174](http://localhost:5174) (or [http://localhost:5173](http://localhost:5173))
- **Backend API:** [http://localhost:5050/api](http://localhost:5050/api)
- **MongoDB Database:** `mongodb://127.0.0.1:27017/sportshub`

---

## 🛠️ Technology Stack

### Frontend
- **Framework & Bundler:** Vite + React (JavaScript)
- **Styling:** Tailwind CSS (modern athletic dark-mode glassmorphism, responsive, mobile-first)
- **Icons:** Lucide React
- **HTTP Client:** Axios (configured with base URL, timeout, and JWT request interceptor)
- **State Management:** React Context API (`AuthContext`, `CartContext`)

### Backend
- **Runtime:** Node.js (v24+)
- **Server:** Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs password hashing
- **Middleware:** CORS, dotenv, protect/admin auth guards
- **API Architecture:** Clean RESTful controllers and modular routers

---

## 🌟 Key Features

### 1. 🏠 Modern Home Page
- **Athletic Hero Section:** Bold headline, live community badges, action CTAs, and quick stats counters (25+ Races, 18+ Venues, 50+ Coaches, 1,000+ Products).
- **Popular Sports Grid:** One-click shortcuts for Football, Running & Marathons, Cycling, Gym & Strength, Yoga, and Boxing.
- **Featured Marathons & Bicycle Races:** Live participant counts, distance pills, difficulty badges, and quick-join buttons.
- **Field & Gym Venue Highlights:** Showcase of mini soccer fields and strength halls with available slots.
- **Recommended Sports Gear:** Trending products with reviews, pricing, discounts, and rapid add-to-cart.
- **Top Certified Trainers:** Coach spotlights with verified credentials and ratings.
- **Dual Call-to-Action:** Direct banners for organizing races and booking evening football matches.

### 2. 🏃 Sports Events & Competitions
- **Marathons & Running Races:** View upcoming 42.2K full marathons, 21.1K half marathons, 10K sunrise runs, and 50K ultra trail runs.
- **Bicycle Competitions:** Discover road cycling grand tours, mountain bike challenges, and urban glow night rides.
- **Join / Register:** Single-click registration with participant counters and duplicate prevention.
- **Plan / Create Event:** Modal for users to publish new marathons or cycling competitions with distance, elevation gain, fee, difficulty, and prizes.
- **Search & Filters:** Real-time search by keyword, city, sport type (Marathons vs Cycling), and difficulty level.

### 3. ⚽ Field and Gym Booking
- **Mini Football Fields:** 5v5 and 6v6 synthetic turf pitches (FIFA-approved turf, LED floodlights, locker rooms, showers).
- **Gyms & Multi-Sport Halls:** Strength facilities, Olympic barbell decks, maple hardwood basketball & volleyball courts.
- **Interactive Time Slot Reservation:** Pick date, view real-time available time slots with booked slot disabling, enter contact details, and get instant reservation confirmation.
- **Cancel Booking:** Users can cancel active bookings directly from their profile dashboard.

### 4. 🏋️ Personal Trainers
- **Coach Directory:** Browse trainers specializing in Marathon Prep, Football Agility, CrossFit, Hypertrophy, Mobility Yoga, and Road Cycling.
- **Trainer Profiles:** Experience years, client rating, hourly rate, verified certifications, availability days, and bio.
- **Session Request Form:** Send structured coaching inquiries with fitness targets, preferred schedule, and personalized messages.

### 5. 🛍️ Performance Sports Shop
- **Complete Sports Catalog:** Products across required disciplines:
  - Football equipment (Match balls, goalkeeper gloves)
  - Basketball equipment (Composite leather official balls)
  - Volleyball equipment (FIVB compliant championship balls)
  - Running shoes (Carbon-plate racing shoes)
  - Sports clothes (Moisture-wicking compression suits)
  - Fitness equipment & Dumbbells (Adjustable 24kg dumbbells, workout benches)
  - Yoga products (Eco cork non-slip mats & blocks)
  - Cycling equipment & Bicycle accessories (Aero MIPS helmets, 1200LM smart headlights)
  - Boxing equipment (Leather 14oz sparring gloves)
  - Swimming equipment (Polarized UV400 swim goggles)
  - Gym accessories & Bags & Water bottles (45L waterproof shoe-pocket duffels, stainless insulated bottles)
  - Fitness watches (GPS multi-sport endurance smartwatch)
- **Filtering & Search:** Instant filter by category, price ranges, sort by Price/Rating/Featured, and search bar.
- **Product Details Modal:** High-res images, spec bullet points, stock counter, and quantity controller.
- **Cart & Checkout Drawer:**
  - Persistent cart stored in `localStorage`
  - Stepper quantity adjustment (+/-) and remove
  - Promo discount codes (e.g. `SPORT20` for 20% OFF or `FIT10` for 10% OFF)
  - Shipping address and payment method (Credit Card, Cash on Delivery, Apple Pay)
  - Instant order placement and receipt tracking

### 6. 🔐 Authentication & Protected Athlete Dashboard
- **JWT Auth:** Register, Sign In, and Logout with tokens stored securely and synced across tabs.
- **One-Click Demo Athlete Login:** Instant access via pre-seeded account `alex@example.com` / `password123`.
- **Protected Profile Tabs:**
  1. **My Orders:** Order history, tracking status, items purchased, totals, and delivery addresses.
  2. **My Bookings:** Active and past pitch/gym slots, date, time, and cancellation action.
  3. **My Event Registrations:** Joined marathons and bike races with dates and distance.
  4. **My Trainer Inquiries:** Status tracking for coaching requests.
  5. **Edit Profile:** Update name, phone, bio, height, weight, and primary fitness goal.

---

## 📂 Project Directory Structure

```text
HAKATON/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile update
│   │   ├── productController.js   # Products filter, search, details
│   │   ├── orderController.js     # Checkout and order history
│   │   ├── eventController.js     # Marathons, cycling, join & create
│   │   ├── bookingController.js   # Fields/gyms, booked slots, reserve
│   │   └── trainerController.js   # Coaches, request sessions
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT token guard & admin guard
│   ├── models/
│   │   ├── User.js                # User schema & bcrypt hashing
│   │   ├── Product.js             # Sports gear schema & categories
│   │   ├── Order.js               # Orders schema & items
│   │   ├── Event.js               # Marathons & Cycling competitions
│   │   ├── Facility.js            # Mini football fields & Gym halls
│   │   ├── Booking.js             # Slot booking reservations
│   │   ├── Trainer.js             # Coach profiles & credentials
│   │   └── TrainerRequest.js      # Coaching inquiry requests
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── trainerRoutes.js
│   ├── seed/
│   │   └── seedData.js            # Rich dataset with 16 products, 6 venues, 6 events, 6 coaches
│   ├── .env                       # PORT=5050, MONGODB_URI, JWT_SECRET
│   ├── package.json
│   └── server.js                  # Main Express entry point & auto-seeder
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosClient.js     # Axios with base URL & JWT interceptor
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state, login, register, demo login
│   │   │   └── CartContext.jsx    # Cart state, discount coupons, toast alerts
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Responsive navbar with brand & cart badge
│   │   │   ├── Footer.jsx         # Athletic footer with categories & newsletter
│   │   │   ├── Hero.jsx           # Sporty hero with CTAs and live stats
│   │   │   ├── EventCard.jsx      # Marathon & bike race card
│   │   │   ├── FacilityCard.jsx   # Field & gym card with price & surface
│   │   │   ├── TrainerCard.jsx    # Coach card with rating & specialties
│   │   │   ├── ProductCard.jsx    # Shop card with quick add-to-cart
│   │   │   ├── CartDrawer.jsx     # Slide-over cart with checkout & coupon
│   │   │   ├── BookingModal.jsx   # Live slot booking with conflict check
│   │   │   ├── EventModal.jsx     # Full event detail & registration
│   │   │   ├── CreateEventModal.jsx # Plan/create marathon or race
│   │   │   ├── TrainerModal.jsx   # Coach bio and session request form
│   │   │   ├── ProductDetailModal.jsx # Product specifications & quantity
│   │   │   └── Toast.jsx          # Interactive floating alert notifications
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Unified sports platform landing
│   │   │   ├── EventsPage.jsx     # Marathons and cycling hub
│   │   │   ├── FacilitiesPage.jsx # Pitch & gym booking directory
│   │   │   ├── TrainersPage.jsx   # Coach directory & inquiry hub
│   │   │   ├── ShopPage.jsx       # Comprehensive sports store
│   │   │   ├── LoginPage.jsx      # Athlete sign in with demo login
│   │   │   ├── RegisterPage.jsx   # Athlete registration
│   │   │   └── ProfilePage.jsx    # Protected dashboard (orders, bookings, races, coaches)
│   │   ├── App.jsx                # Main application coordinator
│   │   ├── index.css              # Tailwind v4 import & glassmorphism theme
│   │   └── main.jsx               # React 19 root with Providers
│   ├── package.json
│   ├── vite.config.js             # Vite + Tailwind v4 + API proxy
│   └── index.html
├── package.json                   # Root orchestrator
└── README.md
```

---

## 🏃 Quick Start Guide

### 1. Start the Backend
```bash
cd backend
npm install
npm run seed     # (Optional: seeds or resets rich demo data)
npm run dev      # Runs Express on http://localhost:5050
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev      # Runs Vite on http://localhost:5174 (or 5173)
```

---

## 🔑 Demo Account Credentials
- **Athlete Email:** `alex@example.com`
- **Password:** `password123`
*(Or simply click the **"Quick Demo Login"** button on the navbar or login screen for instant access!)*
