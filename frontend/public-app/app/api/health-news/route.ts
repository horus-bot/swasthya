import { NextResponse } from 'next/server';

export async function GET() {
  // Return mock health news instead of scraping The Hindu via axios and cheerio
  const limitedUpdates = [
    {
      title: 'City Hospitals Report Mild Increase in Seasonal Flu',
      source: 'Mock News Source',
      link: 'https://example.com/flu-update',
      date: new Date().toISOString().split('T')[0]
    },
    {
      title: 'New Health Infrastructure Initiated in Metro Regions',
      source: 'Mock Health Dept News',
      link: 'https://example.com/infra-update',
      date: new Date().toISOString().split('T')[0]
    },
    {
      title: 'Free Health Screening Camps To Be Held This Weekend',
      source: 'Community Board',
      link: 'https://example.com/camps',
      date: new Date().toISOString().split('T')[0]
    }
  ];

  return NextResponse.json({ healthUpdates: limitedUpdates });
}