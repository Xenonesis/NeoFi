<!-- Modern README for NeoFi App -->

<p align="center">
  <img src="public/images/neo-fi-logo.png" alt="NeoFi Logo" width="120"/>
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

NeoFi is a cutting-edge, AI-powered budget tracking application designed to help users manage their finances efficiently and effectively. Built with Next.js, React, ShadCN UI, and Firebase, NeoFi offers a range of features including advanced analytics, multi-currency support, and a seamless experience across devices. Whether you're a student, professional, or entrepreneur, NeoFi provides the tools you need to stay on top of your finances.

---

## ✨ Demo

> **Live Demo:** _Coming Soon_

![App Screenshot](public/images/dashboard-ai-insights.png)

---

## 🏆 Key Features

NeoFi is packed with features designed to simplify and enhance your budgeting experience:

| Feature                        | Description                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| 🔮 **AI Insights**             | Gain smart spending pattern detection and personalized financial advice to optimize your budget. |
| 📊 **Advanced Analytics**      | Get predictive forecasts, interactive charts, and detailed reports to understand your financial health. |
| 🌎 **Multi-Currency Support**  | Track budgets in multiple currencies with real-time conversion rates for accurate financial management. |
| 📱 **Mobile Optimization**     | Enjoy native-feeling interactions and responsive design on all devices, ensuring a seamless experience. |
| 🔔 **Smart Notifications**     | Receive budget alerts, bill reminders, and actionable insights to keep you informed and proactive. |
| 🔒 **Secure Authentication**   | Benefit from Firebase Auth with robust security and privacy controls to protect your data. |
| 🗃️ **Data Export**            | Easily export your data as PDF, Excel, or CSV for offline analysis and record-keeping. |
| 🌙 **Dark Mode**               | Experience enhanced dark mode with improved contrast and readability for better visibility. |
| ⚡ **Performance**             | Enjoy 40% faster load times, optimized data handling, and smooth UI animations for a fluid user experience. |

---

## 📅 Version Timeline

Discover the evolution of NeoFi through its version timeline:

| Version   | Date         | Highlights                                                                                      |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------ |
| 0.50.0    | 2025-07-10   | Introduced advanced analytics, multi-currency support, data export, notifications, performance improvements, and mobile optimization. |
| 0.40.0    | 2025-07-09   | Enhanced security, UI updates, customization options, integrations, chart visualizations, and a backup system. |
| 0.30.0-a  | 2025-07-09   | Added AI insights, a redesigned UI, improved mobile UX, natural language search, real-time sync, and custom categories. |
| 0.20.0-a  | 2025-07-07   | Introduced international support, machine learning advisory, and dashboard widgets for better organization. |
| 0.10.0-a  | 2025-07-05   | Launched the initial version with basic tracking, a user-friendly dashboard, and mobile responsiveness. |

---

## 🛠️ Tech Stack

NeoFi leverages a robust tech stack to deliver a powerful and efficient application:

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **UI Components:** ShadCN UI
- **Backend & Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Charts:** Recharts
- **State Management:** React Context API, Zustand

---

## ⚙️ Getting Started

Ready to get started with NeoFi? Follow these steps:

### Prerequisites

- Node.js 18+ and npm 9+ (or yarn)
- Firebase account
- Git

### Installation

Clone the repository and install dependencies:

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

2. These variables are essential for the app to build and run correctly.
3. **Security:** Never commit actual secrets to version control. Refer to [SECURITY.md](./SECURITY.md) for best practices.

### Run Locally

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see NeoFi in action.

---

## 🔥 Firebase Setup

To set up Firebase for NeoFi:

- Create a Firebase project.
- Enable Authentication and Firestore.
- Configure authentication providers and Firestore rules.
- Refer to [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

---

## ☁️ Deployment

Deploy NeoFi easily to Vercel:

- Deploy to [Vercel](https://vercel.com/).
- Add environment variables in the Vercel dashboard.
- Follow [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for step-by-step deployment instructions.

---

## 🎨 UI/UX Highlights

NeoFi focuses on delivering a modern, accessible, and intuitive user experience:

- **Modern Design:** Utilizes ShadCN UI for a sleek and modern look.
- **Responsive Layouts:** Ensures a seamless experience across all devices.
- **Interactive Charts:** Provides detailed and interactive visualizations for better understanding.
- **Enhanced Dark Mode:** Offers improved contrast and readability in dark mode.
- **Customizable Dashboard:** Allows users to tailor their dashboard to their preferences.

---

## 🧠 Performance & Optimization

NeoFi is optimized for speed and efficiency:

- **React.memo and Stateless Components:** Ensures fast rendering and optimal performance.
- **Virtualized Lists and Batched State Updates:** Improves performance with large datasets.
- **Optimized Database Queries and Pagination:** Minimizes load times and enhances user experience.
- **Passive Event Listeners and Throttled Operations:** Reduces resource usage and improves responsiveness.

---

## 🤝 Contributing

We welcome contributions from the community! Feel free to open issues or submit pull requests to help improve NeoFi.

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
