const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const streamKey = "v0yx-mvrw-scvd-tb1h-6her";

let ffmpegProcess = null;
const YOUTUBE_RTMP = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;

function startStream(videoPath) {
    ffmpegProcess = ffmpeg(videoPath)
        .addOptions([
            '-f flv',
            '-vcodec libx264',
            '-preset veryfast',
            '-r 60',               // Frame rate
            '-g 120',              // GOP size = framerate x 2
            '-keyint_min 120',
            '-b:v 6000k',          // Bitrate video (trong khoảng 4500k - 9000k)
            '-maxrate 6000k',
            '-bufsize 12000k',     // Gấp đôi maxrate
            '-pix_fmt yuv420p',    // YouTube yêu cầu
            '-acodec aac',
            '-ar 44100',
            '-b:a 160k',           // Bitrate âm thanh
            '-threads 2',
            '-strict experimental'
        ])
        .output(YOUTUBE_RTMP)
        .on("start", () => console.log("🎥 Live started"))
        .on("end", () => console.log("✅ Live ended"))
        .on("error", (err) => console.error("❌ FFmpeg error:", err.message))
        .run();
}

function stopStream() {
    if (ffmpegProcess) {
        ffmpegProcess.kill("SIGINT");
        ffmpegProcess = null;
        console.log("🛑 Livestream đã dừng");
    }
}

module.exports = { startStream, stopStream };
