import { NextResponse } from 'next/server';

/**
 * Google Places API - Dynamic Rating Fetcher
 *
 * Fetches current rating and review count from Google Business Profile
 * Cache: 6 hours (review counts don't need real-time refresh)
 *
 * Place Details:
 * - Place ID: ChIJIQVCeYgHK4YR3TJ5QAplzPc
 * - Business: Southwest Resume Services
 * - Location: Phoenix Metro, Arizona
 */

interface GooglePlacesResponse {
  result?: {
    rating?: number;
    user_ratings_total?: number;
  };
  error_message?: string;
}

interface RatingData {
  rating: string;
  reviewCount: number;
  lastUpdated: string;
}

const PLACE_ID = 'ChIJIQVCeYgHK4YR3TJ5QAplzPc';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

// In-memory cache (for development; use Redis/Vercel KV in production)
let cachedData: { data: RatingData; timestamp: number } | null = null;

export async function GET() {
  try {
    // Check cache first
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        ...cachedData.data,
        cached: true,
      });
    }

    // Validate API key exists
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error('❌ GOOGLE_PLACES_API_KEY not configured');
      return NextResponse.json(
        getFallbackData('API key not configured'),
        { status: 200 } // Return 200 with fallback to prevent client errors
      );
    }

    // Fetch from Google Places API (New)
    const fields = 'rating,user_ratings_total';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=${fields}&key=${apiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 21600 }, // 6 hours
    });

    if (!response.ok) {
      throw new Error(`Google API returned ${response.status}`);
    }

    const data: GooglePlacesResponse = await response.json();

    // Validate response
    if (data.error_message) {
      console.error('❌ Google Places API error:', data.error_message);
      return NextResponse.json(
        getFallbackData(data.error_message),
        { status: 200 }
      );
    }

    if (!data.result?.rating || !data.result?.user_ratings_total) {
      console.warn('⚠️  Missing rating data in Google response');
      return NextResponse.json(
        getFallbackData('Incomplete data from Google'),
        { status: 200 }
      );
    }

    // Success - cache and return
    const ratingData: RatingData = {
      rating: data.result.rating.toFixed(1),
      reviewCount: data.result.user_ratings_total,
      lastUpdated: new Date().toISOString(),
    };

    cachedData = {
      data: ratingData,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      ...ratingData,
      cached: false,
    });

  } catch (error) {
    console.error('❌ Error fetching Google rating:', error);
    return NextResponse.json(
      getFallbackData(error instanceof Error ? error.message : 'Unknown error'),
      { status: 200 }
    );
  }
}

/**
 * Fallback data when API fails
 * Uses conservative count (6) to avoid overpromising
 */
function getFallbackData(reason: string): RatingData & { cached: boolean; fallback: boolean; error: string } {
  return {
    rating: '5.0',
    reviewCount: 6,
    lastUpdated: new Date().toISOString(),
    cached: false,
    fallback: true,
    error: reason,
  };
}
