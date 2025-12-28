import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import BlogTableOfContents from '@/components/blog/BlogTableOfContents';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog/posts';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://southwestresumes.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedDate || post.publishedDate,
      authors: [post.author.name],
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ['/og-image.jpg'],
    },
    alternates: {
      canonical: `https://southwestresumes.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, 3);

  // Article Schema for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.title,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Southwest Resume Services',
      logo: {
        '@type': 'ImageObject',
        url: 'https://southwestresumes.com/logo.png',
      },
    },
    datePublished: post.publishedDate,
    dateModified: post.updatedDate || post.publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://southwestresumes.com/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://southwestresumes.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://southwestresumes.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://southwestresumes.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Article Schema */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <section className="bg-sand-50 border-b border-sand-200 py-4">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-charcoal/60">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/blog" className="hover:text-gold transition-colors">
              Blog
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-navy font-medium">{post.category}</span>
          </nav>
        </Container>
      </section>

      {/* Article Header */}
      <section className="section-padding bg-white border-b border-sand-200">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-semibold uppercase tracking-wider">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-navy mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-charcoal/70 mb-8 pb-8 border-b border-sand-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-semibold">
                  {post.author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{post.author.name}</p>
                  <p className="text-xs text-charcoal/60">{post.author.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>
                  {new Date(post.publishedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-sand-100 text-charcoal/70 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Article Content */}
      <article className="py-16 md:py-24 bg-sand-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Table of Contents (for posts 2000+ words) */}
            {post.content.split(' ').length >= 2000 && (
              <aside className="lg:col-span-3 hidden lg:block">
                <BlogTableOfContents />
              </aside>
            )}

            {/* Main Content */}
            <div className={post.content.split(' ').length >= 2000 ? 'lg:col-span-9' : 'lg:col-span-12'}>
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </Container>
      </article>

      {/* Call to Action */}
      <section className="section-padding bg-navy text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              Ready for Research-Backed Career Documents?
            </h2>
            <p className="text-xl text-sand-100 mb-6">
              At Southwest Resume Services, we don&apos;t guess—we research. Our <strong>Client Truth Principle</strong> means every accomplishment on your resume is verified through authoritative sources and backed by our proprietary <strong>Research Authority Index (RAI)</strong>.
            </p>
            <p className="text-lg text-sand-200 mb-8">
              We analyze 200+ job postings in your target market, validate your experience against O*NET and BLS data, and ensure you can confidently own every claim in interviews. Truth-driven. Evidence-based. Results-focused.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/contact">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-10">
                  Schedule Free Consultation
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-10 border-white text-white hover:bg-white hover:text-navy"
                >
                  View Our Services
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-white border-t border-sand-200">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-navy mb-12 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.slug}
                    className="bg-sand-50 rounded-xl overflow-hidden border border-sand-200 hover:shadow-md transition-all duration-300 flex flex-col group"
                  >
                    <div className="p-6 flex flex-col h-full">
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-navy mb-3 group-hover:text-gold transition-colors line-clamp-2">
                        <Link href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                      </h3>
                      <p className="text-sm text-charcoal/70 mb-4 flex-grow line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-sand-200">
                        <span className="text-xs text-charcoal/60">{relatedPost.readTime}</span>
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="text-navy hover:text-gold transition-colors font-medium text-sm flex items-center gap-1"
                        >
                          Read
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
