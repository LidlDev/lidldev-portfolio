import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title = 'Harry Liddle - Full Stack Developer & UI/UX Designer',
  description = 'Passionate full-stack developer specializing in React, TypeScript, Node.js, and modern web technologies. Creating beautiful, functional applications with exceptional user experiences.',
  keywords = 'Harry Liddle, LidlDev, Full Stack Developer, React Developer, TypeScript, Node.js, Web Development, UI/UX Design, Mobile Development, JavaScript, Portfolio',
  image = 'https://www.lidldev.com/og-image.jpg',
  url = 'https://www.lidldev.com',
  type = 'website',
  author = 'Harry Liddle',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const siteTitle = 'LidlDev Portfolio';
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Harry Liddle',
    alternateName: 'LidlDev',
    url: 'https://www.lidldev.com',
    image: image,
    description: description,
    jobTitle: 'Full Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sydney',
      addressCountry: 'Australia'
    },
    email: 'harry@lidldev.com',
    sameAs: [
      'https://github.com/LidlDev',
      'https://www.linkedin.com/in/harry-liddle-450a1b233/',
      'https://twitter.com/LidlDev',
      'https://instagram.com/LidlDev'
    ],
    knowsAbout: [
      'React',
      'TypeScript',
      'Node.js',
      'JavaScript',
      'Web Development',
      'Mobile Development',
      'UI/UX Design',
      'Full Stack Development'
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@LidlDev" />
      <meta name="twitter:creator" content="@LidlDev" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags for Articles */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme Color */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.github.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//api.github.com" />
    </Helmet>
  );
};

export default SEO;
