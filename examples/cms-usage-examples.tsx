// Example: How to use CMS in any component

import React from 'react';
import { useCMS } from '../src/hooks/useCMS';

// Example 1: Simple content usage
const MyComponent = () => {
  const { getHeroContent, loading } = useCMS();
  const hero = getHeroContent();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{hero.name}</h1>
      <p>{hero.description}</p>
      <button>{hero.primaryButton.text}</button>
    </div>
  );
};

// Example 2: Using specific content sections
const AboutSection = () => {
  const { getAboutContent } = useCMS();
  const about = getAboutContent();

  return (
    <section>
      <h2>{about.title}</h2>
      {about.description.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      
      <div className="stats">
        {about.stats.map((stat, index) => (
          <div key={index}>
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Example 3: Using site settings for SEO
const SEOComponent = () => {
  const { getSiteSettings } = useCMS();
  const settings = getSiteSettings();

  return (
    <head>
      <title>{settings.seo.defaultTitle}</title>
      <meta name="description" content={settings.seo.defaultDescription} />
      <meta name="keywords" content={settings.seo.keywords.join(', ')} />
    </head>
  );
};

// Example 4: Dynamic content updates
const ContentEditor = () => {
  const { content, updateContent } = useCMS();
  const [newTitle, setNewTitle] = React.useState('');

  const handleUpdate = async () => {
    const result = await updateContent('hero', {
      ...content.hero,
      name: newTitle
    });
    
    if (result.success) {
      alert('Content updated!');
    }
  };

  return (
    <div>
      <input 
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="New hero title"
      />
      <button onClick={handleUpdate}>Update Title</button>
    </div>
  );
};
