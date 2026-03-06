
# 🎨 Xtreme Kolorz: Automotive Pearl Pigments E‑Commerce Frontend

A high‑performance, modern, and fully responsive automotive paint e‑commerce frontend built using **React + Tailwind CSS**, featuring an admin panel, complete shopping flow, product catalog, and mock backend API structure.

---

## 🚀 Key Features

### 🛒 Full E‑Commerce Flow  
- Browse Products → Add to Cart → Checkout (Simulated)  
- Persistent cart state  
- Quantity control & item removal  

### 🎨 Advanced Product Catalog  
- 6 Pearl Series Categories:  
  - Solid Pearls  
  - Interference Pearls  
  - Carbon Pearls  
  - OEM+ Pearls  
  - Special Effect Pearls  
  - Chroma Pearls  
- Deep Linking: Selecting a category on Home automatically filters the Shop page.

### 🛠 Admin Panel (Mock API)  
- Product Management  
- Create / Update / Delete products  
- Sales analytics (mocked)  
- Dashboard with KPIs and sales history  
- Secured login using a mock authentication layer  

### 📱 Responsive UI  
- Fully responsive layout  
- Built with Tailwind CSS utility classes  
- Modern design inspired by automotive paint brands  

---

## 🧩 Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | **React** |
| Styling | **Tailwind CSS** |
| Routing | **React Router DOM** |
| Icons | **Lucide React** |
| State Management | **useState, useContext** |
| Backend Simulation | **Custom Mock API Layer (client-side)** |
| Build Tool | **Vite** |

---

## 🛑 Backend Simulation (Important)

This project **does NOT include a real backend**.

All admin-related API calls use a **mock API system** that simulates a Node.js/Express + MongoDB server.

If you deploy this application and try to use admin CRUD:

👉 You must create a real backend and implement these routes:

### API Endpoints

## 📍 Application Routes

| Route | Page | Description |
|-------|--------|-------------|
| `/` | **Home.jsx** | Main landing page, showcasing featured products and categories. |
| `/shop` | **Shop.jsx** | Full product catalog with filtering and sorting controls. |
| `/product/:id` | **ProductPage.jsx** | Individual product detail page with specifications and recommendations. |
| `/cart` | **Cart.jsx** | Shopping cart review and quantity management page. |
| `/checkout` | **Checkout.jsx** | Simulated multi-step checkout process. |
| `/about` | **About.jsx** | Company history, mission, and core principles. |
| `/services` | **Services.jsx** | Business solutions (Partner Program, Distribution) and customer testimonials. |
| `/contact` | **Contact.jsx** | Contact information and inquiry form. |



| Feature | Method | Endpoint | Used In |
|--------|---------|-----------|---------|
| Admin Login | POST | *(local mock inside AuthContext)* | AdminLogin.jsx |
| Get Products | GET | `/products` | AdminProducts.jsx |
| Create Product | POST | `/products` | AdminProducts.jsx |
| Update Product | PUT | `/products/:id` | AdminProducts.jsx |
| Delete Product | DELETE | `/products/:id` | AdminProducts.jsx |
| Dashboard KPIs | GET | `/dashboard/kpis` | AdminDashboard.jsx |
| Sales History | GET | `/dashboard/history` | AdminDashboard.jsx |

---

## 🔑 Admin Panel Access

### Routes  
| Page | URL | Description |
|------|------|-------------|
| Admin Login | `/admin` | Entry point |
| Dashboard | `/admin/dashboard` | Sales metrics + KPIs |
| Product Manager | `/admin/products` | CRUD interface |

### Mock Credentials  
| Field | Value |
|-------|--------|
| Access Code | **xtreme2025** |

Entering this code triggers a successful login in the mock API.

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd Painting-Shop/Frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start Development Server (Vite)
```bash
npm run dev
```

---

## 📁 Project Structure

```
Frontend/
│── src/
│   ├── pages/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── assets/
│   └── App.jsx
│
└── public/
```

---

## 🧪 Build for Production
```bash
npm run build
```

---

## 🌐 Deployment Notes (Vercel)

- Ensure **import paths match exact case** (Linux is case‑sensitive)  
- Real backend is required for production admin features  
- Use environment variables for backend URL once implemented  

---

## 🎯 Future Improvements
- Real MongoDB + Express backend  
- JWT-based admin authentication  
- Order placement + order API  
- Payment gateway integration (Razorpay / Stripe)

---

## ❤️ Author
Made by **Mahesh Patil**  
Frontend Developer | Automotive Tech Enthusiast

---

## 📜 License
MIT License  
Free to use, modify, and distribute.

