import { Helmet } from 'react-helmet-async';
import { IMAGE_PATHS } from '../config/images';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = "LidlDev - Full Stack Developer & Software Engineer",
  description = "Harry - Full Stack Developer specializing in React, TypeScript, Swift, and modern web technologies. Building beautiful, scalable applications and mobile experiences.",
  keywords = "full stack developer, react developer, typescript, swift, ios development, web development, software engineer, portfolio, lidldev, harry",
  image = IMAGE_PATHS.PROFILE.HARRY,
  url = "https://www.lidldev.com",
  type = "website",
  author = "Harry - LidlDev",
  publishedTime,
  modifiedTime,
  structuredData,
}) => {
  const siteTitle = title.includes("LidlDev") ? title : `${title} | LidlDev`;
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;
  const canonicalUrl = url;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Harry",
    "alternateName": "LidlDev",
    "url": url,
    "image": fullImageUrl,
    "sameAs": [
      "https://github.com/LidlDev",
      "https://linkedin.com/in/lidldev"
    ],
    "jobTitle": "Full Stack Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "LidlDev"
    },
    "knowsAbout": [
      "React",
      "TypeScript",
      "Swift",
      "iOS Development",
      "Web Development",
      "Full Stack Development",
      "Software Engineering"
    ],
    "description": description
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="LidlDev Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@lidldev" />
      <meta name="twitter:creator" content="@lidldev" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#F8F9FA" />
      <meta name="msapplication-TileColor" content="#F8F9FA" />

      {/* Article specific tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === "article" && <meta property="article:author" content={author} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEO;
