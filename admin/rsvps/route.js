import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // List all blobs with 'rsvp-' prefix
    const { blobs } = await list({
      prefix: 'rsvp-',
      limit: 1000 // Adjust if you expect more responses
    })

    // Fetch content of each blob
    const rsvpPromises = blobs.map(async (blob) => {
      try {
        const response = await fetch(blob.url)
        const content = await response.text()
        return JSON.parse(content)
      } catch (error) {
        console.error(`Error fetching blob ${blob.pathname}:`, error)
        return null
      }
    })

    const rsvpData = await Promise.all(rsvpPromises)
    
    // Filter out any null responses and sort by timestamp (newest first)
    const validRsvps = rsvpData
      .filter(rsvp => rsvp !== null)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    return NextResponse.json({
      success: true,
      count: validRsvps.length,
      rsvps: validRsvps
    })

  } catch (error) {
    console.error('Error fetching RSVPs:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch RSVPs',
        details: error.message 
      },
      { status: 500 }
    )
  }
}