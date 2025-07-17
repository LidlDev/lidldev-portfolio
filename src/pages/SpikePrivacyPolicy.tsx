import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Users, Database, Bell, MessageCircle } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const SpikePrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Spike! Privacy Policy | LidlDev Portfolio';
    
    return () => {
      document.title = 'LidlDev Portfolio';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Back Navigation */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <Link 
          to="/project/Spike" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Spike! Project
        </Link>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Spike! Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span>Effective Date: January 17, 2025</span>
            <span>•</span>
            <span>Last Updated: January 17, 2025</span>
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
                Welcome to Spike! ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application Spike! (the "App"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Database className="w-6 h-6 mr-3 text-primary" />
                Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personal Information You Provide</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Account Information:</strong> Username, email address, and password when you create an account</li>
                    <li><strong>Profile Information:</strong> Profile pictures and display names</li>
                    <li><strong>Team Information:</strong> Team names, roles (coach/player), and team associations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Device Information:</strong> Device type, operating system, and app version</li>
                    <li><strong>Usage Data:</strong> App features used, session duration, and interaction patterns</li>
                    <li><strong>Push Notification Tokens:</strong> Firebase Cloud Messaging (FCM) tokens for notifications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Content You Create</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Team Chat Messages:</strong> Text messages, images, GIFs, voice messages, and reactions in team chats</li>
                    <li><strong>Volleyball Statistics:</strong> Player performance data, match results, and training records</li>
                    <li><strong>Tactical Diagrams:</strong> Custom plays and training drills you create</li>
                    <li><strong>Feedback and Support:</strong> Messages sent through our support system</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3 text-primary" />
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">We use the collected information for:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Account Management:</strong> Creating and maintaining your user account</li>
                <li><strong>Team Functionality:</strong> Enabling team creation, management, and member communication</li>
                <li><strong>Performance Tracking:</strong> Storing and analyzing volleyball statistics and performance data</li>
                <li><strong>Communication:</strong> Facilitating team chat, notifications, and announcements</li>
                <li><strong>App Improvement:</strong> Analyzing usage patterns to enhance app functionality</li>
                <li><strong>Customer Support:</strong> Responding to your inquiries and providing assistance</li>
                <li><strong>Security:</strong> Protecting against unauthorized access and maintaining data integrity</li>
              </ul>
            </section>

            {/* Data Storage and Security */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-primary" />
                Data Storage and Security
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Firebase Services</h3>
                  <p className="text-muted-foreground mb-2">We use Google Firebase services for:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Authentication:</strong> Secure user login and account management</li>
                    <li><strong>Cloud Firestore:</strong> Storing user data, team information, and app content</li>
                    <li><strong>Cloud Storage:</strong> Storing profile images and media files</li>
                    <li><strong>Cloud Messaging:</strong> Delivering push notifications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Security Measures</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Data is encrypted in transit and at rest</li>
                    <li>Access controls limit data access to authorized personnel only</li>
                    <li>Regular security audits and monitoring</li>
                    <li>Secure authentication protocols</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <MessageCircle className="w-6 h-6 mr-3 text-primary" />
                Data Sharing and Disclosure
              </h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Within Teams</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Team members can view each other's basic profile information</li>
                    <li>Coaches can access team statistics and performance data</li>
                    <li>Team chat messages are visible to all team members</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Service Providers</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Google Firebase for app infrastructure and data storage</li>
                    <li>Apple/Google for app distribution and push notifications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Legal Requirements</h3>
                  <p className="text-muted-foreground">We may disclose information if required by law or to:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Comply with legal processes</li>
                    <li>Protect our rights and property</li>
                    <li>Ensure user safety and security</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                Your Rights and Choices
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Control</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Access:</strong> View your personal information through the app</li>
                    <li><strong>Update:</strong> Modify your profile and account settings</li>
                    <li><strong>Delete:</strong> Request account deletion through app settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Communication Preferences</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Notifications:</strong> Control push notification settings in the app</li>
                    <li><strong>Team Communications:</strong> Leave teams or mute specific conversations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Data Portability</h3>
                  <p className="text-muted-foreground">
                    Contact us at <a href="mailto:admin@lidldev.com" className="text-primary hover:underline">admin@lidldev.com</a> to request a copy of your data
                  </p>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Database className="w-6 h-6 mr-3 text-primary" />
                Data Retention
              </h2>
              <p className="text-muted-foreground mb-4">We retain your information for as long as:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Your account remains active</li>
                <li>Necessary to provide app services</li>
                <li>Required by law or legitimate business purposes</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                When you delete your account, we will remove your personal information within 30 days, except where retention is required by law.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Spike! is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> <a href="mailto:admin@lidldev.com" className="text-primary hover:underline">admin@lidldev.com</a></p>
                <p><strong>Website:</strong> <a href="https://www.lidldev.com" className="text-primary hover:underline">https://www.lidldev.com</a></p>
                <p><strong>Developer:</strong> LidlDev (Harry)</p>
              </div>
            </section>

            {/* Consent */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Consent</h2>
              <p className="text-muted-foreground">
                By using Spike!, you consent to the collection and use of your information as described in this Privacy Policy.
              </p>
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

export default SpikePrivacyPolicy;
