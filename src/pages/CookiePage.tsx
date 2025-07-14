import React from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import '../styles/cookie.css'

const CookiePage = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const navbarHeight = document.querySelector('nav')?.offsetHeight || 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="cookie-page">
      <Navbar />
      <main className="cookie-content">
        <div className="cookie-container">
          <header className="cookie-header">
            <h1>Cookie Policy</h1>
            <p>
              This Cookie Policy explains how Plugin Genius uses cookies and similar tracking technologies when you visit our website and use our WordPress plugin development platform.
            </p>
            <div className="cookie-meta">
              <span>Last updated: January 15, 2025</span>
              <span>Effective date: January 15, 2025</span>
            </div>
          </header>

          <div className="cookie-layout">
            <div className="cookie-main-content">
              <section id="what-are-cookies" className="cookie-section">
                <div className="section-header">
                  <h2>1. What Are Cookies</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners about how users interact with their sites.
                </p>
                <p>
                  Cookies contain information that is transferred to your device's hard drive. They help us recognize your device and store some information about your preferences or past actions on our website.
                </p>
                <h3>Types of Cookies by Duration</h3>
                <ul>
                  <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
                  <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period or until you delete them</li>
                </ul>
                <h3>Types of Cookies by Origin</h3>
                <ul>
                  <li><strong>First-Party Cookies:</strong> Set directly by Plugin Genius on our domain</li>
                  <li><strong>Third-Party Cookies:</strong> Set by external services we use on our website</li>
                </ul>
              </section>

              <section id="how-we-use-cookies" className="cookie-section">
                <div className="section-header">
                  <h2>2. How We Use Cookies</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Plugin Genius uses cookies for various purposes to enhance your experience and improve our services:
                </p>
                <h3>Essential Website Functionality</h3>
                <ul>
                  <li>Maintaining your login session and authentication status</li>
                  <li>Remembering your preferences and settings</li>
                  <li>Enabling core website features and navigation</li>
                  <li>Providing security features and fraud prevention</li>
                  <li>Load balancing and performance optimization</li>
                </ul>
                <h3>User Experience Enhancement</h3>
                <ul>
                  <li>Personalizing content and recommendations</li>
                  <li>Remembering your plugin development preferences</li>
                  <li>Storing your dashboard customizations</li>
                  <li>Maintaining your workspace state between sessions</li>
                  <li>Providing seamless navigation and user interface</li>
                </ul>
                <h3>Analytics and Performance</h3>
                <ul>
                  <li>Analyzing website usage patterns and user behavior</li>
                  <li>Measuring the effectiveness of our features</li>
                  <li>Identifying popular content and tools</li>
                  <li>Monitoring website performance and errors</li>
                  <li>Conducting A/B tests for service improvements</li>
                </ul>
              </section>

              <section id="types-of-cookies" className="cookie-section">
                <div className="section-header">
                  <h2>3. Types of Cookies We Use</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <h3>Strictly Necessary Cookies</h3>
                <p>
                  These cookies are essential for the website to function properly and cannot be disabled in our systems. They are usually only set in response to actions made by you which amount to a request for services.
                </p>
                <div className="cookie-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Cookie Name</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>auth_session</td>
                        <td>Maintains user authentication state</td>
                        <td>Session</td>
                      </tr>
                      <tr>
                        <td>csrf_token</td>
                        <td>Prevents cross-site request forgery attacks</td>
                        <td>Session</td>
                      </tr>
                      <tr>
                        <td>load_balancer</td>
                        <td>Routes requests to appropriate servers</td>
                        <td>Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3>Performance Cookies</h3>
                <p>
                  These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are most and least popular.
                </p>
                <div className="cookie-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Cookie Name</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>_ga</td>
                        <td>Google Analytics - distinguishes users</td>
                        <td>2 years</td>
                      </tr>
                      <tr>
                        <td>_ga_*</td>
                        <td>Google Analytics - session state</td>
                        <td>2 years</td>
                      </tr>
                      <tr>
                        <td>performance_metrics</td>
                        <td>Tracks page load times and errors</td>
                        <td>30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3>Functional Cookies</h3>
                <p>
                  These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                </p>
                <div className="cookie-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Cookie Name</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>user_preferences</td>
                        <td>Stores user interface preferences</td>
                        <td>1 year</td>
                      </tr>
                      <tr>
                        <td>workspace_state</td>
                        <td>Remembers plugin development workspace</td>
                        <td>6 months</td>
                      </tr>
                      <tr>
                        <td>theme_preference</td>
                        <td>Stores dark/light mode preference</td>
                        <td>1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3>Marketing Cookies</h3>
                <p>
                  These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant adverts on other sites.
                </p>
                <div className="cookie-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Cookie Name</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>marketing_consent</td>
                        <td>Tracks marketing consent preferences</td>
                        <td>1 year</td>
                      </tr>
                      <tr>
                        <td>campaign_tracking</td>
                        <td>Measures marketing campaign effectiveness</td>
                        <td>90 days</td>
                      </tr>
                      <tr>
                        <td>referral_source</td>
                        <td>Tracks how users found our website</td>
                        <td>30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="third-party-cookies" className="cookie-section">
                <div className="section-header">
                  <h2>4. Third-Party Cookies</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  We use various third-party services that may set cookies on your device when you use our website. These services help us provide better functionality and analyze our website performance.
                </p>

                <h3>Google Analytics</h3>
                <p>
                  We use Google Analytics to understand how visitors use our website. Google Analytics uses cookies to collect information about your use of our website in an anonymous form.
                </p>
                <ul>
                  <li><strong>Purpose:</strong> Website analytics and user behavior analysis</li>
                  <li><strong>Data Collected:</strong> Page views, session duration, bounce rate, user demographics</li>
                  <li><strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
                  <li><strong>Opt-out:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
                </ul>

                <h3>Supabase</h3>
                <p>
                  Our authentication and database services are provided by Supabase, which may set cookies for session management and security.
                </p>
                <ul>
                  <li><strong>Purpose:</strong> User authentication and session management</li>
                  <li><strong>Data Collected:</strong> Authentication tokens, session information</li>
                  <li><strong>Privacy Policy:</strong> <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a></li>
                </ul>

                <h3>Payment Processors</h3>
                <p>
                  When you make payments, our payment processors may set cookies for fraud prevention and transaction security.
                </p>
                <ul>
                  <li><strong>Purpose:</strong> Payment processing and fraud prevention</li>
                  <li><strong>Data Collected:</strong> Transaction details, payment method information</li>
                  <li><strong>Security:</strong> All payment data is encrypted and processed securely</li>
                </ul>

                <h3>Customer Support Tools</h3>
                <p>
                  We use customer support platforms that may set cookies to provide better support experiences.
                </p>
                <ul>
                  <li><strong>Purpose:</strong> Customer support and help desk functionality</li>
                  <li><strong>Data Collected:</strong> Support conversations, user preferences</li>
                  <li><strong>Benefits:</strong> Faster support resolution and personalized assistance</li>
                </ul>
              </section>

              <section id="cookie-consent" className="cookie-section">
                <div className="section-header">
                  <h2>5. Cookie Consent and Preferences</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  We respect your privacy choices and provide you with control over the cookies we use on our website.
                </p>

                <h3>Consent Management</h3>
                <p>
                  When you first visit our website, you will see a cookie banner that allows you to:
                </p>
                <ul>
                  <li>Accept all cookies for the full website experience</li>
                  <li>Reject non-essential cookies while keeping necessary ones</li>
                  <li>Customize your cookie preferences by category</li>
                  <li>Learn more about each type of cookie we use</li>
                </ul>

                <h3>Managing Your Preferences</h3>
                <p>
                  You can change your cookie preferences at any time by:
                </p>
                <ul>
                  <li>Clicking the "Cookie Preferences" link in our website footer</li>
                  <li>Accessing the cookie settings in your account dashboard</li>
                  <li>Using your browser's cookie management tools</li>
                  <li>Contacting our support team for assistance</li>
                </ul>

                <h3>Withdrawal of Consent</h3>
                <p>
                  You can withdraw your consent for non-essential cookies at any time. Please note that:
                </p>
                <ul>
                  <li>Withdrawing consent will not affect cookies already placed</li>
                  <li>Some website features may not work properly without certain cookies</li>
                  <li>Essential cookies cannot be disabled as they are necessary for basic functionality</li>
                  <li>Your preferences will be remembered for future visits</li>
                </ul>
              </section>

              <section id="browser-controls" className="cookie-section">
                <div className="section-header">
                  <h2>6. Browser Cookie Controls</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Most web browsers allow you to control cookies through their settings. You can usually find these controls in the "Options" or "Preferences" menu of your browser.
                </p>

                <h3>Common Browser Settings</h3>
                <h4>Google Chrome</h4>
                <ol>
                  <li>Click the three dots menu → Settings</li>
                  <li>Go to Privacy and Security → Cookies and other site data</li>
                  <li>Choose your preferred cookie settings</li>
                  <li>Manage exceptions for specific sites</li>
                </ol>

                <h4>Mozilla Firefox</h4>
                <ol>
                  <li>Click the menu button → Options</li>
                  <li>Select Privacy & Security</li>
                  <li>In the Cookies and Site Data section, click Manage Data</li>
                  <li>Configure your cookie preferences</li>
                </ol>

                <h4>Safari</h4>
                <ol>
                  <li>Go to Safari → Preferences</li>
                  <li>Click the Privacy tab</li>
                  <li>Choose your cookie and website data settings</li>
                  <li>Manage website data as needed</li>
                </ol>

                <h4>Microsoft Edge</h4>
                <ol>
                  <li>Click the three dots menu → Settings</li>
                  <li>Go to Cookies and site permissions</li>
                  <li>Click Cookies and site data</li>
                  <li>Configure your preferences</li>
                </ol>

                <h3>Mobile Browser Settings</h3>
                <p>
                  Mobile browsers also provide cookie controls:
                </p>
                <ul>
                  <li><strong>iOS Safari:</strong> Settings → Safari → Privacy & Security</li>
                  <li><strong>Android Chrome:</strong> Chrome menu → Settings → Site settings → Cookies</li>
                  <li><strong>Android Firefox:</strong> Firefox menu → Settings → Privacy</li>
                </ul>

                <h3>Impact of Disabling Cookies</h3>
                <p>
                  Disabling cookies may affect your experience on our website:
                </p>
                <ul>
                  <li>You may need to log in repeatedly</li>
                  <li>Your preferences and settings may not be saved</li>
                  <li>Some features may not work properly</li>
                  <li>Personalized content may not be available</li>
                  <li>Website performance may be reduced</li>
                </ul>
              </section>

              <section id="other-tracking" className="cookie-section">
                <div className="section-header">
                  <h2>7. Other Tracking Technologies</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  In addition to cookies, we may use other tracking technologies to enhance your experience and improve our services.
                </p>

                <h3>Web Beacons</h3>
                <p>
                  Web beacons (also known as pixel tags or clear GIFs) are small graphic images that may be included in our web pages and emails.
                </p>
                <ul>
                  <li><strong>Purpose:</strong> Track email opens, page views, and user interactions</li>
                  <li><strong>Information Collected:</strong> IP address, browser type, time of access</li>
                  <li><strong>Usage:</strong> Measure email campaign effectiveness and website analytics</li>
                </ul>

                <h3>Local Storage</h3>
                <p>
                  We may use HTML5 local storage and session storage to store information locally on your device.
                </p>
                <ul>
                  <li><strong>Purpose:</strong> Store user preferences and application state</li>
                  <li><strong>Benefits:</strong> Faster loading times and offline functionality</li>
                  <li><strong>Control:</strong> Can be cleared through browser settings</li>
                </ul>

                <h3>Server Logs</h3>
                <p>
                  Our servers automatically collect certain information when you visit our website.
                </p>
                <ul>
                  <li><strong>Information Collected:</strong> IP address, browser type, referring URLs, pages visited</li>
                  <li><strong>Purpose:</strong> Security monitoring, performance optimization, and analytics</li>
                  <li><strong>Retention:</strong> Log data is retained for security and operational purposes</li>
                </ul>

                <h3>Fingerprinting</h3>
                <p>
                  We do not use device fingerprinting techniques to track users across websites. Any device information collected is used solely for:
                </p>
                <ul>
                  <li>Fraud prevention and security</li>
                  <li>Optimizing website performance for your device</li>
                  <li>Providing appropriate content formatting</li>
                </ul>
              </section>

              <section id="data-protection" className="cookie-section">
                <div className="section-header">
                  <h2>8. Data Protection and Security</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  We take the security of cookie data seriously and implement appropriate measures to protect the information collected through cookies.
                </p>

                <h3>Security Measures</h3>
                <ul>
                  <li><strong>Encryption:</strong> Sensitive cookie data is encrypted in transit and at rest</li>
                  <li><strong>Secure Transmission:</strong> Cookies are transmitted over secure HTTPS connections</li>
                  <li><strong>Access Controls:</strong> Limited access to cookie data on a need-to-know basis</li>
                  <li><strong>Regular Audits:</strong> Periodic security reviews of cookie usage and data handling</li>
                  <li><strong>Data Minimization:</strong> We collect only necessary cookie data for specified purposes</li>
                </ul>

                <h3>Data Retention</h3>
                <p>
                  Cookie data is retained according to the following principles:
                </p>
                <ul>
                  <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                  <li><strong>Persistent Cookies:</strong> Retained for the specified duration or until manually deleted</li>
                  <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained longer for trend analysis</li>
                  <li><strong>User Control:</strong> You can delete cookies at any time through browser settings</li>
                </ul>

                <h3>International Transfers</h3>
                <p>
                  Some of our third-party service providers may process cookie data in countries outside your jurisdiction. We ensure:
                </p>
                <ul>
                  <li>Appropriate safeguards are in place for international data transfers</li>
                  <li>Service providers comply with applicable data protection laws</li>
                  <li>Contractual protections are established for cross-border data processing</li>
                  <li>Users are informed about international data processing</li>
                </ul>
              </section>

              <section id="legal-basis" className="cookie-section">
                <div className="section-header">
                  <h2>9. Legal Basis for Cookie Processing</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Our use of cookies is based on different legal grounds depending on the type of cookie and applicable laws.
                </p>

                <h3>GDPR Compliance (EU Users)</h3>
                <p>
                  For users in the European Union, our legal basis for cookie processing includes:
                </p>
                <ul>
                  <li><strong>Consent:</strong> For non-essential cookies, we obtain your explicit consent</li>
                  <li><strong>Legitimate Interest:</strong> For analytics and performance cookies that improve our services</li>
                  <li><strong>Contractual Necessity:</strong> For cookies essential to providing our services</li>
                  <li><strong>Legal Obligation:</strong> For cookies required by applicable laws</li>
                </ul>

                <h3>CCPA Compliance (California Users)</h3>
                <p>
                  For California residents, we provide:
                </p>
                <ul>
                  <li>Clear disclosure of cookie data collection practices</li>
                  <li>Opt-out mechanisms for the sale of personal information</li>
                  <li>Rights to know what cookie data is collected and how it's used</li>
                  <li>Non-discrimination for exercising privacy rights</li>
                </ul>

                <h3>Other Jurisdictions</h3>
                <p>
                  We comply with applicable cookie and privacy laws in all jurisdictions where we operate, including:
                </p>
                <ul>
                  <li>Providing clear notice about cookie usage</li>
                  <li>Obtaining appropriate consent where required</li>
                  <li>Offering opt-out mechanisms for non-essential cookies</li>
                  <li>Respecting user privacy preferences and choices</li>
                </ul>
              </section>

              <section id="updates-changes" className="cookie-section">
                <div className="section-header">
                  <h2>10. Updates to This Cookie Policy</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
                </p>

                <h3>Notification of Changes</h3>
                <p>
                  When we make material changes to this Cookie Policy, we will:
                </p>
                <ul>
                  <li>Update the "Last updated" date at the top of this policy</li>
                  <li>Notify you through our website banner or email</li>
                  <li>Provide a summary of key changes</li>
                  <li>Request new consent if required by law</li>
                  <li>Allow time for you to review the updated policy</li>
                </ul>

                <h3>Types of Changes</h3>
                <p>
                  Updates may include:
                </p>
                <ul>
                  <li>New types of cookies or tracking technologies</li>
                  <li>Changes to third-party service providers</li>
                  <li>Updates to legal requirements or compliance standards</li>
                  <li>Improvements to cookie management tools</li>
                  <li>Clarifications or additional information</li>
                </ul>

                <h3>Continued Use</h3>
                <p>
                  Your continued use of our website after any changes to this Cookie Policy constitutes acceptance of those changes, unless additional consent is required by applicable law.
                </p>
                <p>
                  We encourage you to review this Cookie Policy periodically to stay informed about our cookie practices and your choices.
                </p>
              </section>

              <section id="contact-support" className="cookie-section">
                <div className="section-header">
                  <h2>11. Contact Us</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  If you have any questions, concerns, or requests regarding this Cookie Policy or our cookie practices, please contact us:
                </p>
                <div className="contact-info">
                  <p><strong>Plugin Genius Cookie Support</strong></p>
                  <p>Email: cookies@plugingenius.com</p>
                  <p>Privacy Team: privacy@plugingenius.com</p>
                  <p>Address: 123 Innovation Drive, San Francisco, CA 94105</p>
                  <p>Phone: +1 (555) 123-4567</p>
                </div>
                <p>
                  We will respond to your cookie-related inquiries within 30 days. For urgent privacy matters, please indicate "URGENT COOKIE REQUEST" in your subject line.
                </p>
                <p>
                  For technical support or general inquiries unrelated to cookies, please visit our support center or contact support@plugingenius.com.
                </p>
                <h3>Data Protection Officer</h3>
                <p>
                  For privacy-related inquiries, you can also contact our Data Protection Officer at dpo@plugingenius.com.
                </p>
              </section>
            </div>

            <nav className="cookie-nav">
              <div className="cookie-nav-title">Quick Navigation</div>
              <div className="cookie-nav-links">
                <a href="#what-are-cookies" className="cookie-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('what-are-cookies'); }}>
                  1. What Are Cookies
                </a>
                <a href="#how-we-use-cookies" className="cookie-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('how-we-use-cookies'); }}>
                  2. How We Use Cookies
                </a>
                <a href="#types-of-cookies" className="cookie-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('types-of-cookies'); }}>
                  3. Types of Cookies
                </a>
                <a href="#third-party-cookies" className="cookie-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('third-party-cookies'); }}>
                  4. Third-Party Cookies
                </a>
                <a href="#cookie-consent" className="cookie-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('cookie-consent'); }}>
                  5. Cookie Consent
                </a>
                <a href="#browser-controls" className="cookie-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('browser-controls'); }}>
                  6. Browser Controls
                </a>
                <a href="#other-tracking" className="cookie-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('other-tracking'); }}>
                  7. Other Tracking
                </a>
                <a href="#data-protection" className="cookie-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('data-protection'); }}>
                  8. Data Protection
                </a>
                <a href="#legal-basis" className="cookie-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('legal-basis'); }}>
                  9. Legal Basis
                </a>
                <a href="#updates-changes" className="cookie-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('updates-changes'); }}>
                  10. Updates & Changes
                </a>
                <a href="#contact-support" className="cookie-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact-support'); }}>
                  11. Contact Us
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

export default CookiePage
