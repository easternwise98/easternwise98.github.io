import React, { useEffect, useRef } from 'react';

export const GiscusComments: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = React.useState('dark');

  useEffect(() => {
    // Detect theme from html element
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(newTheme);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    // Set initial theme
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const giscusContainer = ref.current;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', 'easternwise98/easternwise98.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOPgOqiQ');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOPgOqic4CuaFm');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('data-theme', theme);

    giscusContainer.appendChild(script);

    // Clean up script on component unmount
    return () => {
      if (giscusContainer) {
        giscusContainer.innerHTML = '';
      }
    };
  }, [theme]);

  return <div ref={ref} />;
};
