import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { SimplifiedArtist, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { getAccessToken } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  // Update cached data associated with the specified path using revalidatePath
  const path = request.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);

  const client_id = process.env.SPOTIFY_CLIENT_ID as string;
  const access_token = await getAccessToken();

  // Creating an instance of the SDK using withAccessToken method
  const spotify = SpotifyApi.withAccessToken(client_id, access_token);

  // Accessing getCurrentlyPlaying endpoint
  const song = await spotify.player.getCurrentlyPlayingTrack();

  if (song === null) {
    return NextResponse.json({ isPlaying: false });
  }

  // Getting the data
  const isPlaying = song.is_playing;
  const track = song.item as Track;
  const title = track.name;
  const artist = track.artists
    .map((artist: SimplifiedArtist) => artist.name)
    .join(", ");
  const albumImageUrl = track.album.images[0].url;
  const songUrl = track.external_urls.spotify;

  if (isPlaying === false) {
    return NextResponse.json({ isPlaying });
  }

  return NextResponse.json({
    isPlaying,
    title,
    artist,
    albumImageUrl,
    songUrl,
  });
}
