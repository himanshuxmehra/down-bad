import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { message: 'URL is required' },
        { status: 400 }
      );
    }

    const info = await ytdl.getInfo(url);
   console.log(info) 
    // Filter and sort formats by quality
    const thumbnail = info.videoDetails.thumbnails
      .sort((a, b) => (b.width || 0) - (a.width || 0))[0].url;

    return NextResponse.json({
      url: url,
      title: info.videoDetails.title,
      thumbnail,
      formats: info.formats,
    });
  } catch (error) {
    console.error('Error getting video info:', error);
    return NextResponse.json(
      { message: 'Failed to process video' },
      { status: 500 }
    );
  }
}
