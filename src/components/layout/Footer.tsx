import React from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi'
import Logo from '../common/Logo'
import '../../styles/footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo size="small" />
            <div className="footer-brand-text">
              <div className="footer-logo-text">Plugin <span>Genius</span></div>
              <p className="footer-tagline">Revolutionizing WordPress plugin development</p>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h3 className="footer-links-title">Product</h3>
              <Link to="/features" className="footer-link">Features</Link>
              <Link to="/pricing" className="footer-link">Pricing</Link>
              <Link to="/roadmap" className="footer-link">Roadmap</Link>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">Resources</h3>
              <Link to="/docs" className="footer-link">Documentation</Link>
              <Link to="/tutorials" className="footer-link">Tutorials</Link>
              <Link to="/blog" className="footer-link">Blog</Link>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">Company</h3>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
              <Link to="/careers" className="footer-link">Careers</Link>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">Legal</h3>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/cookies" className="footer-link">Cookie Policy</Link>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; 2025 Plugin Genius. All rights reserved.
          </div>
          
          <div className="footer-social">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FiGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FiTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FiLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
