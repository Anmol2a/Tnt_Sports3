document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");
    const playPause = document.getElementById("play-pause");
    const progressBar = document.getElementById("progress-bar");
    const mute = document.getElementById("mute");
    const volumeBar = document.getElementById("volume-bar");
    const fullscreen = document.getElementById("fullscreen");

    // DASH Player Setup
    if (dashjs.MediaPlayer().isSupported()) {
        const player = dashjs.MediaPlayer().create();
        player.initialize(video, "https://ottb.live.cf.ww.aiv-cdn.net/lhr-nitro/live/clients/dash/enc/lsdasbvglv/out/v1/bb548a3626cd4708afbb94a58d71dce9/cenc.mpd", true);

        // ClearKey DRM Configuration
        const clearkeyConfig = {
            "org.w3.clearkey": {
                "clearkeys": {
                    "4e993aa8c1f295f8b94e8e9e6f6d0bfe": "86a1ed6e96caab8eb1009fe530d2cf4f"
                }
            }
        };

        player.setProtectionData(clearkeyConfig);
    } else {
        alert("DASH streaming is not supported in this browser.");
    }

    // Play/Pause Toggle
    playPause.addEventListener("click", () => {
        if (video.paused) {
            video.play();
            playPause.innerHTML = "❚❚"; // Pause symbol
        } else {
            video.pause();
            playPause.innerHTML = "▶"; // Play symbol
        }
    });

    // Update Progress Bar
    video.addEventListener("timeupdate", () => {
        progressBar.value = (video.currentTime / video.duration) * 100;
    });

    // Seek Video
    progressBar.addEventListener("input", () => {
        video.currentTime = (progressBar.value / 100) * video.duration;
    });

    // Mute/Unmute
    mute.addEventListener("click", () => {
        video.muted = !video.muted;
        mute.innerHTML = video.muted ? "🔇" : "🔇";
    });

    // Adjust Volume
    volumeBar.addEventListener("input", () => {
        video.volume = volumeBar.value;
    });

    // Fullscreen Toggle
    fullscreen.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            video.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
});
