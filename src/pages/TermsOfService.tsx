import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, AlertTriangle, Shield, Globe, Mail, Users } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms of Service"
        description="Terms of Service for LidlDev Portfolio - Learn about the terms and conditions for using our website and services."
        url="https://www.lidldev.com/terms"
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
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our website and services.
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
                Welcome to LidlDev Portfolio ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website located at www.lidldev.com (the "Service") operated by LidlDev (Harry). By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3 text-primary" />
                Acceptance of Terms
              </h2>
              <p className="text-muted-foreground">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            {/* Use License */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                Use License
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Permission is granted to temporarily download one copy of the materials on LidlDev Portfolio's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
                <p className="text-muted-foreground">
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
                </p>
              </div>
            </section>

            {/* Disclaimer */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-primary" />
                Disclaimer
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The materials on LidlDev Portfolio's website are provided on an 'as is' basis. LidlDev makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
                <p className="text-muted-foreground">
                  Further, LidlDev does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                </p>
              </div>
            </section>

            {/* Limitations */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Limitations</h2>
              <p className="text-muted-foreground">
                In no event shall LidlDev or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LidlDev Portfolio's website, even if LidlDev or a LidlDev authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
              </p>
            </section>

            {/* Accuracy of Materials */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Accuracy of Materials</h2>
              <p className="text-muted-foreground">
                The materials appearing on LidlDev Portfolio's website could include technical, typographical, or photographic errors. LidlDev does not warrant that any of the materials on its website are accurate, complete, or current. LidlDev may make changes to the materials contained on its website at any time without notice. However, LidlDev does not make any commitment to update the materials.
              </p>
            </section>

            {/* Links */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-3 text-primary" />
                Links
              </h2>
              <p className="text-muted-foreground">
                LidlDev has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by LidlDev of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Modifications</h2>
              <p className="text-muted-foreground">
                LidlDev may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Governing Law</h2>
              <p className="text-muted-foreground">
                These terms and conditions are governed by and construed in accordance with the laws of Australia and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">User Conduct</h2>
              <p className="text-muted-foreground mb-4">
                When using our website, you agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use the website for any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>Violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>Submit false or misleading information</li>
                <li>Upload or transmit viruses or any other type of malicious code</li>
                <li>Spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>Use the website for any obscene or immoral purpose</li>
                <li>Interfere with or circumvent the security features of the website</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Intellectual Property Rights</h2>
              <p className="text-muted-foreground">
                The Service and its original content, features, and functionality are and will remain the exclusive property of LidlDev and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
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
                <p><strong>Email:</strong> <a href="mailto:harry@lidldev.com" className="text-primary hover:underline">harry@lidldev.com</a></p>
                <p><strong>Website:</strong> <a href="https://www.lidldev.com" className="text-primary hover:underline">https://www.lidldev.com</a></p>
                <p><strong>Developer:</strong> LidlDev (Harry)</p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground italic text-center">
                These terms of service are designed to protect both users and the service provider while ensuring fair use of the website.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
