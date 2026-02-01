import { NextRequest, NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const trending = searchParams.get('trending');

  try {
    let searchQuery = query;

    // Si on veut les tendances, chercher des musiques populaires récentes
    if (trending === 'true' && !query) {
      searchQuery = 'Official Music Video 2025 2026 trending hits';
    }

    if (!searchQuery) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Rechercher sur YouTube
    const results = await ytSearch(searchQuery);

    // Filtrer uniquement les vidéos (pas les playlists ou channels)
    const videos = results.videos.slice(0, 20).map((video: any) => ({
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
      query: searchQuery,
    });
  } catch (error) {
    console.error('YouTube search error:', error);
    return NextResponse.json(
      { error: 'Failed to search YouTube', details: error },
      { status: 500 }
    );
  }
}
