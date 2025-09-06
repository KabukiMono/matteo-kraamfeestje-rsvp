import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, response, timestamp } = body

    if (!name || !response) {
      return NextResponse.json(
        { error: 'Naam en antwoord zijn verplicht' },
        { status: 400 }
      )
    }

    // Create a unique filename with timestamp
    const filename = `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.json`
    
    // Store the RSVP data
    const rsvpData = {
      name,
      response,
      timestamp,
      id: filename
    }

    // Upload to Vercel Blob
    await put(filename, JSON.stringify(rsvpData), {
      access: 'public',
    })

    return NextResponse.json({ success: true, id: filename })
  } catch (error) {
    console.error('Error saving RSVP:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het opslaan' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to retrieve responses (for admin use)
export async function GET() {
  try {
    return NextResponse.json({ 
      message: 'RSVP API is werkend! Gebruik POST om een antwoord in te dienen.' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}