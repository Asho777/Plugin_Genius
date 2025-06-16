import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TemplatesPage from './pages/TemplatesPage'
import MyPluginsPage from './pages/MyPluginsPage'
import DocsPage from './pages/DocsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import CreatePluginPage from './pages/CreatePluginPage'
import SplashScreen from './components/common/SplashScreen'
import LoadingScreen from './components/common/LoadingScreen'
import './App.css'
import { useScrollReset } from './hooks/useScrollReset'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  
  // Use the scroll reset hook
  useScrollReset();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Scroll to top when route changes - enhanced version
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Try with auto behavior to override any smooth scrolling
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    };
    
    resetScroll();
    
    // Also try with a slight delay
    const timer = setTimeout(resetScroll, 100);
    
    // Try one more time with a longer delay
    const secondTimer = setTimeout(resetScroll, 300);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(secondTimer);
    };
  }, [location.pathname]);

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      <Route path="/" element={session ? <Navigate to="/home" /> : <SplashScreen />} />
      <Route path="/login" element={session ? <Navigate to="/home" /> : <LoginPage />} />
      <Route path="/register" element={session ? <Navigate to="/home" /> : <RegisterPage />} />
      <Route path="/home" element={session ? <HomePage /> : <Navigate to="/" />} />
      <Route path="/templates" element={session ? <TemplatesPage /> : <Navigate to="/" />} />
      <Route path="/plugins" element={session ? <MyPluginsPage /> : <Navigate to="/" />} />
      <Route path="/my-plugins" element={session ? <MyPluginsPage /> : <Navigate to="/" />} />
      <Route path="/plugins/create" element={session ? <CreatePluginPage /> : <Navigate to="/" />} />
      <Route path="/docs" element={session ? <DocsPage /> : <Navigate to="/" />} />
      <Route path="/profile" element={session ? <ProfilePage /> : <Navigate to="/" />} />
      <Route path="/settings" element={session ? <SettingsPage /> : <Navigate to="/" />} />
    </Routes>
  )
}

export default App
