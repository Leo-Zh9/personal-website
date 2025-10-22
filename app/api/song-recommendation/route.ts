import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { song } = await request.json();
    
    if (!song || typeof song !== 'string' || song.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid song recommendation' },
        { status: 400 }
      );
    }

    // Create the file path for song recommendations
    const filePath = path.join(process.cwd(), 'song-recommendations.txt');
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Format the entry
    const entry = `[${timestamp}] ${song.trim()}\n`;
    
    // Append to file (create if doesn't exist)
    await fs.appendFile(filePath, entry, 'utf8');
    
    return NextResponse.json(
      { success: true, message: 'Song recommendation saved!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving song recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to save recommendation' },
      { status: 500 }
    );
  }
}

