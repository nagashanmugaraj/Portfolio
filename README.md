# 🚀 3D Interactive Developer Portfolio

A modern, highly interactive, and fully dynamic developer portfolio built with React, Framer Motion, and Firebase. This portfolio features stunning 3D parallax effects, smooth page transitions, and a secure Admin Dashboard for real-time content management.

## ✨ Features

- **Interactive 3D UI**: Immersive user experience with `react-parallax-tilt` and `framer-motion` animations.
- **Dynamic Content**: All portfolio data (Projects, Skills, Internships, Timeline) is fetched in real-time from Firebase Firestore.
- **Secure Admin Dashboard**: 
  - Protected route using Firebase Authentication (Google Sign-in).
  - Restricted to specific admin email.
  - Full CRUD operations for all portfolio sections.
  - Rich text editor for descriptions.
  - Image uploading to Firebase Storage.
- **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.
- **Project Search & Filtering**: Easily find specific projects.
- **Modular Architecture**: Built with scalable React components and Context API.

## 🛠️ Tech Stack

- **Frontend**: React.js, CSS Modules
- **Animations**: Framer Motion, React Parallax Tilt
- **Icons**: React Icons
- **Backend/Database**: Firebase (Firestore, Storage, Authentication)
- **State Management**: React Context API
- **Routing**: React Router DOM

## 📂 Project Structure

```text
src/
├── components/
│   ├── admin/       # Admin panel components (forms, modals, rich text editor)
│   ├── layout/      # Shared layout components (Header, Footer)
│   ├── sections/    # Main portfolio sections (Hero, About, Projects, Skills, etc.)
│   └── ui/          # Reusable UI components (Cards, Buttons, Modals)
├── context/         # React Context (DataContext for Firebase operations)
├── pages/           # Route pages (Home, Admin, etc.)
├── assets/          # Static assets (images, icons)
└── styles/          # Global styles and CSS variables
