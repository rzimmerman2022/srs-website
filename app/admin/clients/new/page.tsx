'use client';

/**
 * Create New Client Page
 *
 * Fortune 500-level client onboarding:
 * - Fill out form
 * - System auto-generates secure link
 * - Copy link and send to client
 * - Client clicks and starts immediately (no login needed)
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface CreatedClient {
  client: {
    id: string;
    clientId: string;
    fullName: string;
    email: string;
    packageType: string;
    status: string;
  };
  questionnaire: {
    link: string;
    token: string;
    expiresAt: string;
    questionnaireId: string;
  };
}

export default function CreateClientPage() {
  const router = useRouter();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [packageType, setPackageType] = useState<'discovery' | 'elite' | 'executive'>('elite');
  const [questionnaireId, setQuestionnaireId] = useState<string>('elite-discovery');
  const [notes, setNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdClient, setCreatedClient] = useState<CreatedClient | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Copy link to clipboard
  const copyLink = useCallback(async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/clients/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone: phone || null,
          packageType,
          notes: notes || null,
          questionnaireId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create client');
      }

      setCreatedClient(data);
    } catch (err) {
      console.error('Error creating client:', err);
      setError(err instanceof Error ? err.message : 'Failed to create client');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form for another client
  const handleCreateAnother = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPackageType('elite');
    setQuestionnaireId('elite-discovery');
    setNotes('');
    setCreatedClient(null);
    setError(null);
  };

  // Success state - show the generated link
  if (createdClient) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-green-800">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Client Created Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Client Info */}
            <div className="bg-white rounded-lg border border-green-200 p-4">
              <h3 className="font-semibold text-navy mb-3">Client Details</h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-charcoal-500">Name</dt>
                  <dd className="font-medium text-navy">{createdClient.client.fullName}</dd>
                </div>
                <div>
                  <dt className="text-charcoal-500">Email</dt>
                  <dd className="font-medium text-navy">{createdClient.client.email}</dd>
                </div>
                <div>
                  <dt className="text-charcoal-500">Package</dt>
                  <dd className="font-medium text-navy capitalize">{createdClient.client.packageType}</dd>
                </div>
                <div>
                  <dt className="text-charcoal-500">Client ID</dt>
                  <dd className="font-medium text-navy font-mono text-xs">{createdClient.client.clientId}</dd>
                </div>
              </dl>
            </div>

            {/* The Golden Link */}
            <div className="bg-gradient-to-r from-gold/10 to-amber-50 rounded-lg border-2 border-gold/30 p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 className="font-bold text-navy text-lg">Questionnaire Link</h3>
              </div>
              <p className="text-sm text-charcoal-600 mb-4">
                Send this link to your client. They click it and start immediately - no login required.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={createdClient.questionnaire.link}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white border border-gold/50 rounded-lg font-mono text-sm text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <Button
                  onClick={() => copyLink(createdClient.questionnaire.link)}
                  variant={linkCopied ? 'primary' : 'outline'}
                  className="px-6"
                >
                  {linkCopied ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-charcoal-500 mt-3">
                Link expires: {new Date(createdClient.questionnaire.expiresAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} (30 days)
              </p>
            </div>

            {/* What to do next */}
            <div className="bg-navy/5 rounded-lg p-4">
              <h4 className="font-semibold text-navy mb-2">What to do next:</h4>
              <ol className="list-decimal list-inside text-sm text-charcoal-700 space-y-1">
                <li>Copy the link above</li>
                <li>Send it to {createdClient.client.fullName} via email or text</li>
                <li>They click and start filling out the questionnaire</li>
                <li>You&apos;ll see their progress in the admin dashboard</li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                onClick={handleCreateAnother}
                variant="primary"
                className="flex-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create Another Client
              </Button>
              <Button
                href={`/admin/clients/${createdClient.client.clientId}`}
                variant="outline"
                className="flex-1"
              >
                View Client Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form state
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h1 className="text-3xl font-serif font-semibold text-navy">
            Create New Client
          </h1>
        </div>
        <p className="text-charcoal-600 ml-11">
          Add a new client and automatically generate their questionnaire link.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-navy mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="e.g., Jacqueline DeLeon"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g., jackie@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
              />
            </div>

            {/* Phone (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-navy mb-2">
                Phone Number <span className="text-charcoal-400">(optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., (555) 123-4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
              />
            </div>

            {/* Package Type */}
            <div>
              <label className="block text-sm font-medium text-navy mb-3">
                Package Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'discovery', label: 'Discovery', desc: 'Basic package' },
                  { value: 'elite', label: 'Elite Protocol', desc: 'Full service' },
                  { value: 'executive', label: 'Executive', desc: 'Premium tier' },
                ].map((pkg) => (
                  <button
                    key={pkg.value}
                    type="button"
                    onClick={() => setPackageType(pkg.value as 'discovery' | 'elite' | 'executive')}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      packageType === pkg.value
                        ? 'border-gold bg-gold/5 ring-2 ring-gold/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-navy">{pkg.label}</div>
                    <div className="text-xs text-charcoal-500 mt-1">{pkg.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Questionnaire Selection */}
            <div>
              <label htmlFor="questionnaireId" className="block text-sm font-medium text-navy mb-2">
                Questionnaire <span className="text-red-500">*</span>
              </label>
              <select
                id="questionnaireId"
                value={questionnaireId}
                onChange={(e) => setQuestionnaireId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors bg-white"
                required
              >
                <optgroup label="Standard Templates">
                  <option value="elite-discovery">Elite Protocol Discovery (Recommended)</option>
                </optgroup>
                <optgroup label="Client-Specific (Legacy)">
                  <option value="jackie-deleon-dec-2025">Jackie DeLeon - Behavioral Health</option>
                </optgroup>
              </select>
              <p className="text-xs text-charcoal-500 mt-2">
                Select which questionnaire template this client will complete
              </p>
            </div>

            {/* Notes (Optional) */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-navy mb-2">
                Internal Notes <span className="text-charcoal-400">(optional)</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any notes about this client..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-4 text-lg"
                disabled={isSubmitting || !fullName || !email}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Client & Generating Link...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Create Client & Generate Link
                  </>
                )}
              </Button>
            </div>

            {/* Info box */}
            <div className="bg-sand-50 rounded-lg p-4 text-sm text-charcoal-600">
              <p className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  A secure questionnaire link will be automatically generated. The client can access their questionnaire immediately - no login or password required.
                </span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
