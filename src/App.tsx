import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPostPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import CreatePostPage from './pages/admin/CreatePostPage';
import EditPostPage from './pages/admin/EditPostPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import ProtectedRoute from './components/ProtectedRoute';
import ConsultationModal from './components/ConsultationModal';
import ProfilePage from './pages/ProfilePage';
import InvoiceGenerator from './pages/InvoiceGenerator';
import ResumeBuilderPage from './pages/resume-builder/ResumeBuilderPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const handleBookConsultation = () => setIsConsultationModalOpen(true);
  const handleCloseModal = () => setIsConsultationModalOpen(false);

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Navbar onBookConsultation={handleBookConsultation} />
        <main>
          <Routes>
            <Route path="/" element={<Home onBookConsultation={handleBookConsultation} />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing onBookConsultation={handleBookConsultation} />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/invoice-generator" element={<InvoiceGenerator />} />
            <Route path="/resume-builder" element={<ResumeBuilderPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/create-post" element={<CreatePostPage />} />
              <Route path="/admin/edit-post/:id" element={<EditPostPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        <ConsultationModal isOpen={isConsultationModalOpen} onClose={handleCloseModal} />
      </div>
    </Router>
  );
}

export default App;
