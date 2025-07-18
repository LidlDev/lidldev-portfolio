
import React from 'react';
import SEO from '../components/SEO';
import NavigationBar from '../components/NavigationBar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import GitHub from '../components/GitHub';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="LidlDev - Full Stack Developer & Software Engineer"
        description="Harry - Full Stack Developer specializing in React, TypeScript, Swift, and modern web technologies. Building beautiful, scalable applications and mobile experiences in Sydney, Australia."
        keywords="full stack developer, react developer, typescript, swift, ios development, web development, software engineer, portfolio, lidldev, harry, sydney developer, australia"
        url="https://www.lidldev.com"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Harry",
          "alternateName": "LidlDev",
          "url": "https://www.lidldev.com",
          "image": "https://www.lidldev.com/harry-profile.png",
          "sameAs": [
            "https://github.com/LidlDev"
          ],
          "jobTitle": "Full Stack Developer",
          "worksFor": {
            "@type": "Organization",
            "name": "LidlDev"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Sydney",
            "addressCountry": "Australia"
          },
          "knowsAbout": [
            "React",
            "TypeScript",
            "Swift",
            "iOS Development",
            "Web Development",
            "Full Stack Development",
            "Software Engineering",
            "JavaScript",
            "Node.js",
            "Firebase",
            "Supabase"
          ],
          "description": "Full Stack Developer specializing in React, TypeScript, Swift, and modern web technologies. Building beautiful, scalable applications and mobile experiences."
        }}
      />
      <NavigationBar />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <GitHub />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
