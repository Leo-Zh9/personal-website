import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const VERCEL_TOKEN = process.env.VERCEL_ANALYTICS_TOKEN;
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

    if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
      console.error('Missing Vercel Analytics configuration');
      return NextResponse.json(
        { error: 'Analytics not configured', totalPageviews: 0 },
        { status: 200 }
      );
    }

    // Fetch analytics data from Vercel
    const url = `https://vercel.com/api/web/insights/stats?projectId=${VERCEL_PROJECT_ID}${VERCEL_TEAM_ID ? `&teamId=${VERCEL_TEAM_ID}` : ''}&from=${0}&to=${Date.now()}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch Vercel Analytics:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch analytics', totalPageviews: 0 },
        { status: 200 }
      );
    }

    const data = await response.json();
    
    // Extract total pageviews from the response
    const totalPageviews = data?.total?.pageviews || 0;

    return NextResponse.json(
      {
        success: true,
        totalPageviews,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching Vercel Analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', totalPageviews: 0 },
      { status: 200 }
    );
  }
}

