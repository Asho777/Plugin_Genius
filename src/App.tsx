import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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
import './App.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={session ? <Navigate to="/home" /> : <LoginPage />} />
      <Route path="/register" element={session ? <Navigate to="/home" /> : <RegisterPage />} />
      <Route path="/home" element={session ? <HomePage /> : <Navigate to="/" />} />
      <Route path="/templates" element={session ? <TemplatesPage /> : <Navigate to="/" />} />
      <Route path="/plugins" element={session ? <MyPluginsPage /> : <Navigate to="/" />} />
      <Route path="/plugins/create" element={session ? <CreatePluginPage /> : <Navigate to="/" />} />
      <Route path="/docs" element={session ? <DocsPage /> : <Navigate to="/" />} />
      <Route path="/profile" element={session ? <ProfilePage /> : <Navigate to="/" />} />
      <Route path="/settings" element={session ? <SettingsPage /> : <Navigate to="/" />} />
    </Routes>
  )
}

export default App
