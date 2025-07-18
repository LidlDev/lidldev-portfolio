import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Users, Database, Bell, Globe, Mail } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for LidlDev Portfolio - Learn how we collect, use, and protect your information when you visit our website."
        url="https://www.lidldev.com/privacy"
      />
      <NavigationBar />
      
      {/* Back Navigation */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span>Effective Date: January 18, 2025</span>
            <span>•</span>
            <span>Last Updated: January 18, 2025</span>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 rounded-2xl space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-primary" />
                Introduction
              </h2>
              <p className="text-foreground leading-relaxed">
                Welcome to LidlDev Portfolio ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at www.lidldev.com (the "Website"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the website.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Database className="w-6 h-6 mr-3 text-primary" />
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                  <p className="text-muted-foreground">
                    We may collect personal information that you voluntarily provide when you contact us through our contact form, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Message content</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Automatically Collected Information</h3>
                  <p className="text-muted-foreground">
                    When you visit our website, we may automatically collect certain information about your device and usage:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited and time spent</li>
                    <li>Referring website</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3 text-primary" />
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>To respond to your inquiries and provide customer support</li>
                <li>To improve our website and user experience</li>
                <li>To analyze website usage and performance</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-primary" />
                Information Sharing and Disclosure
              </h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal requirements or court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-3 text-primary" />
                Third-Party Services
              </h2>
              <p className="text-muted-foreground mb-4">
                Our website may use third-party services that collect information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>GitHub API:</strong> We use GitHub's API to display public repository information</li>
                <li><strong>Analytics:</strong> We may use analytics services to understand website usage</li>
                <li><strong>Hosting Services:</strong> Our website is hosted on third-party platforms</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                These third-party services have their own privacy policies, and we encourage you to review them.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-primary" />
                Data Security
              </h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3 text-primary" />
                Your Rights
              </h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to delete your personal information</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Cookies and Local Storage</h2>
              <p className="text-muted-foreground">
                Our website may use cookies and local storage to enhance your browsing experience. These technologies help us remember your preferences (such as theme settings) and analyze website usage. You can control cookie settings through your browser preferences.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-3 text-primary" />
                Contact Us
              </h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> <a href="mailto:harry@lidldev.com" className="text-primary hover:underline">harry@lidldev.com</a></p>
                <p><strong>Website:</strong> <a href="https://www.lidldev.com" className="text-primary hover:underline">https://www.lidldev.com</a></p>
                <p><strong>Developer:</strong> LidlDev (Harry)</p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground italic text-center">
                This privacy policy is designed to be transparent about our data practices while ensuring your privacy rights are protected.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
