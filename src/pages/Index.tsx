
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
};

export default Index;
