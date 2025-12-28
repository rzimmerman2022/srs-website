import Link from 'next/link';
import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { getAllPosts, getAllCategories } from '@/lib/blog/posts';

export const metadata: Metadata = {
  title: 'Career Tips & Resume Writing Insights | Southwest Resume Services Blog',
  description:
    'Expert career advice, resume writing tips, Phoenix job market insights, and LinkedIn optimization strategies from Southwest Resume Services. Practical guidance for job seekers across Arizona.',
  openGraph: {
    title: 'Career Tips & Resume Writing Insights | Southwest Resume Services Blog',
    description:
      'Expert career advice and resume writing tips for Phoenix professionals. Job market insights, LinkedIn strategies, and interview preparation guidance.',
    url: 'https://southwestresumes.com/blog',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Southwest Resume Services Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Tips & Resume Writing Insights | Southwest Resume Services Blog',
    description:
      'Expert career advice and resume writing tips for Phoenix professionals.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://southwestresumes.com/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-navy text-white py-16 md:py-20 border-b border-white/10">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
              Career Insights & Resume Tips
            </h1>
            <p className="text-xl md:text-2xl text-sand-100 mb-8">
              Expert guidance on resume writing, career strategy, and navigating the Phoenix job market
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
              >
                <div className="p-8 flex flex-col h-full">
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-xs text-charcoal/60">{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-serif font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-charcoal/80 mb-6 flex-grow leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-6 border-t border-sand-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-semibold text-sm">
                        {post.author.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">{post.author.name}</p>
                        <p className="text-xs text-charcoal/60">
                          {new Date(post.publishedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-navy hover:text-gold transition-colors font-medium text-sm flex items-center gap-1 group"
                    >
                      Read More
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
        </Container>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white border-t border-sand-200">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-6">
              Ready to Transform Your Career Documents?
            </h2>
            <p className="text-xl text-charcoal/80 mb-8">
              Reading about resume optimization is helpful—but professional implementation delivers results. Let&apos;s work together to position you for success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/contact">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-10">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-10 border-navy text-navy hover:bg-navy hover:text-white"
                >
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
