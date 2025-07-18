import { useState, useEffect } from 'react';
import { cmsContent, CMSHeroContent, CMSAboutContent, CMSSkillsContent, CMSProjectContent, CMSContactContent, CMSSiteSettings } from '../cms/content';

// Hook for accessing CMS content
export const useCMS = () => {
  const [content, setContent] = useState(cmsContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, this would fetch from a headless CMS API
  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // In production, this would be:
      // const response = await fetch('/api/cms/content');
      // const data = await response.json();
      // setContent(data);
      
      setContent(cmsContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Helper functions for specific content sections
  const getHeroContent = (): CMSHeroContent => content.hero;
  const getAboutContent = (): CMSAboutContent => content.about;
  const getSkillsContent = (): CMSSkillsContent => content.skills;
  const getProjectsContent = (): CMSProjectContent => content.projects;
  const getContactContent = (): CMSContactContent => content.contact;
  const getSiteSettings = (): CMSSiteSettings => content.siteSettings;

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
    getHeroContent,
    getAboutContent,
    getSkillsContent,
    getProjectsContent,
    getContactContent,
    getSiteSettings,
  };
};

// Hook for managing images with CDN optimization
export const useImageOptimization = () => {
  const optimizeImage = (
    url: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'avif' | 'jpg' | 'png';
    } = {}
  ): string => {
    // In production, this would integrate with a CDN like Cloudinary, ImageKit, or Vercel's Image Optimization
    const { width, height, quality = 80, format = 'webp' } = options;
    
    // For now, return the original URL
    // In production, this might look like:
    // return `https://your-cdn.com/image?url=${encodeURIComponent(url)}&w=${width}&h=${height}&q=${quality}&f=${format}`;
    
    return url;
  };

  const generateBlurDataURL = (url: string): string => {
    // In production, this would generate a low-quality placeholder
    // For now, return a simple data URL
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
  };

  return {
    optimizeImage,
    generateBlurDataURL,
  };
};

// Hook for managing dynamic content updates
export const useContentUpdates = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const updateContent = async (section: string, data: any) => {
    // In production, this would send updates to the CMS API
    try {
      // const response = await fetch(`/api/cms/${section}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      
      setLastUpdated(new Date());
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const previewContent = (section: string, data: any) => {
    // In production, this would enable preview mode
    console.log('Preview mode enabled for:', section, data);
  };

  return {
    lastUpdated,
    updateContent,
    previewContent,
  };
};

// Hook for SEO content management
export const useSEO = () => {
  const { getSiteSettings } = useCMS();
  const siteSettings = getSiteSettings();

  const generateMetaTags = (pageData: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  } = {}) => {
    const {
      title = siteSettings.seo.defaultTitle,
      description = siteSettings.seo.defaultDescription,
      image = siteSettings.seo.ogImage,
      url = siteSettings.siteUrl,
      type = 'website',
    } = pageData;

    return {
      title: title.includes(siteSettings.siteName) ? title : `${title} | ${siteSettings.siteName}`,
      description,
      keywords: siteSettings.seo.keywords.join(', '),
      image,
      url,
      type,
      author: siteSettings.author,
      siteName: siteSettings.siteName,
    };
  };

  const generateStructuredData = (type: 'Person' | 'WebSite' | 'Article', data: any = {}) => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
    };

    switch (type) {
      case 'Person':
        return {
          ...baseData,
          name: siteSettings.author,
          url: siteSettings.siteUrl,
          email: siteSettings.email,
          jobTitle: 'Full Stack Developer',
          sameAs: Object.values(siteSettings.social),
          ...data,
        };
      case 'WebSite':
        return {
          ...baseData,
          name: siteSettings.siteName,
          url: siteSettings.siteUrl,
          description: siteSettings.siteDescription,
          author: {
            '@type': 'Person',
            name: siteSettings.author,
          },
          ...data,
        };
      default:
        return { ...baseData, ...data };
    }
  };

  return {
    generateMetaTags,
    generateStructuredData,
    siteSettings,
  };
};
