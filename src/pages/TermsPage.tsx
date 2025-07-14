import React from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import '../styles/terms.css'

const TermsPage = () => {
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
    <div className="terms-page">
      <Navbar />
      <main className="terms-content">
        <div className="terms-container">
          <header className="terms-header">
            <h1>Terms of Service</h1>
            <p>
              These Terms of Service govern your use of Plugin Genius and the services we provide. By using our platform, you agree to these terms in full.
            </p>
            <div className="terms-meta">
              <span>Last updated: January 15, 2025</span>
              <span>Effective date: January 15, 2025</span>
            </div>
          </header>

          <div className="terms-layout">
            <div className="terms-main-content">
              <section id="acceptance" className="terms-section">
                <div className="section-header">
                  <h2>1. Acceptance of Terms</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  By accessing and using Plugin Genius ("Service", "Platform", "we", "us", or "our"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you", or "your") and Plugin Genius, governing your access to and use of our WordPress plugin development platform and related services.
                </p>
                <p>
                  We reserve the right to update and change the Terms of Service from time to time without notice. Any new features that augment or enhance the current Service, including the release of new tools and resources, shall be subject to the Terms of Service.
                </p>
              </section>

              <section id="description" className="terms-section">
                <div className="section-header">
                  <h2>2. Description of Service</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Plugin Genius is a web-based platform that provides tools and services for creating, managing, and deploying WordPress plugins. Our services include but are not limited to:
                </p>
                <ul>
                  <li>Visual plugin builder and code generation tools</li>
                  <li>Plugin templates and pre-built components</li>
                  <li>WordPress site integration and deployment services</li>
                  <li>Plugin management and version control</li>
                  <li>Documentation and support resources</li>
                  <li>API access for third-party integrations</li>
                </ul>
                <p>
                  The Service is provided on an "as is" and "as available" basis. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice.
                </p>
              </section>

              <section id="account" className="terms-section">
                <div className="section-header">
                  <h2>3. Account Registration and Security</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <h3>Account Creation</h3>
                <p>
                  To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
                <h3>Account Security</h3>
                <p>
                  You are responsible for safeguarding the password and all activities that occur under your account. You agree to:
                </p>
                <ul>
                  <li>Choose a strong, unique password for your account</li>
                  <li>Keep your login credentials confidential</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Log out of your account at the end of each session</li>
                </ul>
                <h3>Account Termination</h3>
                <p>
                  We reserve the right to terminate or suspend your account at any time for violations of these Terms or for any other reason at our sole discretion. You may terminate your account at any time by contacting our support team.
                </p>
              </section>

              <section id="usage" className="terms-section">
                <div className="section-header">
                  <h2>4. Acceptable Use Policy</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <h3>Permitted Uses</h3>
                <p>
                  You may use the Service for lawful purposes only and in accordance with these Terms. You agree to use the Service in a manner consistent with any and all applicable laws and regulations.
                </p>
                <h3>Prohibited Activities</h3>
                <p>
                  You agree not to use the Service to:
                </p>
                <ul>
                  <li>Create plugins that contain malicious code, viruses, or malware</li>
                  <li>Violate any applicable local, state, national, or international law</li>
                  <li>Infringe upon or violate our intellectual property rights or the rights of others</li>
                  <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>Submit false or misleading information</li>
                  <li>Upload or transmit viruses or any other type of malicious code</li>
                  <li>Spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>Interfere with or circumvent the security features of the Service</li>
                  <li>Reverse engineer, decompile, or disassemble any aspect of the Service</li>
                </ul>
                <h3>Content Standards</h3>
                <p>
                  All plugins and content created using our Service must comply with applicable laws and must not contain content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.
                </p>
              </section>

              <section id="intellectual-property" className="terms-section">
                <div className="section-header">
                  <h2>5. Intellectual Property Rights</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <h3>Your Content</h3>
                <p>
                  You retain all rights to the plugins and content you create using our Service. By using the Service, you grant us a limited, non-exclusive, royalty-free license to host, store, and display your content solely for the purpose of providing the Service.
                </p>
                <h3>Our Intellectual Property</h3>
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Plugin Genius and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used without our prior written consent.
                </p>
                <h3>Third-Party Content</h3>
                <p>
                  The Service may contain content provided by third parties. All third-party content is the sole responsibility of the party that makes it available. We are not responsible for third-party content and do not endorse any opinions expressed within third-party content.
                </p>
              </section>

              <section id="payment" className="terms-section">
                <div className="section-header">
                  <h2>6. Payment Terms and Billing</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <h3>Subscription Plans</h3>
                <p>
                  Plugin Genius offers various subscription plans with different features and usage limits. By subscribing to a paid plan, you agree to pay all applicable fees as described on our pricing page.
                </p>
                <h3>Billing and Payment</h3>
                <p>
                  Subscription fees are billed in advance on a monthly or annual basis, depending on your chosen plan. Payment is due immediately upon subscription and on each renewal date thereafter. We accept major credit cards and other payment methods as indicated on our platform.
                </p>
                <h3>Refunds and Cancellations</h3>
                <p>
                  You may cancel your subscription at any time through your account settings. Cancellations take effect at the end of the current billing period. We do not provide refunds for partial months or unused portions of your subscription, except as required by law.
                </p>
                <h3>Price Changes</h3>
                <p>
                  We reserve the right to modify our pricing at any time. Price changes will be communicated to you at least 30 days in advance and will take effect on your next billing cycle.
                </p>
              </section>

              <section id="privacy" className="terms-section">
                <div className="section-header">
                  <h2>7. Privacy and Data Protection</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using the Service, you agree to the collection and use of information in accordance with our Privacy Policy.
                </p>
                <h3>Data Security</h3>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
                <h3>Data Retention</h3>
                <p>
                  We retain your personal data only for as long as necessary to provide the Service and fulfill the purposes outlined in our Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>
              </section>

              <section id="disclaimers" className="terms-section">
                <div className="section-header">
                  <h2>8. Disclaimers and Warranties</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <h3>Service Availability</h3>
                <p>
                  While we strive to maintain high availability, we do not guarantee that the Service will be available at all times. The Service may be subject to limitations, delays, and other problems inherent in the use of the Internet and electronic communications.
                </p>
                <h3>Disclaimer of Warranties</h3>
                <p>
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                </p>
                <h3>Plugin Functionality</h3>
                <p>
                  We do not warrant that plugins created using our Service will be error-free, secure, or compatible with all WordPress installations. You are responsible for testing and validating all plugins before deployment to production environments.
                </p>
              </section>

              <section id="limitation" className="terms-section">
                <div className="section-header">
                  <h2>9. Limitation of Liability</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PLUGIN GENIUS, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.
                </p>
                <p>
                  IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, AND CAUSES OF ACTION EXCEED THE AMOUNT YOU HAVE PAID TO US IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO SUCH LIABILITY.
                </p>
                <p>
                  SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, SO THE ABOVE LIMITATION MAY NOT APPLY TO YOU.
                </p>
              </section>

              <section id="indemnification" className="terms-section">
                <div className="section-header">
                  <h2>10. Indemnification</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  You agree to defend, indemnify, and hold harmless Plugin Genius and its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from:
                </p>
                <ul>
                  <li>Your use of and access to the Service</li>
                  <li>Your violation of any term of these Terms</li>
                  <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right</li>
                  <li>Any claim that your use of the Service caused damage to a third party</li>
                  <li>Any plugins or content you create, distribute, or deploy using our Service</li>
                </ul>
                <p>
                  This defense and indemnification obligation will survive these Terms and your use of the Service.
                </p>
              </section>

              <section id="termination" className="terms-section">
                <div className="section-header">
                  <h2>11. Termination</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <h3>Termination by You</h3>
                <p>
                  You may terminate your account at any time by contacting our support team or through your account settings. Upon termination, your right to use the Service will cease immediately.
                </p>
                <h3>Termination by Us</h3>
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.
                </p>
                <h3>Effect of Termination</h3>
                <p>
                  Upon termination, all provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                </p>
                <p>
                  You will have 30 days after termination to export your plugins and data. After this period, we may delete your account and all associated data.
                </p>
              </section>

              <section id="governing-law" className="terms-section">
                <div className="section-header">
                  <h2>12. Governing Law and Dispute Resolution</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <h3>Governing Law</h3>
                <p>
                  These Terms shall be interpreted and governed by the laws of the State of California, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
                <h3>Dispute Resolution</h3>
                <p>
                  Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association. The arbitration shall be conducted in San Francisco, California.
                </p>
                <h3>Class Action Waiver</h3>
                <p>
                  You agree that any arbitration or proceeding shall be limited to the dispute between us and you individually. You waive any right to participate in a class action lawsuit or class-wide arbitration.
                </p>
              </section>

              <section id="miscellaneous" className="terms-section">
                <div className="section-header">
                  <h2>13. Miscellaneous</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <h3>Entire Agreement</h3>
                <p>
                  These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have had between us regarding the Service.
                </p>
                <h3>Severability</h3>
                <p>
                  If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                </p>
                <h3>Assignment</h3>
                <p>
                  We may assign our rights and obligations under these Terms to any party at any time without notice to you. You may not assign your rights under these Terms without our prior written consent.
                </p>
                <h3>No Waiver</h3>
                <p>
                  Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.
                </p>
                <h3>Force Majeure</h3>
                <p>
                  We shall not be liable for any failure or delay in performance under these Terms which is due to fire, flood, earthquake, elements of nature, acts of God, acts of war, terrorism, riots, civil disorders, rebellions, or other similar causes beyond our reasonable control.
                </p>
              </section>

              <section id="contact" className="terms-section">
                <div className="section-header">
                  <h2>14. Contact Information</h2>
                  <a href="#" className="back-to-top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
                    Back to top
                  </a>
                </div>
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="contact-info">
                  <p><strong>Plugin Genius Legal Team</strong></p>
                  <p>Email: legal@plugingenius.com</p>
                  <p>Address: 123 Innovation Drive, San Francisco, CA 94105</p>
                  <p>Phone: +1 (555) 123-4567</p>
                </div>
                <p>
                  For general support inquiries, please visit our support center or contact support@plugingenius.com.
                </p>
              </section>
            </div>

            <nav className="terms-nav">
              <div className="terms-nav-title">Quick Navigation</div>
              <div className="terms-nav-links">
                <a href="#acceptance" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('acceptance'); }}>
                  1. Acceptance of Terms
                </a>
                <a href="#description" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('description'); }}>
                  2. Description of Service
                </a>
                <a href="#account" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('account'); }}>
                  3. Account Registration
                </a>
                <a href="#usage" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('usage'); }}>
                  4. Acceptable Use Policy
                </a>
                <a href="#intellectual-property" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('intellectual-property'); }}>
                  5. Intellectual Property
                </a>
                <a href="#payment" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('payment'); }}>
                  6. Payment Terms
                </a>
                <a href="#privacy" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('privacy'); }}>
                  7. Privacy & Data
                </a>
                <a href="#disclaimers" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('disclaimers'); }}>
                  8. Disclaimers
                </a>
                <a href="#limitation" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('limitation'); }}>
                  9. Limitation of Liability
                </a>
                <a href="#indemnification" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('indemnification'); }}>
                  10. Indemnification
                </a>
                <a href="#termination" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('termination'); }}>
                  11. Termination
                </a>
                <a href="#governing-law" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('governing-law'); }}>
                  12. Governing Law
                </a>
                <a href="#miscellaneous" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('miscellaneous'); }}>
                  13. Miscellaneous
                </a>
                <a href="#contact" className="terms-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
                  14. Contact Information
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

export default TermsPage
