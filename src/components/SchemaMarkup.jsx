import { useEffect } from 'react';

export default function SchemaMarkup({ schema }) {
  useEffect(() => {
    if (!schema) return;
    
    // Check if script tag already exists
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.text = JSON.stringify(schema);
    
    // Cleanup on unmount
    return () => {
      if (script) {
        script.text = '';
      }
    };
  }, [schema]);

  return null;
}
