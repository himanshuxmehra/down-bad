import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { pipeline } from 'stream/promises';

export async function POST(request: Request) {
  try {
    const { url, itag, title } = await request.json();

    if (!url || !itag || !title) {
      return new NextResponse(
        JSON.stringify({ message: 'URL, itag, and title are required' }),
        { status: 400 }
      );
    }

    // Create safe filename
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Create download stream
    const videoStream = ytdl(url, {
      quality: itag,
      filter: 'videoandaudio',
    });

    // // Create response with appropriate headers
    // const response = NextResponse(videoStream as any);

    // // Set headers for file download
    // response.headers.set('Content-Type', 'video/mp4');
    // response.headers.set('Content-Disposition', `attachment; filename="${safeTitle}.mp4"`);

    return new NextResponse(videoStream as any);
  } catch (error) {
    console.error('Error downloading video:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to download video' }),
      { status: 500 }
    );
  }
}

// Configure segment size for large files
export const config = {
  api: {
    responseLimit: false,
  },
};
