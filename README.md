# Kidemia Frontend

Kidemia is a modern, user-friendly web application designed to deliver engaging educational and interactive experiences for children, parents, and educators. This repository contains the **frontend** codebase for the Kidemia platform.

---

## 🚀 Overview

The Kidemia frontend focuses on:

* Clean, intuitive UI/UX suitable for children and parents
* High performance and responsiveness across devices
* Scalable, component-driven architecture
* Seamless integration with backend APIs

---

## 🧱 Tech Stack

* **Framework:** React / tailwind
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** Tanstack & Jotail
* **Data Fetching:** Axios by OpenAPI
* **Form Handling:** React Hook Form
* **Validation:** Zod 
* **Icons:** Lucide & Heroicons
* **Linting & Formatting:** ESLint, Prettier

---

## 📁 Project Structure

```text
kidemia-frontend/
├─ public/                 # Static assets
├─ src/
│  ├─ components/          # Reusable UI components
│  ├─ layouts/             # App layouts
│  ├─ pages/ or app/       # Pages / routes
│  ├─ features/            # Feature-based modules
│  ├─ hooks/               # Custom React hooks
│  ├─ services/            # API & external services
│  ├─ store/               # Global state management
│  ├─ styles/              # Global styles
│  ├─ utils/               # Utility functions
│  └─ types/               # Type definitions
├─ .env.example            # Environment variables sample
├─ README.md
└─ package.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` (or `.env`) file based on `.env.example`:

```env
API_BASE_URL=https://api.kidemia.com
```

> ⚠️ Never commit real environment variables to version control.

---

## 🛠️ Installation

### Prerequisites

* Node.js >= 18
* npm / yarn / pnpm

### Steps

```bash
# Clone repository
git clone https://github.com/Bigtink-Digtial-Creation/kidemiafrontend

# Enter directory
cd kidemiafrontend

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
```

The app will be available at: **[http://localhost:5173](http://localhost:5173)**

---

## 📦 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

```bash
 curl http://localhost:8080/api/openapi.json -o ./src/sdk/openapi.json

 npm run gen-sdk 
```

---

## 🎨 UI & Design Principles

* Child-friendly colors and spacing
* Large tap targets for mobile
* Clear visual hierarchy
* Accessible contrast and typography
* Consistent design system

---

## 🔐 Authentication & Authorization

* Token-based authentication (JWT)
* Role-based UI rendering (e.g., Parent, Child, Admin)
* Secure storage via HTTP-only cookies or secure storage

---

## 🌐 API Integration

* Centralized API service layer
* Automatic token attachment
* Global error handling
* Loading & empty states

 

---

## 🧪 Testing (Optional / Recommended)

* Unit Tests: Jest / Vitest
* Component Tests: React Testing Library
* E2E Tests: Playwright / Cypress

```bash
npm run test
```

---

## 🚀 Deployment

Kidemia frontend can be deployed on:

* GCP (recommended)
* Vercel 
* Netlify
* AWS 

```bash
npm run build
```

---

## 📈 Performance & Optimization

* Code splitting & lazy loading
* Image optimization
* Memoized components
* Minimal re-renders

---

## 🧩 Contribution Guidelines

1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Write clear commit messages
5. Submit a pull request

---

## 🐛 Bug Reporting

* Use GitHub Issues
* Provide clear steps to reproduce
* Include screenshots if applicable

---

## 📄 License

This project is proprietary and owned by **Kidemia**.
Unauthorized copying, distribution, or use is prohibited unless explicitly permitted.

---

## 👥 Team & Ownership

* Product: Kidemia
* Frontend Architecture: Kidemia Engineering Team

---

## 📞 Support

For support or inquiries:

* Email: [support@kidemia.com](mailto:support@kidemia.com)
* Website: [https://kidemia.com](https://kidemia.com)

---

**Kidemia – Learning made joyful.** 🌈
