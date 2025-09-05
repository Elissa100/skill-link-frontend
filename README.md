# SkillLink - Frontend

The frontend of SkillLink, a freelancing platform connecting clients with skilled freelancers. Built with React and Tailwind CSS, this application provides a responsive, modern, and user-friendly interface.

## 🚀 Features

### User Interfaces
- **Authentication**: Login, Registration, and Password management
- **Role-based Dashboards**: Client, Freelancer, and Admin dashboards
- **Project Management**: Browse, post, and manage projects
- **Bidding System**: Submit proposals for projects
- **Messaging**: Real-time chat using Socket.io
- **Notifications**: Real-time notifications for updates
- **Dark/Light Mode**: Theme switching with persistence

### Technical Features
- **Responsive Design**: Works across devices and screen sizes
- **Form Validation**: Using React Hook Form and custom validation
- **API Integration**: Axios for backend communication
- **Animations**: Subtle UI animations for better UX
- **Reusable Components**: Modular components for scalability
- **Routing**: React Router for page navigation
- **Toasts & Alerts**: React Hot Toast for user feedback

## 🛠 Tech Stack

- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion (optional for UI effects)

## 📋 Prerequisites

- Node.js 20+
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone git@github.com:Elissa100/skill-link-frontend.git
cd skill-link-frontend
````

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create `.env` in the root:

```env
VITE_API_BASE_URL=http://localhost:3001
```

> Replace with your backend URL if different.

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗 Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, icons, styles
│   ├── components/          # Reusable UI components
│   ├── context/             # Context providers
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Page components
│   ├── services/            # API services
│   └── App.jsx              # Root component
├── package.json
└── vite.config.js
```

## 🔧 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm test          # Run tests
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

```
