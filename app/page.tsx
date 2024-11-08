'use client';

import { useState } from 'react';
import { Download, ClipboardCopy, Plus, Volume1, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import SupportedServices from '@/components/SupportedServices';

interface DownloadResponse {
  url: string;
  title: string;
  thumbnail: string;
  formats: {
    quality: string;
    itag: number;
    container: string;
  }[];
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoInfo, setVideoInfo] = useState<DownloadResponse | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<number | null>(null);

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/).+/;
    return regex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video information');
      }

      const data = await response.json();
      setVideoInfo(data);
    } catch (err) {
      setError('Failed to get video information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = async (itag: number, index: number) => {
    if (!videoInfo) return;

    try {
      setDownloadingFormat(index);
      
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: videoInfo.url,
          itag,
          title: videoInfo.title,
        }),
      });

      if (!response.ok) throw new Error('Download failed');

      // Create blob from the stream
      const blob = await response.blob();
      
      // Create and click download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${videoInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download video. Please try again.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
    {/* Top Bar */}
    <TopBar/>

    {/* Sidebar */}
    <Sidebar/>

    {/* Main Content */}
    <div className="pt-12 pl-16">
      <div className="max-w-2xl mx-auto p-8">
        <SupportedServices/>

        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 text-white">
          <svg fill="#fff" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M29.22,13.95h-.28v-2.07c0-4.75-5.76-8.61-12.84-8.61S3.26,7.14,3.26,11.88v2.07h-.48c-.84,0-1.52,.68-1.52,1.52v1.06c0,.84,.68,1.52,1.52,1.52h.48v2.07c0,4.74,5.76,8.6,12.84,8.6s12.84-3.86,12.84-8.6v-2.07h.28c.84,0,1.52-.68,1.52-1.52v-1.06c0-.84-.68-1.52-1.52-1.52ZM16.1,4.78c5.85,0,10.68,2.79,11.28,6.36H4.82c.6-3.57,5.43-6.36,11.28-6.36ZM4.76,12.63H27.44v1.32H4.76v-1.32Zm11.34,14.58c-5.85,0-10.68-2.79-11.28-6.35h12.49l1.8,3c.14,.23,.38,.36,.64,.36s.51-.14,.64-.36l1.8-3h5.17c-.6,3.56-5.43,6.35-11.28,6.35Zm11.34-7.85h-5.66c-.26,0-.51,.14-.64,.36l-1.38,2.29-1.38-2.29c-.14-.23-.38-.36-.64-.36H4.76v-1.32H27.44v1.32Zm1.78-2.82l-26.46-.02,.02-1.08h1.22s0,0,0,0H28.19s0,0,0,0h1.02s.02,.02,.02,.02l-.02,1.08Z"></path>
            </g></svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="url"
              placeholder="paste the link here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-black/50 border-gray-800 rounded-lg pl-4 pr-24 py-6 text-gray-300 placeholder-gray-500"
              required
            />
            <Button 
              type="button" 
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => {
                navigator.clipboard.readText().then(text => setUrl(text))
              }}
            >
              <ClipboardCopy className="h-4 w-4 mr-2" />
              paste
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              // variant={isAudioOnly ? "secondary" : "ghost"}
              className="rounded-lg"
              // onClick={() => setIsAudioOnly(!isAudioOnly)}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              audio
            </Button>
            <Button
              type="button"
              // variant={isMuted ? "secondary" : "ghost"}
              className="rounded-lg"
              // onClick={() => setIsMuted(!isMuted)}
            >
              <Volume1 className="h-4 w-4 mr-2" />
              mute
            </Button>
            <Button type="submit" onClick={handleSubmit} className="rounded-lg ml-auto">
              <Download className="h-4 w-4 mr-2" />
              download
            </Button>
          </div>
        </form>
           {videoInfo && (
            <div className="mt-10 bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
              <div className="flex-col sm:flex-row gap-6">
                <div>
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="lg:w-[3/4] h-96 rounded-lg shadow-md"
                  />
                </div>
                <div className="flex-col w-full">
                  <div className='mt-2'>
                  <h2 className="text-xl font-semibold mb-4 text-gray-100">{videoInfo.title}</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {videoInfo.formats.map((format, index) => {
                       if ( format.hasAudio && (format.audioBitrate > 64 || format.audioBitrate || format.mimeType?.split(';')[0]))
                      return <button
                        key={index}
                        onClick={() => downloadVideo(format.itag, index)}
                        disabled={downloadingFormat !== null}
                        className="w-full flex items-center bg-gray-700 hover:bg-gray-600 transition-all p-4 rounded-lg group transform hover:scale-102 duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloadingFormat === index ? (
                          <Loader2 className="w-5 h-5 animate-spin text-red-400" />
                        ) : (
                          <Download className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                        )}
                        <span className="text-gray-200 text-sm group-hover:text-white">
                         Download {format.qualityLabel} ({format.mimeType?.split(';')[0]})
                        </span>
                      </button>
                    
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        <p className="text-center text-gray-500 text-sm mt-8">
          by continuing, you agree to{' '}
          <button className="text-gray-400 underline">terms and ethics of use</button>
        </p>
      </div>
    </div>
  </div>
    // <div className="min-h-screen bg-gray-900 text-gray-100">
    //   <main className="container mx-auto px-4 py-8">
    //     <div className="mx-auto">
    //       <div className="flex flex-col items-center justify-center mb-8 space-x-2">
    //         <div className='flex'>
    //         <Video className="w-8 h-8 text-red-500" />
    //         <h1 className="px-2 text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
    //           down bad
    //         </h1>
    //         </div>
    //         <div>
    //         <h4 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
    //           download videos from popular websites
    //         </h4>
    //         </div>
    //       </div>

    //       <form onSubmit={handleSubmit} className="mb-8">
    //         <div className="flex flex-col sm:flex-row gap-4">
    //           <input
    //             type="text"
    //             value={url}
    //             onChange={(e) => setUrl(e.target.value)}
    //             placeholder="Paste YouTube URL here..."
    //             className="flex-1 p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
    //           />
    //           <button
    //             type="submit"
    //             disabled={loading}
    //             className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 duration-200 ease-in-out flex items-center justify-center gap-2"
    //           >
    //             {loading ? (
    //               <>
    //                 <Loader2 className="w-5 h-5 animate-spin" />
    //                 Loading...
    //               </>
    //             ) : (
    //               'Get Video'
    //             )}
    //           </button>
    //         </div>
    //         {error && (
    //           <p className="mt-2 text-red-400">{error}</p>
    //         )}
    //       </form>

    
    //     </div>
    //   </main>
    // </div>
  );
}
