import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Home from "./pages/Home";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingChatButton from "./components/FloatingChatButton";
import { ToastContainer } from "./components/Toast";

export default function App() {
  return (
    <Router>
      <div className="relative flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/symptom-checker" element={<PageWrapper><SymptomCheckerPage /></PageWrapper>} />
              <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/chat" element={<PageWrapper><ChatPage /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <FloatingChatButton />
        <ToastContainer />
      </div>
    </Router>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
