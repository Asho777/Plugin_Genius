import React from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import '../styles/privacy.css'

const PrivacyPage = () => {
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
    <div className="privacy-page">
      <Navbar />
      <main className="privacy-content">
        <div className="privacy-container">
          <header className="privacy-header">
            <h1>Privacy Policy</h1>
            <p>
              This Privacy Policy describes how Plugin Genius collects, uses, and protects your personal information when you use our WordPress plugin development platform and related services.
            </p>
            <div className="privacy-meta">
              <span>Last updated: January 15, 2025</span>
              <span>Effective date: January 15, 2025</span>
            </div>
          </header>

          <div className="privacy-layout">
            <div className="privacy-main-content">
              <section id="overview" className="privacy-section">
                <div className="section-header">
                  <h2>1. Overview</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  At Plugin Genius ("we", "us", "our"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
                <p>
                  By using Plugin Genius, you consent to the data practices described in this Privacy Policy. If you do not agree with the practices described in this policy, please do not use our services.
                </p>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section id="information-collected" className="privacy-section">
                <div className="section-header">
                  <h2>2. Information We Collect</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <h3>Personal Information</h3>
                <p>
                  We collect personal information that you voluntarily provide to us when you:
                </p>
                <ul>
                  <li>Create an account on our platform</li>
                  <li>Subscribe to our services or newsletters</li>
                  <li>Contact us for support or inquiries</li>
                  <li>Participate in surveys, contests, or promotions</li>
                  <li>Use our plugin development tools and services</li>
                </ul>
                <p>
                  This personal information may include:
                </p>
                <ul>
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Billing and payment information</li>
                  <li>Professional information (company name, job title)</li>
                  <li>Profile information and preferences</li>
                  <li>Communications and correspondence with us</li>
                </ul>

                <h3>Technical Information</h3>
                <p>
                  We automatically collect certain technical information when you use our services:
                </p>
                <ul>
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Log files and server data</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Performance and analytics data</li>
                </ul>

                <h3>Plugin and Content Data</h3>
                <p>
                  When you use our plugin development tools, we may collect:
                </p>
                <ul>
                  <li>Plugin code, configurations, and metadata</li>
                  <li>WordPress site information (if connected)</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Error logs and debugging information</li>
                </ul>
              </section>

              <section id="how-we-use" className="privacy-section">
                <div className="section-header">
                  <h2>3. How We Use Your Information</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  We use the information we collect for various purposes, including:
                </p>

                <h3>Service Provision</h3>
                <ul>
                  <li>Providing and maintaining our plugin development platform</li>
                  <li>Processing your account registration and authentication</li>
                  <li>Enabling plugin creation, management, and deployment</li>
                  <li>Facilitating WordPress site integrations</li>
                  <li>Processing payments and managing subscriptions</li>
                </ul>

                <h3>Communication</h3>
                <ul>
                  <li>Sending service-related notifications and updates</li>
                  <li>Responding to your inquiries and support requests</li>
                  <li>Providing technical support and troubleshooting</li>
                  <li>Sending marketing communications (with your consent)</li>
                  <li>Notifying you about changes to our services or policies</li>
                </ul>

                <h3>Improvement and Analytics</h3>
                <ul>
                  <li>Analyzing usage patterns to improve our services</li>
                  <li>Conducting research and development</li>
                  <li>Monitoring and analyzing trends and user behavior</li>
                  <li>Optimizing platform performance and user experience</li>
                  <li>Developing new features and functionality</li>
                </ul>

                <h3>Legal and Security</h3>
                <ul>
                  <li>Complying with legal obligations and regulations</li>
                  <li>Protecting against fraud, abuse, and security threats</li>
                  <li>Enforcing our Terms of Service and other policies</li>
                  <li>Resolving disputes and legal claims</li>
                </ul>
              </section>

              <section id="information-sharing" className="privacy-section">
                <div className="section-header">
                  <h2>4. Information Sharing and Disclosure</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>

                <h3>Service Providers</h3>
                <p>
                  We may share your information with trusted third-party service providers who assist us in operating our platform:
                </p>
                <ul>
                  <li>Cloud hosting and infrastructure providers</li>
                  <li>Payment processing services</li>
                  <li>Email and communication services</li>
                  <li>Analytics and monitoring tools</li>
                  <li>Customer support platforms</li>
                </ul>
                <p>
                  These service providers are contractually obligated to protect your information and use it only for the purposes we specify.
                </p>

                <h3>Legal Requirements</h3>
                <p>
                  We may disclose your information if required to do so by law or in response to:
                </p>
                <ul>
                  <li>Valid legal processes (subpoenas, court orders)</li>
                  <li>Government requests or investigations</li>
                  <li>Compliance with regulatory requirements</li>
                  <li>Protection of our rights, property, or safety</li>
                  <li>Protection of users' rights, property, or safety</li>
                </ul>

                <h3>Business Transfers</h3>
                <p>
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity, subject to the same privacy protections outlined in this policy.
                </p>

                <h3>Consent</h3>
                <p>
                  We may share your information with your explicit consent or at your direction, such as when you choose to integrate with third-party services.
                </p>
              </section>

              <section id="data-security" className="privacy-section">
                <div className="section-header">
                  <h2>5. Data Security</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  We implement comprehensive security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction:
                </p>

                <h3>Technical Safeguards</h3>
                <ul>
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure Socket Layer (SSL) technology for data transmission</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Multi-factor authentication for account access</li>
                  <li>Secure cloud infrastructure with industry-standard protections</li>
                </ul>

                <h3>Administrative Safeguards</h3>
                <ul>
                  <li>Access controls and user permission management</li>
                  <li>Employee training on data protection and privacy</li>
                  <li>Regular review and update of security policies</li>
                  <li>Incident response and breach notification procedures</li>
                  <li>Third-party security certifications and compliance</li>
                </ul>

                <h3>Physical Safeguards</h3>
                <ul>
                  <li>Secure data centers with restricted access</li>
                  <li>Environmental controls and monitoring</li>
                  <li>Backup and disaster recovery systems</li>
                  <li>Hardware security and disposal procedures</li>
                </ul>

                <p>
                  While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest standards of data protection.
                </p>
              </section>

              <section id="data-retention" className="privacy-section">
                <div className="section-header">
                  <h2>6. Data Retention</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>

                <h3>Retention Periods</h3>
                <ul>
                  <li><strong>Account Information:</strong> Retained while your account is active and for a reasonable period after account closure</li>
                  <li><strong>Plugin Data:</strong> Retained according to your subscription plan and backup policies</li>
                  <li><strong>Payment Information:</strong> Retained for tax and accounting purposes as required by law</li>
                  <li><strong>Support Communications:</strong> Retained for customer service and legal purposes</li>
                  <li><strong>Usage Analytics:</strong> Aggregated data may be retained indefinitely for service improvement</li>
                </ul>

                <h3>Data Deletion</h3>
                <p>
                  When we no longer need your personal information, we will:
                </p>
                <ul>
                  <li>Securely delete or anonymize the data</li>
                  <li>Remove it from our active systems</li>
                  <li>Ensure it cannot be recovered or reconstructed</li>
                  <li>Notify relevant service providers to delete their copies</li>
                </ul>

                <p>
                  You may request deletion of your personal information at any time, subject to legal and contractual obligations.
                </p>
              </section>

              <section id="your-rights" className="privacy-section">
                <div className="section-header">
                  <h2>7. Your Privacy Rights</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>

                <h3>Access and Portability</h3>
                <ul>
                  <li>Request access to your personal information</li>
                  <li>Obtain a copy of your data in a portable format</li>
                  <li>Review how your information is being used</li>
                </ul>

                <h3>Correction and Updates</h3>
                <ul>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Update your account and profile information</li>
                  <li>Modify your communication preferences</li>
                </ul>

                <h3>Deletion and Restriction</h3>
                <ul>
                  <li>Request deletion of your personal information</li>
                  <li>Restrict processing of your data</li>
                  <li>Object to certain uses of your information</li>
                </ul>

                <h3>Consent Management</h3>
                <ul>
                  <li>Withdraw consent for data processing</li>
                  <li>Opt out of marketing communications</li>
                  <li>Manage cookie and tracking preferences</li>
                </ul>

                <h3>Exercising Your Rights</h3>
                <p>
                  To exercise these rights, please contact us at privacy@plugingenius.com. We will respond to your request within 30 days and may require verification of your identity to protect your privacy.
                </p>
              </section>

              <section id="cookies" className="privacy-section">
                <div className="section-header">
                  <h2>8. Cookies and Tracking Technologies</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  We use cookies and similar tracking technologies to enhance your experience on our platform:
                </p>

                <h3>Types of Cookies</h3>
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality and security</li>
                  <li><strong>Performance Cookies:</strong> Help us analyze usage and improve our services</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising and marketing (with consent)</li>
                </ul>

                <h3>Third-Party Cookies</h3>
                <p>
                  We may use third-party services that set cookies on our behalf:
                </p>
                <ul>
                  <li>Google Analytics for usage analytics</li>
                  <li>Payment processors for transaction security</li>
                  <li>Customer support tools for service delivery</li>
                  <li>Marketing platforms for campaign management</li>
                </ul>

                <h3>Cookie Management</h3>
                <p>
                  You can control cookies through your browser settings or our cookie preference center. Note that disabling certain cookies may affect platform functionality.
                </p>
              </section>

              <section id="international-transfers" className="privacy-section">
                <div className="section-header">
                  <h2>9. International Data Transfers</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Plugin Genius operates globally, and your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers:
                </p>

                <h3>Transfer Mechanisms</h3>
                <ul>
                  <li>Standard Contractual Clauses (SCCs) approved by regulatory authorities</li>
                  <li>Adequacy decisions for countries with equivalent protection levels</li>
                  <li>Binding Corporate Rules for intra-group transfers</li>
                  <li>Certification schemes and codes of conduct</li>
                </ul>

                <h3>Data Processing Locations</h3>
                <p>
                  Your data may be processed in:
                </p>
                <ul>
                  <li>United States (primary data centers)</li>
                  <li>European Union (for EU users)</li>
                  <li>Other countries where our service providers operate</li>
                </ul>

                <p>
                  We ensure that all international transfers comply with applicable data protection laws and provide adequate protection for your personal information.
                </p>
              </section>

              <section id="children-privacy" className="privacy-section">
                <div className="section-header">
                  <h2>10. Children's Privacy</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Plugin Genius is not intended for use by children under the age of 13 (or the minimum age in your jurisdiction). We do not knowingly collect personal information from children under 13.
                </p>
                <p>
                  If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to remove that information from our servers promptly.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@plugingenius.com so we can take appropriate action.
                </p>
              </section>

              <section id="california-privacy" className="privacy-section">
                <div className="section-header">
                  <h2>11. California Privacy Rights</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
                </p>

                <h3>Right to Know</h3>
                <ul>
                  <li>Categories of personal information we collect</li>
                  <li>Sources from which we collect information</li>
                  <li>Business purposes for collecting information</li>
                  <li>Categories of third parties with whom we share information</li>
                </ul>

                <h3>Right to Delete</h3>
                <p>
                  You have the right to request deletion of your personal information, subject to certain exceptions.
                </p>

                <h3>Right to Opt-Out</h3>
                <p>
                  You have the right to opt out of the sale of your personal information. We do not sell personal information to third parties.
                </p>

                <h3>Non-Discrimination</h3>
                <p>
                  We will not discriminate against you for exercising your CCPA rights.
                </p>

                <p>
                  To exercise your California privacy rights, please contact us at privacy@plugingenius.com or call our toll-free number at 1-800-PRIVACY.
                </p>
              </section>

              <section id="gdpr-compliance" className="privacy-section">
                <div className="section-header">
                  <h2>12. GDPR Compliance</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  If you are located in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR):
                </p>

                <h3>Legal Basis for Processing</h3>
                <ul>
                  <li><strong>Contract:</strong> Processing necessary for service provision</li>
                  <li><strong>Legitimate Interest:</strong> Service improvement and security</li>
                  <li><strong>Consent:</strong> Marketing communications and optional features</li>
                  <li><strong>Legal Obligation:</strong> Compliance with applicable laws</li>
                </ul>

                <h3>Data Protection Officer</h3>
                <p>
                  We have appointed a Data Protection Officer (DPO) who can be contacted at dpo@plugingenius.com for privacy-related inquiries.
                </p>

                <h3>Supervisory Authority</h3>
                <p>
                  You have the right to lodge a complaint with your local data protection authority if you believe we have not complied with GDPR requirements.
                </p>
              </section>

              <section id="changes-policy" className="privacy-section">
                <div className="section-header">
                  <h2>13. Changes to This Privacy Policy</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
                </p>

                <h3>Notification of Changes</h3>
                <p>
                  When we make material changes to this Privacy Policy, we will:
                </p>
                <ul>
                  <li>Update the "Last updated" date at the top of this policy</li>
                  <li>Notify you via email or platform notification</li>
                  <li>Provide a summary of key changes</li>
                  <li>Request your consent for material changes where required</li>
                </ul>

                <h3>Continued Use</h3>
                <p>
                  Your continued use of our services after any changes to this Privacy Policy constitutes acceptance of those changes, unless additional consent is required by law.
                </p>

                <p>
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                </p>
              </section>

              <section id="contact-us" className="privacy-section">
                <div className="section-header">
                  <h2>14. Contact Us</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="contact-info">
                  <p><strong>Plugin Genius Privacy Team</strong></p>
                  <p>Email: privacy@plugingenius.com</p>
                  <p>Address: 123 Innovation Drive, San Francisco, CA 94105</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Data Protection Officer: dpo@plugingenius.com</p>
                </div>
                <p>
                  We will respond to your privacy-related inquiries within 30 days. For urgent matters, please indicate "URGENT PRIVACY REQUEST" in your subject line.
                </p>
                <p>
                  For general support inquiries unrelated to privacy, please visit our support center or contact support@plugingenius.com.
                </p>
              </section>
            </div>

            <nav className="privacy-nav">
              <div className="privacy-nav-title">Quick Navigation</div>
              <div className="privacy-nav-links">
                <a href="#overview" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('overview'); }}>
                  1. Overview
                </a>
                <a href="#information-collected" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('information-collected'); }}>
                  2. Information We Collect
                </a>
                <a href="#how-we-use" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('how-we-use'); }}>
                  3. How We Use Information
                </a>
                <a href="#information-sharing" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('information-sharing'); }}>
                  4. Information Sharing
                </a>
                <a href="#data-security" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('data-security'); }}>
                  5. Data Security
                </a>
                <a href="#data-retention" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('data-retention'); }}>
                  6. Data Retention
                </a>
                <a href="#your-rights" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('your-rights'); }}>
                  7. Your Privacy Rights
                </a>
                <a href="#cookies" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('cookies'); }}>
                  8. Cookies & Tracking
                </a>
                <a href="#international-transfers" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('international-transfers'); }}>
                  9. International Transfers
                </a>
                <a href="#children-privacy" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('children-privacy'); }}>
                  10. Children's Privacy
                </a>
                <a href="#california-privacy" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('california-privacy'); }}>
                  11. California Rights
                </a>
                <a href="#gdpr-compliance" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('gdpr-compliance'); }}>
                  12. GDPR Compliance
                </a>
                <a href="#changes-policy" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('changes-policy'); }}>
                  13. Policy Changes
                </a>
                <a href="#contact-us" className="privacy-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact-us'); }}>
                  14. Contact Us
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

export default PrivacyPage
