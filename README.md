
# Mini Project 04

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A modern web application built with React, TypeScript, and Vite**

[Live Demo](https://mp38.vercel.app) • [Report Bug](https://github.com/SinghAman21/mini-project-04/issues) • [Request Feature](https://github.com/SinghAman21/mini-project-04/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About The Project

Mini Project 04 is a modern web application showcasing the power of React with TypeScript and the blazing-fast build tool Vite. This project demonstrates best practices in frontend development with type-safe code and optimized performance.

### ✨ Key Features

- ⚡ **Lightning Fast** - Powered by Vite for instant HMR and optimized builds
- 🔒 **Type Safe** - Built with TypeScript for enhanced developer experience
- 🎨 **Modern UI** - Clean and responsive user interface
- 🚀 **Production Ready** - Deployed on Vercel with automatic CI/CD
- 📦 **Optimized Bundle** - Efficient code splitting and lazy loading

---

## 🛠️ Built With

This project leverages modern web technologies:

- **[React](https://reactjs.org/)** - A JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript with syntax for types
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[Vercel](https://vercel.com/)** - Platform for frontend frameworks and static sites

---

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v18 or higher)
  ```bash
  node --version
  ```
- **npm** or **yarn**
  ```bash
  npm --version
  ```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SinghAman21/mini-project-04.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd mini-project-04
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

---

## 💻 Usage

The application runs on a local development server with Hot Module Replacement (HMR) enabled, allowing you to see changes instantly without refreshing the page.

### Development Mode

```bash
npm run dev
```

This starts the Vite development server with the following features:
- Fast refresh for React components
- Instant HMR updates
- TypeScript type checking
- ESLint integration

---

## 📜 Scripts

The following scripts are available in the project:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with HMR |
| `npm run build` | Build the production-ready application |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## 📁 Project Structure

```
mini-project-04/
├── public/              # Static assets
├── src/                 # Source files
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Application entry point
│   └── vite-env.d.ts   # Vite type definitions
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tsconfig.node.json  # TypeScript config for Node
├── vite.config.ts      # Vite configuration
└── README.md           # Project documentation
```

## 🔧 Configuration

### Vite Configuration

The project uses two official Vite plugins:

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)** - Uses Babel for Fast Refresh
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)** - Uses SWC for Fast Refresh (alternative)

### TypeScript Configuration

For production applications, consider updating ESLint configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    // Or use stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optional: stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

### React-Specific Linting

Install additional ESLint plugins for React:

```bash
npm install -D eslint-plugin-react-x eslint-plugin-react-dom
```

Update `eslint.config.js`:

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

---


## 📧 Contact

**Aman Singh** - [@SinghAman21](https://github.com/SinghAman21)

**Project Link:** [https://github.com/SinghAman21/mini-project-04](https://github.com/SinghAman21/mini-project-04)

**Live Demo:** [mp38.vercel.app](https://mp38.vercel.app)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Vercel Platform](https://vercel.com/)
- [ESLint](https://eslint.org/)

---

<div align="center">


⭐ Star this repository if you find it helpful!

</div>
