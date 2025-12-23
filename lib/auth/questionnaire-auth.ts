import { randomBytes } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

// Get a properly typed Supabase client
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured');
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'public' }
  });
}

/**
 * Questionnaire Token Authentication System
 *
 * This module provides secure token-based authentication for questionnaire access.
 * Tokens are cryptographically random 32-character strings that replace guessable URLs.
 *
 * Security features:
 * - Cryptographically secure random token generation
 * - 30-day expiration from creation
 * - Token revocation support
 * - Access tracking (timestamp, count)
 */

const TOKEN_EXPIRATION_DAYS = 30;

/**
 * Interface for access token data
 */
export interface QuestionnaireAccessToken {
  id: string;
  client_id: string;
  questionnaire_id: string;
  token: string;
  created_at: string;
  expires_at: string;
  accessed_at: string | null;
  access_count: number;
  revoked: boolean;
}

/**
 * Generates a cryptographically secure random token
 * @returns 32-character hexadecimal token
 */
function generateSecureToken(): string {
  // Generate 16 random bytes, convert to 32-character hex string
  return randomBytes(16).toString('hex');
}

/**
 * Generates a new questionnaire access token
 *
 * @param clientId - Unique identifier for the client
 * @param questionnaireId - Unique identifier for the questionnaire
 * @returns Object containing the generated token and token data
 * @throws Error if Supabase is not configured or token creation fails
 */
export async function generateQuestionnaireToken(
  clientId: string,
  questionnaireId: string
): Promise<{ token: string; tokenData: QuestionnaireAccessToken }> {
  const supabase = getSupabase();

  // Generate cryptographically secure token
  const token = generateSecureToken();

  // Calculate expiration date
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + TOKEN_EXPIRATION_DAYS);

  // Insert token into database
  type TokenInsert = Database['public']['Tables']['questionnaire_access_tokens']['Insert'];
  const insertData: TokenInsert = {
    client_id: clientId,
    questionnaire_id: questionnaireId,
    token,
    expires_at: expiresAt.toISOString(),
    revoked: false,
    access_count: 0,
  };

  const { data, error } = await (supabase
    .from('questionnaire_access_tokens') as any)
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating questionnaire token:', error);
    throw new Error(`Failed to generate questionnaire token: ${error.message}`);
  }

  return { token, tokenData: data as QuestionnaireAccessToken };
}

/**
 * Verifies a questionnaire access token and returns associated data
 *
 * This function:
 * 1. Validates the token exists
 * 2. Checks if token is expired
 * 3. Checks if token is revoked
 * 4. Updates access tracking (timestamp, count)
 *
 * @param token - The token to verify
 * @returns Object containing client_id, questionnaire_id, and token data, or null if invalid
 */
export async function verifyQuestionnaireToken(
  token: string
): Promise<{
  clientId: string;
  questionnaireId: string;
  tokenData: QuestionnaireAccessToken;
} | null> {
  try {
    const supabase = getSupabase();

    // Fetch token from database
    const { data, error } = await (supabase
      .from('questionnaire_access_tokens') as any)
      .select('*')
      .eq('token', token)
      .single();

    if (error || !data) {
      console.error('Token not found:', error?.message || 'No data returned');
      return null;
    }

    const tokenData = data as QuestionnaireAccessToken;

    // Check if token is revoked
    if (tokenData.revoked) {
      console.error('Token has been revoked');
      return null;
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (now > expiresAt) {
      console.error('Token has expired');
      return null;
    }

    // Update access tracking
    type TokenUpdate = Database['public']['Tables']['questionnaire_access_tokens']['Update'];
    const updateData: TokenUpdate = {
      accessed_at: now.toISOString(),
      access_count: tokenData.access_count + 1,
    };

    const { error: updateError } = await (supabase
      .from('questionnaire_access_tokens') as any)
      .update(updateData)
      .eq('token', token);

    if (updateError) {
      console.error('Error updating token access tracking:', updateError?.message || 'Unknown error');
      // Don't fail verification just because tracking update failed
    }

    return {
      clientId: tokenData.client_id,
      questionnaireId: tokenData.questionnaire_id,
      tokenData,
    };
  } catch {
    console.error('Supabase is not configured. Cannot verify token.');
    return null;
  }
}

/**
 * Revokes a questionnaire access token
 *
 * @param token - The token to revoke
 * @returns true if revocation was successful, false otherwise
 */
export async function revokeToken(token: string): Promise<boolean> {
  try {
    const supabase = getSupabase();

    type TokenUpdate = Database['public']['Tables']['questionnaire_access_tokens']['Update'];
    const updateData: TokenUpdate = { revoked: true };

    const { error } = await (supabase
      .from('questionnaire_access_tokens') as any)
      .update(updateData)
      .eq('token', token);

    if (error) {
      console.error('Error revoking token:', error?.message || 'Unknown error');
      return false;
    }

    return true;
  } catch {
    console.error('Supabase is not configured. Cannot revoke token.');
    return false;
  }
}

/**
 * Generates a shareable link for a questionnaire
 *
 * @param clientId - Unique identifier for the client
 * @param questionnaireId - Unique identifier for the questionnaire
 * @param baseUrl - Base URL of the application (defaults to current origin)
 * @returns Shareable URL with secure token
 */
export async function getQuestionnaireLink(
  clientId: string,
  questionnaireId: string,
  baseUrl?: string
): Promise<string> {
  const { token } = await generateQuestionnaireToken(clientId, questionnaireId);

  // Use provided baseUrl or default to environment variable or localhost
  const domain = baseUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  return `${domain}/q/${token}`;
}

/**
 * Gets all tokens for a specific client
 *
 * @param clientId - Unique identifier for the client
 * @returns Array of token data for the client
 */
export async function getClientTokens(
  clientId: string
): Promise<QuestionnaireAccessToken[]> {
  try {
    const supabase = getSupabase();

    const { data, error } = await (supabase
      .from('questionnaire_access_tokens') as any)
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching client tokens:', error?.message || 'Unknown error');
      return [];
    }

    return data as QuestionnaireAccessToken[];
  } catch {
    console.error('Supabase is not configured. Cannot fetch tokens.');
    return [];
  }
}

/**
 * Revokes all tokens for a specific client
 *
 * @param clientId - Unique identifier for the client
 * @returns Number of tokens revoked
 */
export async function revokeAllClientTokens(clientId: string): Promise<number> {
  try {
    const supabase = getSupabase();

    type TokenUpdate = Database['public']['Tables']['questionnaire_access_tokens']['Update'];
    const updateData: TokenUpdate = { revoked: true };

    const { data, error } = await (supabase
      .from('questionnaire_access_tokens') as any)
      .update(updateData)
      .eq('client_id', clientId)
      .eq('revoked', false)
      .select();

    if (error) {
      console.error('Error revoking client tokens:', error?.message || 'Unknown error');
      return 0;
    }

    return data?.length || 0;
  } catch {
    console.error('Supabase is not configured. Cannot revoke tokens.');
    return 0;
  }
}
