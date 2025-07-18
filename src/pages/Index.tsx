
import React from 'react';
import SEO from '../components/SEO';
import NavigationBar from '../components/NavigationBar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  try {
    return (
      <div className="min-h-screen">
        <SEO
          title="Harry Liddle - Full Stack Developer & UI/UX Designer"
          description="Passionate full-stack developer specializing in React, TypeScript, Node.js, and modern web technologies. Creating beautiful, functional applications with exceptional user experiences."
          keywords="Harry Liddle, LidlDev, Full Stack Developer, React Developer, TypeScript, Node.js, Web Development, UI/UX Design, Mobile Development, JavaScript, Portfolio, Sydney Developer"
          url="https://www.lidldev.com"
          type="website"
        />
        <NavigationBar />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error rendering Index page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Harry Liddle - Full Stack Developer</h1>
          <p className="text-muted-foreground">Portfolio is loading...</p>
        </div>
      </div>
    );
  }
};

export default Index;
