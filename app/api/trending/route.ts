import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET() {
  try {
    // Rechercher des musiques tendances actuelles
    const queries = [
      'Official Music Video 2025 trending',
      'Top hits 2025',
      'Viral songs 2025',
    ];

    // Sélectionner une requête aléatoire
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    const results = await ytSearch(randomQuery);

    // Filtrer et formater les résultats
    const videos = results.videos.slice(0, 30).map((video: any) => ({
      id: video.videoId,
      youtubeId: video.videoId,
      title: video.title,
      artist: video.author.name,
      thumbnail: video.thumbnail,
      duration: video.timestamp,
      views: video.views,
      url: video.url,
    }));

    return NextResponse.json({
      success: true,
      results: videos,
      query: randomQuery,
    });
  } catch (error) {
    console.error('Trending fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending videos', details: error },
      { status: 500 }
    );
  }
}
