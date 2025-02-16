document.addEventListener("DOMContentLoaded", async function () {
    const video = document.getElementById("video");
    const playPause = document.getElementById("play-pause");
    const progressBar = document.getElementById("progress-bar");
    const mute = document.getElementById("mute");
    const volumeBar = document.getElementById("volume-bar");
    const fullscreen = document.getElementById("fullscreen");
    const qualitySelector = document.getElementById("quality-selector");
    const speedSelector = document.getElementById("speed-selector");

    // Initialize Shaka Player
    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) {
        alert("Shaka Player is not supported on this browser.");
        return;
    }

    const player = new shaka.Player(video);

    // ClearKey DRM Configuration
    const clearkeyConfig = {
        clearKeys: {
            "4e993aa8c1f295f8b94e8e9e6f6d0bfe": "86a1ed6e96caab8eb1009fe530d2cf4f"
        }
    };

    player.configure({
        drm: {
            servers: { "org.w3.clearkey": clearkeyConfig }
        }
    });

    try {
        await player.load("https://ottb.live.cf.ww.aiv-cdn.net/lhr-nitro/live/clients/dash/enc/lsdasbvglv/out/v1/bb548a3626cd4708afbb94a58d71dce9/cenc.mpd");
        console.log("Video loaded successfully.");
    } catch (e) {
        console.error("Error loading video", e);
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
        mute.innerHTML = video.muted ? "🔇" : "🔊";
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

    // Populate Quality Selector
    player.addEventListener("adaptation", () => {
        qualitySelector.innerHTML = "";
        player.getVariantTracks().forEach(track => {
            let option = document.createElement("option");
            option.value = track.id;
            option.textContent = `${track.height}p`;
            qualitySelector.appendChild(option);
        });
    });

    // Change Video Quality
    qualitySelector.addEventListener("change", () => {
        player.configure("abr.enabled", false);
        player.selectVariantTrack(
            player.getVariantTracks().find(track => track.id == qualitySelector.value),
            true
        );
    });

    // Change Playback Speed
    speedSelector.addEventListener("change", () => {
        video.playbackRate = parseFloat(speedSelector.value);
    });
});
