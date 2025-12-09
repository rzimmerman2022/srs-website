'use client';

import { FormEvent, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      // Formspree endpoint for Southwest Resume Services - Contact Form
      const response = await fetch('https://formspree.io/f/xgvglrbr', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setIsLoading(false);
        setIsSuccess(true);
      } else {
        const data = await response.json();
        setIsLoading(false);
        setError(
          data.errors?.map((e: { message: string }) => e.message).join(', ') ||
            'Something went wrong. Please try again.'
        );
      }
    } catch {
      setIsLoading(false);
      setError('Failed to send message. Please email us directly at info@southwestresumes.com');
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <svg
          className="w-16 h-16 text-green-600 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600 mb-4">
          We&apos;ve received your message and will get back to you within 1-2 business
          days.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="text"
          name="firstName"
          label="First Name"
          placeholder="John"
          required
        />
        <Input
          type="text"
          name="lastName"
          label="Last Name"
          placeholder="Doe"
          required
        />
      </div>

      <Input
        type="email"
        name="email"
        label="Email Address"
        placeholder="john.doe@example.com"
        required
      />

      <Input
        type="tel"
        name="phone"
        label="Phone Number"
        placeholder="(480) 374-3418"
        helpText="Optional - we'll call if you prefer phone conversations"
      />

      <div>
        <label htmlFor="resume-upload" className="block text-sm font-medium text-navy mb-2">
          Current Resume (Optional)
        </label>
        <input
          id="resume-upload"
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          aria-label="Upload your current resume"
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-sand-50 file:text-navy hover:file:bg-sand-100 transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload your current resume (PDF or Word) - helps us provide better guidance
        </p>
      </div>

      <Input
        as="textarea"
        name="message"
        label="How can we help you?"
        placeholder="Tell us about your career goals and what you're looking for..."
        rows={6}
        required
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-sand-50 border border-sand-200 rounded-lg p-4 text-sm text-gray-600">
        <p className="mb-2">
          <strong>What happens next?</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>We&apos;ll review your inquiry within 1-2 business days</li>
          <li>We&apos;ll send you a detailed response via email</li>
          <li>If needed, we&apos;ll schedule a consultation call</li>
        </ul>
      </div>

      <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
        {isLoading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
