"use client";

import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import Link from "next/link";

type Song = {
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
  isPlaying: boolean;
};

export default function Home() {
  const { data: currentSong } = useSWR<Song>(
    "/api/currently-playing",
    fetcher,
    {
      refreshInterval: 60000,
    }
  );

  return (
    <main className="min-h-screen flex items-center bg-slate-900 justify-center">
      {currentSong && currentSong.isPlaying ? (
        <section className="flex items-center border border-slate-800 rounded-sm p-1 min-w-[15rem]">
          <div className="flex flex-col items-center">
            <Image
              src={currentSong.albumImageUrl}
              width={128}
              height={128}
              alt={currentSong.title}
            />
          </div>
          <div className="flex flex-col items-start w-full justify-center px-4">
            <p className="font-semibold">{currentSong.title}</p>
            <p className="text-sm text-white/90">{currentSong.artist}</p>
          </div>
            <Link className="mr-3 border rounded-sm border-slate-700 p-1 text-xs" href={currentSong.songUrl} target="_blank">Open</Link>
        </section>
      ) : (
        <div>Not playing</div>
      )}
    </main>
  );
}
