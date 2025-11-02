import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router"
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../providers/ThemeProvider";
import {
  BarChart3,
  MessageCircle,
  Lightbulb,
  Info,
  Biohazard,
} from "lucide-react";

export default function RootLayout() {
  const [showWelcome, setShowWelcome] = useState(true);
  const location = useLocation();

  useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Determine active route based on path
  const getActiveComponent = () => {
    const path = location.pathname;
    if (path === "/chat") return "chat";
    if (path === "/budget") return "budget";
    if (path === "/epidemic") return "epidemic";
    return "budget"; // Default
  };
  
  const activeComponent = getActiveComponent();

  return (
    <div className="min-h-screen bg-light-200 dark:bg-dark-300 font-sans overflow-hidden transition-colors duration-300">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-screen fixed inset-0 z-50 gradient-bg"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <Lightbulb className="size-24 mx-auto text-primary-400 dark:text-secondary-400" />
              </motion.div>
              <h1 className="text-4xl font-display font-bold mb-3 text-gray-900 dark:text-white">
                HealthCare AI
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Your intelligent healthcare finance companion
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="mainApp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row h-screen"
          >
            {/* Sidebar Navigation */}
            <motion.nav
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:w-20 bg-light-300 dark:bg-dark-200 border-r border-dashed border-gray-300 dark:border-gray-800 flex lg:flex-col justify-between p-2"
            >
              <div className="flex lg:flex-col gap-2 items-center">
                <Link to="/chat">
                  <button
                    className={`nav-button w-12 h-12 flex items-center justify-center ${
                      activeComponent === "chat"
                        ? "bg-primary-600 dark:bg-secondary-600 text-white shadow-light-glow dark:shadow-glow"
                        : "bg-light-100 dark:bg-dark-100 text-gray-500 dark:text-gray-400 hover:bg-light-100/80 dark:hover:bg-dark-100/80"
                    }`}
                    aria-label="Chat Assistant"
                  >
                    <MessageCircle
                      className={`text-xl ${
                        activeComponent === "chat"
                          ? "text-black dark:text-white"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </Link>

                <Link to="/budget">
                  <button
                    className={`nav-button w-12 h-12 flex items-center justify-center ${
                      activeComponent === "budget"
                        ? "bg-primary-600 dark:bg-secondary-600 text-white shadow-light-glow dark:shadow-glow"
                        : "bg-light-100 dark:bg-dark-100 text-gray-500 dark:text-gray-400 hover:bg-light-100/80 dark:hover:bg-dark-100/80"
                    }`}
                    aria-label="Budget Assistant"
                  >
                    <BarChart3
                      className={`text-xl ${
                        activeComponent === "budget"
                          ? "text-black dark:text-white"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </Link>

                <Link to="/epidemic">
                  <button
                    className={`nav-button w-12 h-12 flex items-center justify-center ${
                      activeComponent === "epidemic"
                        ? "bg-primary-600 dark:bg-secondary-600 text-white shadow-light-glow dark:shadow-glow"
                        : "bg-light-100 dark:bg-dark-100 text-gray-500 dark:text-gray-400 hover:bg-light-100/80 dark:hover:bg-dark-100/80"
                    }`}
                    aria-label="Epidemic Management"
                  >
                    <Biohazard
                      className={`text-xl ${
                        activeComponent === "epidemic"
                          ? "text-black dark:text-white"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </Link>
              </div>

              <div className="flex lg:flex-col gap-2 items-center">
                <ThemeToggle />

                <button
                  className="nav-button w-12 h-12 flex items-center justify-center bg-light-100 dark:bg-dark-100 text-gray-500 dark:text-gray-400 hover:bg-light-100/80 dark:hover:bg-dark-100/80"
                  aria-label="About"
                >
                  <Info className="text-xl" />
                </button>
              </div>
            </motion.nav>

            <div className="flex-1 overflow-hidden">
              {/* Header */}
              <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-light-300 dark:bg-dark-200 border-b border-dashed border-gray-300 dark:border-gray-800 p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-secondary-500 dark:to-secondary-800 rounded-lg flex items-center justify-center shadow-light-glow dark:shadow-glow">
                    {activeComponent === "budget" ? (
                      <BarChart3 className="text-primary text-xl" />
                    ) : activeComponent === "epidemic" ? (
                      <Biohazard className="text-primary text-xl" />
                    ) : (
                      <MessageCircle className="text-primary text-xl" />
                    )}
                  </div>
                  <h1 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
                    {activeComponent === "budget"
                      ? "Healthcare Budget Planner"
                      : activeComponent === "epidemic"
                      ? "Epidemic Management System"
                      : "AI Health Assistant"}
                  </h1>
                </div>

                <div className="text-xs px-3 py-1.5 rounded-full bg-light-100 dark:bg-dark-100 text-primary-600 dark:text-secondary-300 border border-primary-100 dark:border-secondary-900/30">
                  Powered by Gemini AI
                </div>
              </motion.header>

              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-[calc(100vh-64px)] overflow-auto p-4 lg:p-6 bg-light-200 dark:bg-dark-300 transition-colors duration-300"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}