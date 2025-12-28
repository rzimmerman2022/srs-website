'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface BlogTableOfContentsProps {
  contentRef?: React.RefObject<HTMLDivElement>;
}

export default function BlogTableOfContents({ contentRef }: BlogTableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract H2 and H3 headings from the blog content
    const container = contentRef?.current || document.querySelector('.blog-content');
    if (!container) return;

    const headings = container.querySelectorAll('h2, h3');
    const tocItems: TocItem[] = [];

    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }

      tocItems.push({
        id,
        text: heading.textContent || '',
        level: heading.tagName === 'H2' ? 2 : 3,
      });
    });

    setToc(tocItems);

    // Intersection Observer for active heading tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 1,
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [contentRef]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (toc.length === 0) return null;

  return (
    <nav className="sticky top-24 bg-white border border-sand-200 rounded-xl p-6 shadow-sm">
      <h4 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">
        Table of Contents
      </h4>
      <ul className="space-y-2">
        {toc.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? 'ml-4' : ''}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`
                block text-sm py-1.5 border-l-2 pl-3 transition-all duration-200
                ${
                  activeId === item.id
                    ? 'border-gold text-gold font-semibold'
                    : 'border-transparent text-charcoal/70 hover:text-navy hover:border-sand-300'
                }
              `}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
