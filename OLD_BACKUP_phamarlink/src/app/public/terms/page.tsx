'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from './terms.module.css';

export default function Terms() {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Terms of Service - MedFind</title>
        <meta name="description" content="Terms and conditions for using our pharmacy finder service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.subtitle}>Last Updated: May 20, 2025</p>
        </div>

        <div className={styles.content}>
          <div className={styles.tableOfContents}>
            <h2>Contents</h2>
            <ul>
              <li>
                <button
                  className={activeSection === 'introduction' ? styles.active : ''}
                  onClick={() => scrollToSection('introduction')}
                >
                  1. Introduction
                </button>
              </li>
              <li>
                <button
                  className={activeSection === 'definitions' ? styles.active : ''}
                  onClick={() => scrollToSection('definitions')}
                >
                  2. Definitions
                </button>
              </li>
              <li>
                <button
                  className={activeSection === 'account' ? styles.active : ''}
                  onClick={() => scrollToSection('account')}
                >
                  3. Account Registration
                </button>
              </li>
              <li>
                <button
                  className={activeSection === 'pharmacy' ? styles.active : ''}
                  onClick={() => scrollToSection('pharmacy')}
                >
                  4. Pharmacy Services
                </button>
              </li>
              <li>
                <button
                  className={activeSection === 'ordering' ? styles.active : ''}
                  onClick={() => scrollToSection('ordering')}
                >
                  5. Ordering & Delivery
                </button>
              </li>
              <li>
                <button
                  className={activeSection === 'limitations' ? styles.active : ''}
                  onClick={() => scrollToSection('limitations')}
                >
                  6. Limitations of Liability
                </button>
              </li>
              <li>
                <button
                  className={activeSection === 'termination' ? styles.active : ''}
                  onClick={() => scrollToSection('termination')}
                >
                  7. Termination
                </button>
              </li>
              <li>
                <button
                  className={activeSection === 'changes' ? styles.active : ''}
                  onClick={() => scrollToSection('changes')}
                >
                  8. Changes to Terms
                </button>
              </li>
              <li>
                <button
                  className={activeSection === 'contact' ? styles.active : ''}
                  onClick={() => scrollToSection('contact')}
                >
                  9. Contact Us
                </button>
              </li>
            </ul>
          </div>

          <div className={styles.termsContent}>
            <section id="introduction" className={styles.section}>
              <h2>1. Introduction</h2>
              <p>Welcome to our pharmacy finder platform. These Terms of Service ("Terms") govern your use of our website, mobile application, and services (collectively, the "Platform"). By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Platform.</p>
              <p>Our Platform connects users with pharmacies, allowing users to search for medications, compare prices, check availability, and potentially place orders for pickup or delivery, subject to applicable laws and regulations.</p>
            </section>

            <section id="definitions" className={styles.section}>
              <h2>2. Definitions</h2>
              <p><strong>"Platform"</strong> refers to our website, mobile applications, and related services.</p>
              <p><strong>"User"</strong> or <strong>"You"</strong> refers to individuals who register to use our Platform as patients/customers.</p>
              <p><strong>"Pharmacy"</strong> refers to registered and licensed pharmaceutical businesses that list their inventory and services on our Platform.</p>
              <p><strong>"Content"</strong> includes text, graphics, images, information, and other materials displayed on our Platform.</p>
            </section>

            <section id="account" className={styles.section}>
              <h2>3. Account Registration</h2>
              <p>To access certain features of our Platform, you must create an account. When registering, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

              <p>You must be at least 18 years old to create an account. By creating an account, you represent and warrant that:</p>
              <ul>
                <li>You are at least 18 years old</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You will comply with these Terms and all applicable local, state, national, and international laws, rules, and regulations</li>
              </ul>

              <p>We reserve the right to suspend or terminate your account if we suspect any information provided is inaccurate, misleading, or incomplete.</p>
            </section>

            <section id="pharmacy" className={styles.section}>
              <h2>4. Pharmacy Services</h2>
              <p>Our Platform enables you to search for medications, compare prices, and check availability at participating pharmacies. However, we do not:</p>
              <ul>
                <li>Guarantee the accuracy of pharmacy inventory information</li>
                <li>Guarantee medication availability</li>
                <li>Provide medical or pharmaceutical advice</li>
                <li>Fill or dispense medications</li>
              </ul>

              <p>All pharmaceutical services are provided directly by the pharmacies. We act solely as an intermediary platform connecting users with pharmacies. Any transaction for medications occurs directly between you and the pharmacy.</p>

              <p>Prescription medications require a valid prescription from a licensed healthcare provider in accordance with all applicable laws and regulations.</p>
            </section>

            <section id="ordering" className={styles.section}>
              <h2>5. Ordering & Delivery</h2>
              <p>When placing an order through our Platform:</p>
              <ul>
                <li>You agree to provide accurate prescription information when required</li>
                <li>You authorize the selected pharmacy to fulfill your order</li>
                <li>You agree to pay the listed price plus any applicable taxes, fees, or delivery charges</li>
                <li>You understand that delivery timeframes are estimates and not guarantees</li>
              </ul>

              <p>Pharmacies maintain the right to refuse to fill prescriptions if, in their professional judgment, doing so would be inappropriate, illegal, or potentially harmful.</p>

              <p>Refunds and return policies are determined by individual pharmacies and applicable regulations governing pharmaceutical products.</p>
            </section>

            <section id="limitations" className={styles.section}>
              <h2>6. Limitations of Liability</h2>
              <p>To the maximum extent permitted by law, we and our affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from:</p>
              <ul>
                <li>Your access to or use of or inability to access or use the Platform</li>
                <li>Any conduct or content of any third party on the Platform</li>
                <li>Any content obtained from the Platform</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>

              <p>Our Platform is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied.</p>

              <p>We do not endorse any specific medication, pharmacy, or treatment and are not responsible for any adverse effects or outcomes resulting from medications or services obtained through pharmacies connected via our Platform.</p>
            </section>

            <section id="termination" className={styles.section}>
              <h2>7. Termination</h2>
              <p>We reserve the right to suspend or terminate your access to our Platform at any time, with or without cause, and with or without notice.</p>

              <p>You may terminate your account at any time by contacting us through our support channels.</p>

              <p>Upon termination:</p>
              <ul>
                <li>Your right to access and use the Platform will immediately cease</li>
                <li>We may delete or archive your account information and content</li>
                <li>Any pending transactions may be canceled</li>
              </ul>

              <p>The provisions of these Terms which by their nature should survive termination shall survive termination, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
            </section>

            <section id="changes" className={styles.section}>
              <h2>8. Changes to Terms</h2>
              <p>We may modify these Terms at any time. Any changes will be effective immediately upon posting the updated Terms on our Platform. Your continued use of our Platform following the posting of revised Terms constitutes your acceptance of such changes.</p>

              <p>We encourage you to review the Terms regularly. If you do not agree to the modified terms, you should discontinue your use of our Platform.</p>

              <p>For material changes, we will make reasonable efforts to provide notice, such as through a prominent notice on our Platform or by sending you an email.</p>
            </section>

            <section id="contact" className={styles.section}>
              <h2>9. Contact Us</h2>
              <p>If you have any questions or concerns about these Terms or our Platform, please contact us at:</p>
              <address>
                Legal Department<br />
                MedFind, Inc.<br />
                1234 Pharmacy Lane<br />
                Healthville, MH 56789<br />
                Email: legal@medfind.example.com<br />
                Phone: (555) 123-4567
              </address>
            </section>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2025 MedFind. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}