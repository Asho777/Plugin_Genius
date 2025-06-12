import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import '../../styles/splash.css'

const SplashScreen = () => {
  const navigate = useNavigate()
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([])

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars = []
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          delay: Math.random() * 5
        })
      }
      setStars(newStars)
    }

    generateStars()
  }, [])

  const handleWelcomeClick = () => {
    navigate('/login')
  }

  return (
    <div className="splash-screen">
      {/* Twinkling stars background */}
      <div className="stars-container">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`
            }}
            animate={{
              opacity: [0.2, 1, 0.2]
            }}
            transition={{
              duration: 3,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="splash-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.h1 
          className="splash-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          WordPress Plugin <span>Genius</span>
        </motion.h1>
        
        <motion.button 
          className="welcome-button"
          onClick={handleWelcomeClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Welcome!
        </motion.button>
        
        <motion.p 
          className="splash-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Press the Welcome button, you are about to enter a Web App that allows you to code build your dreams into hard working WordPress Plugins, have fun and enjoy the experience!
        </motion.p>
      </motion.div>
    </div>
  )
}

export default SplashScreen
