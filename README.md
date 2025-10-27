# Aumvia - Path to Harmony and Growth 🪷

**UK's premier cloud platform for small businesses** - Streamline compliance, HR, rotas, inventory, and staff management with spiritual harmony and modern technology.

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![MongoDB](https://img.shields.io/badge/MongoDB-6.19-green)

---

## 🌟 Features

### **Spiritual-Tech Design System**
- **Deep Indigo (#4A0E8B)** - Spiritual calm and trust
- **Emerald Green (#0B6E4F)** - Growth and prosperity
- **Warm Gold (#D4AF37)** - Enlightenment and wealth
- **Lotus Motifs** - Om symbol integration for harmony
- **Playfair Display + Montserrat** - Elegant, readable typography

### **Core Functionality**
✅ **Dual Authentication Portal** - Separate login/registration for Business Owners and Job Seekers  
✅ **Business Type Selector** - Tailored experiences for Takeaways, Cafés, Off-Licences, Bubble Tea Bars, Restaurants  
✅ **Role-Based Access Control** - Owner, Manager, Employee, Job Seeker roles  
✅ **Responsive Design** - Mobile-first with Tailwind CSS  
✅ **GDPR Compliant** - Full data protection compliance  
✅ **WCAG Accessible** - Keyboard navigation, screen reader support

### **Coming Soon** 🚧
- **Compliance Hub** - Category-specific checklists, document uploads, AI Q&A
- **Staff Swap Marketplace** - Hyper-local shift matching with Google Maps
- **HR & Admin** - Staff directory, leave approvals, contract templates
- **Rota & Timesheets** - Drag-drop weekly builder, CSV/PDF export
- **Inventory Management** - Stock tracking, expiry alerts, reorder lists
- **Reports & Analytics** - Compliance scores, labour costs, dashboards

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd aumvia
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aumvia
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
aumvia/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Home page with hero section
│   │   ├── about/             # About page
│   │   ├── pricing/           # Pricing tiers
│   │   ├── contact/           # Contact form
│   │   ├── login/             # Dual login portal
│   │   ├── register/
│   │   │   ├── business/      # Business registration
│   │   │   └── jobseeker/     # Job seeker registration
│   │   ├── dashboard/         # Business dashboard (protected)
│   │   ├── jobseeker/         # Job seeker dashboard (protected)
│   │   └── api/
│   │       ├── auth/          # NextAuth.js routes
│   │       └── register/      # Registration API routes
│   ├── components/
│   │   ├── Header.tsx         # Navigation with Om logo
│   │   └── Footer.tsx         # Footer with links
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   └── mongodb.ts         # MongoDB connection
│   └── types/
│       └── next-auth.d.ts     # TypeScript definitions
├── public/
│   └── aumvia-logo.png        # Om symbol logo
├── tailwind.config.js         # Custom Aumvia theme
└── .env.example               # Environment variables template
```

---

## 🎨 Design System

### Colors
```css
--color-indigo: #4A0E8B;        /* Primary - Spiritual calm */
--color-emerald: #0B6E4F;       /* Secondary - Growth */
--color-gold: #D4AF37;          /* Accent - Prosperity */
--color-lotus: #F8F1E8;         /* Background - Harmony */
```

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body**: Montserrat (sans-serif, modern)
- **Sizes**: h1 (48px), h2 (36px), h3 (24px), body (16px)

### Components
- **Buttons**: Rounded (border-radius: 50px), gold glow effect
- **Cards**: Spiritual rounded (border-radius: 15px)
- **Icons**: Om symbol, lotus motifs

---

## 🔐 Authentication

### User Roles
1. **Business Owner/Manager** - Full dashboard access
2. **Employee** - Limited access (shifts, documents, timesheets)
3. **Job Seeker** - Profile, nearby shifts, applications

### Registration Flow
**Business:**
1. Select business type (Takeaway, Café, etc.)
2. Enter business details (name, address, postcode)
3. Create account with email/password

**Job Seeker:**
1. Enter personal information
2. Select skills (Food Prep, Barista, etc.)
3. Set location radius (2-20 miles)
4. Choose availability (days of week)

---

## 🗄️ Database Schema

### Collections

**users**
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  role: "business" | "employee" | "jobseeker",
  businessType: String (optional),
  createdAt: Date
}
```

**businesses**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  businessName: String,
  businessType: String,
  address: String,
  postcode: String,
  phone: String,
  complianceScore: Number,
  staff: Array,
  settings: Object,
  createdAt: Date
}
```

**jobseekers**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  phone: String,
  location: {
    postcode: String,
    radius: Number,
    lat: Number,
    lng: Number
  },
  skills: Array,
  availability: Object,
  applications: Array,
  createdAt: Date
}
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB 6.19
- **Authentication**: NextAuth.js v5 (beta)
- **Password Hashing**: bcryptjs
- **Fonts**: Google Fonts (Playfair Display, Montserrat)
- **Deployment**: Vercel (recommended)

---

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial Aumvia setup"
git push origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables (MONGODB_URI, NEXTAUTH_SECRET)
- Deploy!

3. **Update NEXTAUTH_URL**
```env
NEXTAUTH_URL=https://your-domain.vercel.app
```

---

## 🔧 Configuration

### Tailwind Custom Theme
Edit `tailwind.config.js` to customize colors, fonts, animations:
```javascript
colors: {
  indigo: { DEFAULT: '#4A0E8B', dark: '#3A0E6B' },
  emerald: { DEFAULT: '#0B6E4F', dark: '#0A5C3F' },
  gold: { DEFAULT: '#D4AF37', glow: '#E6C756' },
}
```

### ESLint Rules
Modify `eslint.config.mjs` to adjust linting rules:
```javascript
rules: {
  "react/no-unescaped-entities": "off",
  "@typescript-eslint/no-unused-vars": "warn",
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

## 🙏 Acknowledgments

- **Om Symbol** - Representing spiritual harmony and balance
- **UK Small Businesses** - The inspiration behind Aumvia
- **Next.js Team** - For the amazing framework
- **Vercel** - For seamless deployment

---

## 📞 Support

- **Email**: support@aumvia.co.uk
- **Documentation**: [Coming Soon]
- **Live Chat**: Available Mon-Fri, 9am-6pm GMT

---

**Made with harmony in the UK** 🇬🇧 | © 2025 Aumvia. All rights reserved.
