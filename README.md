# NeoFi App by Aditya Kumar Tiwari

A fully responsive budget tracking application built with Next.js, React, ShadCN UI, and Firebase.

## Contact Information

- **Email:** itisaddy7@gmail.com
- **LinkedIn:** [https://www.linkedin.com/in/itisaddy/](https://www.linkedin.com/in/itisaddy/)
- **Instagram:** [https://www.instagram.com/i__aditya7/](https://www.instagram.com/i__aditya7/)
- **Portfolio:** [https://iaddy.netlify.app/](https://iaddy.netlify.app/)

## Version 0.30.0 - Alpha Release

**Released: July 8, 2025**

### Version Timeline

#### 0.30.0-alpha (July 8, 2025)
- Initial alpha release
- Core functionality implementation
- **AI-Powered Financial Insights** with smart spending pattern detection
- **Completely Redesigned User Interface** with modern aesthetic
- **Enhanced Mobile Experience** with native-feeling interactions
- **Natural Language Transaction Search** for intuitive data filtering

#### 0.20.0-alpha (July 7, 2025)
- Early alpha release
- Basic features implementation
- **Expanded International Support** with multiple currencies
- **Personalized Financial Advisory** using machine learning
- **Customizable Dashboard Widgets** with drag-and-drop functionality

#### 0.10.0-alpha (July 5, 2025)
- Initial project setup and foundation
- Basic transaction tracking and management
- Simple dashboard with essential financial overview
- Initial mobile-responsive design implementation

## Features

### Core Functionality
- AI-Powered Financial Insights with smart spending pattern detection
- Completely Redesigned User Interface with modern aesthetic
- Enhanced Mobile Experience with native-feeling interactions
- Natural Language Transaction Search for intuitive data filtering
- Expanded International Support with multiple currencies
- Personalized Financial Advisory using machine learning
- Customizable Dashboard Widgets with drag-and-drop functionality

### Performance
- Optimized for fast loading and smooth interactions
- Efficient data handling and state management
- Responsive design for all device sizes
- Improved brand visibility and contrast across all themes
- Implemented interactive hover animations for enhanced user experience
- Added custom gradient effects for brand text with optimized performance

## Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- Firebase account for authentication and database
- Git for version control

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Xenonesis/NeoFi.git
   cd NeoFi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### User Experience Improvements
- Enhanced chart readability in dark mode with proper text contrast
- More robust error handling for calculation edge cases
- Improved handling of empty transaction data
- Better type checking in chart components
- Optimized monthly data processing for more accurate financial trends

## Important: Environment Setup Required

**Before building or deploying this project:**

1. Create a `.env.local` file in the root directory with your Firebase credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

2. You can use the provided `.env.template` file as a reference.

3. These environment variables are required for the application to function properly. Without them, the build will fail.

![NeoFi App](https://i.imgur.com/placeholder-image.png)

## Features

- **User Authentication**: Secure login and registration with Firebase Auth
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Budget Planning**: Set and monitor spending limits by category
- **Data Visualization**: Track financial patterns with charts and reports
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Switch between light and dark themes
- **Data Security**: Built-in row-level security ensures users can only access their own data

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI
- **Backend & Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Charts & Visualization**: Recharts
- **State Management**: React Context API, Zustand
- **Styling**: Tailwind CSS with CSS variables for theming

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Xenonesis/NeoFi.git
cd NeoFi
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting up Firebase

1. Create a new Firebase project
2. Enable Authentication and Firestore
3. Configure authentication providers
4. Set up Firestore security rules

For detailed setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## Firebase Setup

The application uses Firebase for authentication and database. For detailed setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

### Quick Setup:

1. Create a Firebase project
2. Enable Authentication and Firestore
3. Set up environment variables
4. Configure Firestore security rules
5. Create the required collections (profiles, transactions, budgets, categories)

## Deployment

This application can be deployed to Vercel:

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in the Vercel dashboard:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB3KTh7DiKvw3Mrwr6VtGutnqfIOeNpEdA
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=neofi-5e481.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=neofi-5e481
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=neofi-5e481.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=257578214193
   NEXT_PUBLIC_FIREBASE_APP_ID=1:257578214193:web:6ef9cc2808e134715e8610
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-NJGRQPLZ7J
   ```
4. Deploy

For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details. # Budget-Tracker-

## Performance Optimizations

The application has been optimized for better performance using several techniques:

### DOM Manipulation Optimization
- Implemented React.memo for component memoization to prevent unnecessary re-renders
- Created optimized stateless functional components for rendering lists and charts
- Used event delegation for transaction lists to reduce the number of event listeners
- Applied virtualization for long lists to render only visible items

### Efficient Data Processing
- Optimized filtering and sorting operations by using Maps and Sets for O(1) lookups
- Reduced redundant calculations by memoizing expensive operations with useMemo
- Implemented single-pass algorithms for data transformation
- Batched React state updates to prevent cascading renders

### Reduced Network Overhead
- Optimized database queries to fetch all needed data in a single request
- Implemented pagination and infinite scrolling for efficient data loading
- Added proper loading states to improve perceived performance

### UI Responsiveness
- Added passive event listeners for scroll and touch events
- Optimized chart rendering with appropriate sizing and simplified data
- Used CSS Grid and Flexbox for efficient layouts
- Implemented throttling and debouncing for resource-intensive operations
