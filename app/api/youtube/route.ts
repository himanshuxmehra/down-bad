import { NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function POST(req: Request) {
  // console.log(req);
  // if (req.method !== "POST") {
  //   return res.status(405).json({ message: "Method not allowed" });
  // }
  const body = await req.json();
  const { url } = body;

  if (!url) {
    return new NextResponse("URL is required", { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);

    const formats = ytdl
      .filterFormats(info.formats, "videoandaudio")
      .map((format) => ({
        quality: format.qualityLabel,
        url: format.url,
        container: format.container,
      }));

    const res = {
      url: url,
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      formats: formats,
    };

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error downloading video:", error);
    return new NextResponse("Failed to process video", { status: 500 });
  }
}
