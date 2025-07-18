import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale, FileText, User, Shield, Phone, Award, BarChart3, Mail } from "lucide-react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

const SpikeTermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Spike! Terms of Service"
        description="Terms of Service for Spike! volleyball app - Learn about the terms and conditions for using our volleyball team management and statistics application."
        url="https://www.lidldev.com/spike/terms-of-service"
      />
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
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Spike! Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using the Spike! volleyball app.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span>Effective Date: January 18, 2025</span>
            <span>•</span>
            <span>Last Updated: January 18, 2025</span>
          </div>
        </div>

        {/* Terms Content */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 rounded-2xl space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-primary" />
                Introduction
              </h2>
              <p className="text-foreground leading-relaxed">
                Welcome to Spike! ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of the Spike! mobile application (the "App") developed by LidlDev (Harry). By downloading, installing, or using our App, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not use the App.
              </p>
            </section>

            {/* App Description */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Phone className="w-6 h-6 mr-3 text-primary" />
                About Spike!
              </h2>
              <p className="text-muted-foreground mb-4">
                Spike! is a comprehensive volleyball team management application that provides:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Team Management:</strong> Create and manage volleyball teams with coach and player roles</li>
                <li><strong>Statistics Tracking:</strong> Record and analyze volleyball performance statistics</li>
                <li><strong>Team Communication:</strong> Chat functionality for team coordination and announcements</li>
                <li><strong>Tactical Planning:</strong> Create and share volleyball tactics and playbooks</li>
                <li><strong>Competition Management:</strong> Track competitions, fixtures, and results</li>
                <li><strong>Training Resources:</strong> Access volleyball training videos and educational content</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <User className="w-6 h-6 mr-3 text-primary" />
                User Accounts and Registration
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  To use certain features of the App, you must create an account. You may register using:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Email and password</li>
                  <li>Apple Sign In</li>
                  <li>Google Sign In</li>
                  <li>Anonymous authentication (limited features)</li>
                </ul>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </div>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                User Conduct and Responsibilities
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>When using the App, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide accurate and truthful information</li>
                  <li>Use the App only for lawful purposes</li>
                  <li>Respect other users and maintain appropriate communication</li>
                  <li>Not share inappropriate, offensive, or harmful content</li>
                  <li>Not attempt to hack, reverse engineer, or compromise the App's security</li>
                  <li>Not use the App to spam, harass, or abuse other users</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these terms or engage in inappropriate behavior.
                </p>
              </div>
            </section>

            {/* Team Features */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Award className="w-6 h-6 mr-3 text-primary" />
                Team Features and Data
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The App allows you to create and join volleyball teams. By participating in team features, you understand that:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Team members can view each other's basic profile information</li>
                  <li>Coaches have access to team statistics and performance data</li>
                  <li>Team chat messages are visible to all team members</li>
                  <li>Statistics and performance data may be shared within your team</li>
                  <li>You can leave teams at any time through the App settings</li>
                </ul>
              </div>
            </section>

            {/* Data and Privacy */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-primary" />
                Data Collection and Privacy
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Your privacy is important to us. The App collects and processes data as described in our Privacy Policy, including:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Account information (username, email, profile data)</li>
                  <li>Volleyball statistics and performance data</li>
                  <li>Team communications and chat messages</li>
                  <li>App usage and analytics data</li>
                </ul>
                <p>
                  By using the App, you consent to the collection and use of your information as described in our <Link to="/spike/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The App and its original content, features, and functionality are owned by LidlDev and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p>
                  You retain ownership of any content you create or upload to the App, but you grant us a license to use, store, and display such content as necessary to provide the App's services.
                </p>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Disclaimers and Limitations</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The App is provided "as is" without warranties of any kind. We do not guarantee that the App will be error-free, secure, or continuously available.
                </p>
                <p>
                  We are not responsible for any loss of data, statistics, or other content. Users are encouraged to maintain their own backups of important information.
                </p>
                <p>
                  The App is designed for recreational and educational volleyball activities. We are not liable for any injuries or damages that may occur during volleyball activities.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Account Termination</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  You may delete your account at any time through the App settings. Upon account deletion, your personal data will be removed within 30 days, except where retention is required by law.
                </p>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these Terms or engage in harmful behavior toward other users.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Changes to These Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms from time to time. We will notify users of any material changes through the App or by email. Continued use of the App after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-3 text-primary" />
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> <a href="mailto:admin@lidldev.com" className="text-primary hover:underline">admin@lidldev.com</a></p>
                <p><strong>Website:</strong> <a href="https://www.lidldev.com" className="text-primary hover:underline">https://www.lidldev.com</a></p>
                <p><strong>Developer:</strong> LidlDev (Harry)</p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground italic text-center">
                By using Spike!, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SpikeTermsOfService;
