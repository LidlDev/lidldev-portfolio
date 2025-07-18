import { projectsData } from '../data/projects';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (): string => {
  const baseUrl = 'https://www.lidldev.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const urls: SitemapUrl[] = [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/agent`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/spike/privacy-policy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    }
  ];

  // Add project pages
  projectsData.forEach(project => {
    urls.push({
      loc: `${baseUrl}/project/${project.id}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Function to save sitemap to public folder (for build process)
export const saveSitemap = () => {
  const sitemap = generateSitemap();
  
  // In a real build process, you would write this to public/sitemap.xml
  // For now, we'll just return the content
  return sitemap;
};
