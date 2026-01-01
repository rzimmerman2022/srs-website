'use client';

import { FormEvent, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { trackFormSubmission } from '@/lib/analytics';

// W-SEC-05: XSS Prevention - Sanitize user-controlled error messages
function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// W-SEC-06: File upload size limit (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  // W-A11Y-04: Field-specific validation errors
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
    resume?: string;
  }>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);

    // W-SEC-06: Validate file upload size
    const resumeFile = formData.get('resume') as File;
    if (resumeFile && resumeFile.size > 0) {
      if (resumeFile.size > MAX_FILE_SIZE) {
        setIsLoading(false);
        setFieldErrors({ resume: 'File size must be less than 5MB' });
        setError('Please check the errors below and try again.');
        return;
      }
    }

    // W-A11Y-04: Client-side validation for required fields
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    const errors: typeof fieldErrors = {};
    if (!firstName?.trim()) errors.firstName = 'First name is required';
    if (!lastName?.trim()) errors.lastName = 'Last name is required';
    if (!email?.trim()) errors.email = 'Email address is required';
    if (!message?.trim()) errors.message = 'Message is required';

    if (Object.keys(errors).length > 0) {
      setIsLoading(false);
      setFieldErrors(errors);
      setError('Please check the errors below and try again.');
      return;
    }

    try {
      // W-CQ-06: Use environment variable for Formspree URL with fallback
      // UPDATED 2026-01-01: New form ID xaqnnbpp (old xgvglrbr was orphan)
      const formspreeUrl = process.env.NEXT_PUBLIC_FORMSPREE_URL || 'https://formspree.io/f/xaqnnbpp';

      const response = await fetch(formspreeUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setIsLoading(false);
        setIsSuccess(true);
        // Track successful form submission in GA4
        trackFormSubmission('Contact Form');
      } else {
        const data = await response.json();
        setIsLoading(false);
        // W-SEC-05: Sanitize error messages from external API
        const errorMessage = data.errors?.map((e: { message: string }) => sanitizeErrorMessage(e.message)).join(', ') ||
          'Something went wrong. Please try again.';
        setError(errorMessage);
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
          error={fieldErrors.firstName}
        />
        <Input
          type="text"
          name="lastName"
          label="Last Name"
          placeholder="Doe"
          required
          error={fieldErrors.lastName}
        />
      </div>

      <Input
        type="email"
        name="email"
        label="Email Address"
        placeholder="john.doe@example.com"
        required
        error={fieldErrors.email}
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
          aria-invalid={!!fieldErrors.resume}
          aria-describedby={fieldErrors.resume ? 'resume-upload-error' : 'resume-upload-help'}
          className={`block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-sand-50 file:text-navy hover:file:bg-sand-100 transition-colors ${
            fieldErrors.resume ? 'border border-red-500 rounded-lg' : ''
          }`}
        />
        {fieldErrors.resume ? (
          <p id="resume-upload-error" className="mt-2 text-sm text-red-600" role="alert">
            {fieldErrors.resume}
          </p>
        ) : (
          <p id="resume-upload-help" className="text-xs text-gray-500 mt-1">
            Upload your current resume (PDF or Word, max 5MB) - helps us provide better guidance
          </p>
        )}
      </div>

      <Input
        as="textarea"
        name="message"
        label="How can we help you?"
        placeholder="Tell us about your career goals and what you're looking for..."
        rows={6}
        required
        error={fieldErrors.message}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700" role="alert">
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
