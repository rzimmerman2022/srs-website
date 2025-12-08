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

    // TODO: Implement actual form submission (e.g., to HubSpot, email service, etc.)
    // For now, simulate a successful submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
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
        placeholder="(555) 123-4567"
        helpText="Optional - we'll call if you prefer phone conversations"
      />

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
