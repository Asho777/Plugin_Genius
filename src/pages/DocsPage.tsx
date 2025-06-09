import React from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const DocsPage = () => {
  return (
    <div className="docs-page">
      <Navbar />
      <main className="docs-content">
        <div className="container">
          <h1>Documentation</h1>
          <p>This page is under construction.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DocsPage
