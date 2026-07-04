import { useEffect } from 'react';

export default function SEO({ title, description, keywords, ogImage, ogUrl }) {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title 
      ? `${title} | Swag Solutions` 
      : 'Swag Solutions - Free Tools, Wedding Cards & POS Systems';
    document.title = formattedTitle;

    // Helper to set or create meta tags
    const setMetaTag = (nameOrProperty, content, isProperty = false) => {
      if (!content) return;
      const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', nameOrProperty);
        } else {
          element.setAttribute('name', nameOrProperty);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Meta tags
    setMetaTag('description', description || 'Swag Solutions builds premium websites, custom systems, GPoS web-based POS software, free online tools, and wedding invitation pages in Sri Lanka.');
    setMetaTag('keywords', keywords || 'Swag Solutions, web design sri lanka, pos system sri lanka, gpos pos, free online tools, wedding invitations, digital invitation website, custom software developer');
    
    // 3. Open Graph / Facebook
    setMetaTag('og:title', title || 'Swag Solutions - Free Tools, Wedding Cards & POS Systems', true);
    setMetaTag('og:description', description || 'Websites, custom systems, GPoS web-based POS, free business tools, and custom wedding invitation webpages for Sri Lankan businesses.', true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:image', ogImage || '/logo.png', true);
    setMetaTag('og:url', ogUrl || window.location.href, true);

    // 4. Twitter
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title || 'Swag Solutions - Free Tools, Wedding Cards & POS Systems');
    setMetaTag('twitter:description', description || 'Practical websites, software, GPoS POS systems, free tools, and digital invitation pages for Sri Lankan businesses.');
    setMetaTag('twitter:image', ogImage || '/logo.png');

  }, [title, description, keywords, ogImage, ogUrl]);

  return null;
}
