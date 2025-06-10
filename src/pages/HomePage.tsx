import React from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiCode, FiGrid, FiShoppingBag, FiUsers, FiImage, FiArrowRight } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/home/HeroSection'
import PluginOption from '../components/home/PluginOption'
import '../styles/home.css'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const prebuiltPlugins = [
    {
      title: 'E-Commerce',
      description: 'Create a powerful online store with payment processing, inventory management, and more.',
      icon: <FiShoppingBag />,
      to: '/plugins/templates/ecommerce'
    },
    {
      title: 'Membership',
      description: 'Build a membership site with user roles, content restrictions, and subscription management.',
      icon: <FiUsers />,
      to: '/plugins/templates/membership'
    },
    {
      title: 'Gallery',
      description: 'Create beautiful image galleries with lightbox effects, sorting, and filtering options.',
      icon: <FiImage />,
      to: '/plugins/templates/gallery'
    }
  ]

  return (
    <div className="home-page">
      <Navbar />
      
      <main className="home-content">
        <HeroSection />
        
        <section className="options-section">
          <div className="container">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Choose Your Path
            </motion.h2>
            
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Get started with pre-built Wordpress Plugins or create your own custom plugin from scratch
            </motion.p>
            
            <div className="main-options">
              <motion.div 
                className="option-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div className="option-icon">
                  <FiPackage />
                </div>
                <h3 className="option-title">Wordpress Plugins</h3>
                <p className="option-description">
                  Choose from the collection of professionally designed plugins. Designed to fit your needs and deploy in minutes.
                </p>
                {/* Updated to match hero-button styling */}
                <Link to="/templates" className="hero-button primary">
                  <span>Wordpress Plugins</span>
                  <FiArrowRight />
                </Link>
              </motion.div>
              
              <motion.div 
                className="option-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div className="option-icon">
                  <FiCode />
                </div>
                <h3 className="option-title">Custom Plugin</h3>
                <p className="option-description">
                  Build a completely custom WordPress Plugin from scratch. Our intuitive builder makes it easy, even without coding experience.
                </p>
                {/* Updated to match hero-button styling */}
                <Link to="/plugins/create" className="hero-button primary">
                  <span>Create Custom Plugin</span>
                  <FiArrowRight />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="templates-section">
          <div className="container">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Popular Plugin Templates
            </motion.h2>
            
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Get started quickly with our selection of the most popular Wordpress Plugins
            </motion.p>
            
            <div className="templates-grid">
              {prebuiltPlugins.map((plugin, index) => (
                <PluginOption
                  key={plugin.title}
                  title={plugin.title}
                  description={plugin.description}
                  icon={plugin.icon}
                  to={plugin.to}
                  delay={0.2 + (index * 0.1)}
                />
              ))}
            </div>
            
            <motion.div 
              className="view-all-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link to="/templates" className="view-all-link">
                View All Wordpress Plugins <FiGrid />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default HomePage
