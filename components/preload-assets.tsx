'use client';

import { useEffect } from 'react';

export function PreloadAssets() {
  useEffect(() => {
    // Preload critical assets
    const preloadLinks = [
      { href: '/favicon.ico', as: 'image' },
      { href: '/favicon.svg', as: 'image' },
      { href: '/logo.svg', as: 'image' },
      { href: '/apple-icon.png', as: 'image' }
    ];
    
    preloadLinks.forEach(link => {
      const linkEl = document.createElement('link');
      linkEl.rel = 'preload';
      linkEl.href = link.href;
      linkEl.as = link.as;
      document.head.appendChild(linkEl);
    });
  }, []);
  
  return null;
}