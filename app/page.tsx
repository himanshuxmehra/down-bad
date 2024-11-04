"use client";
import { useState } from "react";
import Head from "next/head";
import { Download, Youtube } from "lucide-react";

interface DownloadResponse {
  url: string;
  title: string;
  thumbnail: string;
  formats: {
    quality: string;
    url: string;
    container: string;
  }[];
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoInfo, setVideoInfo] = useState<DownloadResponse | null>(null);

  const isValidYouTubeUrl = (url: string) => {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/).+/;
    return regex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch video information");
      }

      const data = await response.json();
      setVideoInfo(data);
    } catch (err) {
      setError("Failed to get video information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>YouTube Video Downloader</title>
        <meta name="description" content="Download YouTube videos and shorts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-8 space-x-2">
            <Youtube className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              YouTube Downloader
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube URL here..."
                className="flex-1 p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 duration-200 ease-in-out"
              >
                {loading ? "Loading..." : "Download"}
              </button>
            </div>
            {error && <p className="mt-2 text-red-400">{error}</p>}
          </form>

          {videoInfo && (
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-full sm:w-48 h-auto rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-4 text-gray-100">
                    {videoInfo.title}
                  </h2>
                  <div className="space-y-3">
                    {videoInfo.formats.map((format, index) => (
                      <a
                        key={index}
                        href={format.url}
                        download
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 transition-all p-3 rounded-lg group transform hover:scale-102 duration-200 ease-in-out"
                      >
                        <Download className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                        <span className="text-gray-200 group-hover:text-white">
                          Download {format.quality} ({format.container})
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
