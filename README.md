<!-- Modern README for NeoFi App -->

<p align="center">
  <img src="https://i.imgur.com/placeholder-image.png" alt="NeoFi Logo" width="120"/>
</p>

<h1 align="center">NeoFi</h1>
<p align="center">
  <b>Modern Budget Tracking App</b><br>
  <a href="https://github.com/Xenonesis/NeoFi"><img src="https://img.shields.io/github/stars/Xenonesis/NeoFi?style=flat-square" alt="GitHub stars"></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel" alt="Vercel"></a>
  <img src="https://img.shields.io/badge/Version-0.50.0-blue?style=flat-square">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square">
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## 🚀 Overview

NeoFi is a fully responsive, AI-powered budget tracking application built with Next.js, React, ShadCN UI, and Firebase. It offers advanced analytics, multi-currency support, and a seamless experience across devices.

---

## ✨ Demo

> **Live Demo:** _Coming Soon_  
> ![App Screenshot](https://i.imgur.com/placeholder-image.png)

---

## 🏆 Key Features

| Feature                        | Description                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| 🔮 AI Insights                 | Smart spending pattern detection and personalized financial advice                          |
| 📊 Advanced Analytics          | Predictive forecasts, interactive charts, and detailed reports                             |
| 🌎 Multi-Currency              | Track budgets in multiple currencies with real-time conversion                             |
| 📱 Mobile Optimized            | Native-feeling interactions and responsive design for all devices                          |
| 🔔 Smart Notifications         | Budget alerts, bill reminders, and actionable insights                                     |
| 🔒 Secure Authentication       | Firebase Auth with robust security and privacy controls                                    |
| 🗃️ Data Export                 | Export your data as PDF, Excel, or CSV                                                     |
| 🌙 Dark Mode                   | Enhanced dark mode with improved contrast and readability                                  |
| ⚡ Performance                  | 40% faster load times, optimized data handling, and smooth UI animations                   |

---

## 📅 Version Timeline

| Version   | Date         | Highlights                                                                                      |
|-----------|--------------|------------------------------------------------------------------------------------------------|
| 0.50.0    | 2025-07-10   | Advanced analytics, multi-currency, export, notifications, performance, mobile optimization    |
| 0.40.0    | 2025-07-09   | Security, UI updates, customization, integrations, chart visualizations, backup system        |
| 0.30.0-a  | 2025-07-09   | AI insights, UI redesign, mobile UX, natural language search, real-time sync, custom categories|
| 0.20.0-a  | 2025-07-07   | International support, ML advisory, dashboard widgets                                         |
| 0.10.0-a  | 2025-07-05   | Initial release, basic tracking, dashboard, mobile responsive                                 |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **UI Components:** ShadCN UI
- **Backend & Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Charts:** Recharts
- **State Management:** React Context API, Zustand

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ and npm 9+ (or yarn)
- Firebase account
- Git

### Installation

```bash
git clone https://github.com/Xenonesis/NeoFi.git
cd NeoFi
npm install
# or
yarn install
```

### Environment Setup

1. Copy `.env.template` to `.env.local` and fill in your Firebase credentials:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    ```
2. These variables are required for the app to build and run.

### Run Locally

```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔥 Firebase Setup

- Create a Firebase project
- Enable Authentication and Firestore
- Configure authentication providers and Firestore rules
- See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for details

---

## ☁️ Deployment

- Deploy easily to [Vercel](https://vercel.com/)
- Add environment variables in the Vercel dashboard
- See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for step-by-step instructions

---

## 🎨 UI/UX Highlights

- Modern, accessible design with ShadCN UI
- Responsive layouts for all devices
- Interactive charts and smooth animations
- Enhanced dark mode and color contrast
- Customizable dashboard widgets

---

## 🧠 Performance & Optimization

- React.memo and stateless components for fast rendering
- Virtualized lists and batched state updates
- Optimized database queries and pagination
- Passive event listeners and throttled operations

---

## 🤝 Contributing

Contributions are welcome!  
Please open issues or submit pull requests for improvements.

---

## 📄 License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

- **Aditya Kumar Tiwari**
  - [Email](mailto:itisaddy7@gmail.com)
  - [LinkedIn](https://www.linkedin.com/in/itisaddy/)
  - [Instagram](https://www.instagram.com/i__aditya7/)
  - [Portfolio](https://iaddy.netlify.app/)
