import React, { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import '../styles/docs.css'

const DocsPage = () => {
  useEffect(() => {
    // Scroll to section if hash is present in URL
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      scrollToSection(id)
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Get the navbar height to use as offset
      const navbarHeight = document.querySelector('nav')?.offsetHeight || 80
      
      // Calculate the element's position relative to the viewport
      const elementPosition = element.getBoundingClientRect().top
      
      // Calculate the offset position
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20
      
      // Scroll to the element with the offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="docs-page">
      <Navbar />
      <main className="docs-content">
        <div className="docs-container">
          <header className="docs-header">
            <h1>Plugin Genius Documentation</h1>
            <p>
              Welcome to the Plugin Genius documentation. Here you'll find comprehensive guides and documentation to help you start working with Plugin Genius as quickly as possible.
            </p>
          </header>

          <div className="docs-layout">
            <div className="docs-main-content">
              <section id="getting-started" className="docs-section">
                <div className="section-header">
                  <h2>Getting Started</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Plugin Genius is a powerful platform designed to simplify WordPress plugin development. Whether you're a seasoned developer or just starting out, our tools make it easy to create, manage, and deploy WordPress plugins.
                </p>
                
                <h3>Account Setup</h3>
                <p>
                  To begin using Plugin Genius, you'll need to create an account. Visit our registration page and follow these steps:
                </p>
                <ol>
                  <li>Enter your email address and create a secure password</li>
                  <li>Verify your email address through the confirmation link</li>
                  <li>Complete your profile with your developer information</li>
                  <li>Connect your WordPress site(s) if you're ready to deploy</li>
                </ol>
                
                <h3>System Requirements</h3>
                <p>
                  Plugin Genius works with any modern web browser. For the best experience, we recommend:
                </p>
                <ul>
                  <li>Chrome 80+, Firefox 75+, Safari 13+, or Edge 80+</li>
                  <li>Stable internet connection</li>
                  <li>WordPress 5.5+ (for plugin deployment)</li>
                </ul>
                
                <div className="note">
                  <strong>Note:</strong> While Plugin Genius works on mobile devices, we recommend using a desktop computer for the best development experience.
                </div>
              </section>

              <section id="features" className="docs-section">
                <div className="section-header">
                  <h2>Features</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Plugin Genius offers a comprehensive suite of tools designed to streamline your WordPress plugin development workflow.
                </p>
                
                <h3>Visual Plugin Builder</h3>
                <p>
                  Our intuitive visual builder allows you to create plugin structures without writing code. Key capabilities include:
                </p>
                <ul>
                  <li>Drag-and-drop interface for building plugin components</li>
                  <li>Visual representation of plugin architecture</li>
                  <li>Real-time preview of your plugin's functionality</li>
                  <li>Component library with pre-built elements</li>
                </ul>
                
                <h3>Code Generation</h3>
                <p>
                  Plugin Genius automatically generates clean, optimized PHP code based on your visual designs:
                </p>
                <ul>
                  <li>Standards-compliant WordPress plugin code</li>
                  <li>Proper file structure and organization</li>
                  <li>Optimized for performance and security</li>
                  <li>Full access to edit generated code</li>
                </ul>
                
                <h3>Testing Tools</h3>
                <p>
                  Test your plugins thoroughly before deployment:
                </p>
                <ul>
                  <li>Integrated testing environment</li>
                  <li>Compatibility checks across WordPress versions</li>
                  <li>Performance analysis and optimization suggestions</li>
                  <li>Security vulnerability scanning</li>
                </ul>
                
                <h3>Version Control</h3>
                <p>
                  Keep track of all changes to your plugins:
                </p>
                <ul>
                  <li>Automatic versioning of all plugin iterations</li>
                  <li>Detailed change logs</li>
                  <li>Ability to revert to previous versions</li>
                  <li>Branch management for experimental features</li>
                </ul>
              </section>

              <section id="plugin-creation" className="docs-section">
                <div className="section-header">
                  <h2>Plugin Creation</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Creating a new WordPress plugin with Plugin Genius is straightforward and intuitive. Follow these steps to build your first plugin:
                </p>
                
                <h3>Starting a New Plugin</h3>
                <ol>
                  <li>From your dashboard, click the "Create New Plugin" button</li>
                  <li>Enter a name and description for your plugin</li>
                  <li>Select a category that best describes your plugin's functionality</li>
                  <li>Choose whether to start from scratch or use a template</li>
                  <li>Click "Create" to initialize your plugin project</li>
                </ol>
                
                <h3>Building Your Plugin</h3>
                <p>
                  Once your plugin is created, you'll be taken to the Plugin Builder interface where you can:
                </p>
                <ul>
                  <li>Add functionality components from the sidebar</li>
                  <li>Configure each component's settings and behavior</li>
                  <li>Arrange components in the desired order</li>
                  <li>Connect components to create complex functionality</li>
                  <li>Preview your plugin's operation in real-time</li>
                </ul>
                
                <h3>Advanced Customization</h3>
                <p>
                  For developers who want more control, Plugin Genius offers advanced customization options:
                </p>
                <ul>
                  <li>Direct code editing for any generated files</li>
                  <li>Custom CSS for styling admin interfaces</li>
                  <li>JavaScript integration for enhanced functionality</li>
                  <li>Database schema design for plugins that store data</li>
                </ul>
                
                <div className="warning">
                  <strong>Important:</strong> Always test your plugins thoroughly in a staging environment before deploying to production WordPress sites.
                </div>
              </section>

              <section id="templates" className="docs-section">
                <div className="section-header">
                  <h2>Templates</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Plugin Genius offers a variety of templates to jumpstart your plugin development. Templates provide pre-built functionality that you can customize to your needs.
                </p>
                
                <h3>Available Template Categories</h3>
                <p>
                  Our template library includes options for various plugin types:
                </p>
                <ul>
                  <li><strong>Content Management:</strong> Custom post types, taxonomies, and fields</li>
                  <li><strong>E-commerce:</strong> Product displays, cart functionality, payment gateways</li>
                  <li><strong>SEO:</strong> Meta tag management, sitemap generation, schema markup</li>
                  <li><strong>Security:</strong> Login protection, content restriction, activity logging</li>
                  <li><strong>Performance:</strong> Caching, image optimization, database cleanup</li>
                  <li><strong>Social Media:</strong> Sharing buttons, feed displays, auto-posting</li>
                </ul>
                
                <h3>Using Templates</h3>
                <p>
                  To use a template:
                </p>
                <ol>
                  <li>Browse the template library from your dashboard</li>
                  <li>Preview templates to see their functionality</li>
                  <li>Select a template that matches your needs</li>
                  <li>Customize the template settings to fit your requirements</li>
                  <li>Save and continue editing in the Plugin Builder</li>
                </ol>
                
                <h3>Template Customization</h3>
                <p>
                  All templates can be fully customized:
                </p>
                <ul>
                  <li>Add or remove components</li>
                  <li>Modify settings and behaviors</li>
                  <li>Change styling and appearance</li>
                  <li>Extend functionality with additional features</li>
                </ul>
                
                <table>
                  <thead>
                    <tr>
                      <th>Template Type</th>
                      <th>Complexity</th>
                      <th>Use Case</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Starter</td>
                      <td>Low</td>
                      <td>Basic plugins with minimal functionality</td>
                    </tr>
                    <tr>
                      <td>Professional</td>
                      <td>Medium</td>
                      <td>Feature-rich plugins for specific purposes</td>
                    </tr>
                    <tr>
                      <td>Advanced</td>
                      <td>High</td>
                      <td>Complex plugins with multiple integrated systems</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section id="wordpress-integration" className="docs-section">
                <div className="section-header">
                  <h2>WordPress Integration</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Plugin Genius makes it easy to deploy your plugins to WordPress sites and manage them remotely.
                </p>
                
                <h3>Connecting WordPress Sites</h3>
                <p>
                  To connect your WordPress site to Plugin Genius:
                </p>
                <ol>
                  <li>Install the Plugin Genius Connector plugin on your WordPress site</li>
                  <li>Generate an API key in your WordPress admin dashboard</li>
                  <li>Add your site in the Plugin Genius dashboard using the API key</li>
                  <li>Verify the connection is working properly</li>
                </ol>
                
                <h3>Deploying Plugins</h3>
                <p>
                  Once your site is connected, you can deploy plugins directly:
                </p>
                <ol>
                  <li>Select the plugin you want to deploy</li>
                  <li>Choose the target WordPress site</li>
                  <li>Configure any site-specific settings</li>
                  <li>Click "Deploy" to install and activate the plugin</li>
                </ol>
                
                <h3>Remote Management</h3>
                <p>
                  Plugin Genius allows you to manage your plugins remotely:
                </p>
                <ul>
                  <li>Update plugins when new versions are available</li>
                  <li>Monitor plugin performance and usage</li>
                  <li>Configure plugin settings without logging into WordPress</li>
                  <li>Troubleshoot issues with detailed diagnostic information</li>
                </ul>
                
                <div className="note">
                  <strong>Note:</strong> Remote management requires the Plugin Genius Connector plugin to remain active on your WordPress site.
                </div>
              </section>

              <section id="api" className="docs-section">
                <div className="section-header">
                  <h2>API Reference</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Plugin Genius provides a comprehensive API for developers who want to integrate our platform with their own tools and workflows.
                </p>
                
                <h3>Authentication</h3>
                <p>
                  All API requests require authentication using an API key:
                </p>
                <pre><code>{`// Example API request with authentication
fetch('https://api.plugingenius.com/v1/plugins', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})`}</code></pre>
                
                <h3>Endpoints</h3>
                <p>
                  The Plugin Genius API includes endpoints for all major functions:
                </p>
                <ul>
                  <li><code>/plugins</code> - List, create, update, and delete plugins</li>
                  <li><code>/templates</code> - Browse and use plugin templates</li>
                  <li><code>/sites</code> - Manage connected WordPress sites</li>
                  <li><code>/deployments</code> - Handle plugin deployments</li>
                  <li><code>/users</code> - User account management</li>
                </ul>
                
                <h3>Webhooks</h3>
                <p>
                  Set up webhooks to receive notifications about events:
                </p>
                <ul>
                  <li>Plugin updates and changes</li>
                  <li>Deployment successes and failures</li>
                  <li>WordPress site connection status changes</li>
                  <li>User account activities</li>
                </ul>
                
                <p>
                  For complete API documentation, including request and response formats, visit our <a href="#" style={{ color: 'var(--color-primary)' }}>API Documentation Portal</a>.
                </p>
              </section>

              <section id="faq" className="docs-section">
                <div className="section-header">
                  <h2>Frequently Asked Questions</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                
                <h3>General Questions</h3>
                
                <h4>Is Plugin Genius suitable for beginners?</h4>
                <p>
                  Yes! Plugin Genius is designed to be accessible for users of all skill levels. Beginners can use our templates and visual builder to create plugins without writing code, while experienced developers can take advantage of our advanced features and code customization options.
                </p>
                
                <h4>Can I use Plugin Genius for commercial projects?</h4>
                <p>
                  Absolutely. Plugins created with Plugin Genius are yours to use, distribute, or sell as you wish. There are no restrictions on commercial use of plugins you create.
                </p>
                
                <h4>Does Plugin Genius work with WordPress Multisite?</h4>
                <p>
                  Yes, Plugin Genius fully supports WordPress Multisite installations. You can deploy plugins to individual sites within a network or network-wide.
                </p>
                
                <h3>Technical Questions</h3>
                
                <h4>How does Plugin Genius handle plugin updates?</h4>
                <p>
                  When you update a plugin in Plugin Genius, you can push those updates to all connected WordPress sites. The update process preserves any site-specific settings and ensures a smooth transition to the new version.
                </p>
                
                <h4>Can I import existing WordPress plugins into Plugin Genius?</h4>
                <p>
                  Yes, you can import existing plugins into Plugin Genius for management and enhancement. The import tool will analyze your plugin's structure and convert it to our visual format while preserving all functionality.
                </p>
                
                <h4>Is my plugin code secure?</h4>
                <p>
                  Plugin Genius takes security seriously. All generated code follows WordPress security best practices, and we regularly update our code generation templates to address new security concerns. Additionally, our built-in security scanner can identify potential vulnerabilities in your plugins.
                </p>
                
                <h3>Account & Billing</h3>
                
                <h4>What subscription plans are available?</h4>
                <p>
                  Plugin Genius offers several subscription tiers to meet different needs, from individual developers to agencies. Visit our <a href="#" style={{ color: 'var(--color-primary)' }}>Pricing Page</a> for current plan details and features.
                </p>
                
                <h4>Can I cancel my subscription at any time?</h4>
                <p>
                  Yes, you can cancel your subscription at any time. After cancellation, you'll maintain access until the end of your current billing period. Your plugins will remain accessible for export, but you won't be able to create new plugins or use premium features.
                </p>
                
                <h4>Do you offer educational discounts?</h4>
                <p>
                  Yes, we offer special pricing for educational institutions and students. Contact our support team with verification of your status to apply for educational pricing.
                </p>
              </section>
            </div>

            <nav className="docs-nav">
              <div className="docs-nav-title">Quick Navigation</div>
              <div className="docs-nav-links">
                <a href="#getting-started" className="docs-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('getting-started'); }}>
                  Getting Started
                </a>
                <a href="#features" className="docs-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
                  Features
                </a>
                <a href="#plugin-creation" className="docs-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('plugin-creation'); }}>
                  Plugin Creation
                </a>
                <a href="#templates" className="docs-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('templates'); }}>
                  Templates
                </a>
                <a href="#wordpress-integration" className="docs-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('wordpress-integration'); }}>
                  WordPress Integration
                </a>
                <a href="#api" className="docs-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('api'); }}>
                  API Reference
                </a>
                <a href="#faq" className="docs-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>
                  FAQ
                </a>
              </div>
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DocsPage
