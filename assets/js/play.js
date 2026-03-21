const video_player = document.getElementById('player');

// Check if the URL is a video link
function isVideoUrl(url) {
    const videoExtensions = ['.mp4', '.webm', '.m3u8'];
    const lowerCaseUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerCaseUrl.endsWith(ext));
}

async function playM3u8(url) {
    if (isVideoUrl(url)) {
        if (Hls.isSupported() && url.endsWith('.m3u8')) {
            // video.volume = 0.3;
            var hls = new Hls();
            var m3u8Url = decodeURIComponent(url);
            var noadsMu3u8Text = await removeM3u8Ads(m3u8Url);
            // 创建 Blob 并生成 URL
            const blob = new Blob([noadsMu3u8Text], { type: 'application/x-mpegURL' });
            console.log(noadsMu3u8Text);
            const noadsUrl = URL.createObjectURL(blob);
            console.log(noadsUrl.replace("blob:", ""));
            hls.loadSource(noadsUrl);
            hls.attachMedia(video_player);
            try {
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    video_player.play();
                });
            } catch (error) {
                console.error('Error loading manifest:', error);
            }
            // video_player.src = noadsUrl;
            // video_player.addEventListener('canplay', function () {
            //     video_player.play();
            // });
        } else {
            video_player.src = url;
            video_player.addEventListener('canplay', function () {
                video_player.play();
            });
            // video.volume = 0.3;
            // document.title = url;
        }
    } else {
        alert('Video URL is NOT valid Supported (.mp4,.webm,.m3u8) video URL');
        console.error('Video URL is NOT valid Supported (.mp4,.webm,.m3u8) video URL');
        window.history.back();
    }
}

function playPause() {
    video.paused ? video.play() : video.pause();
}

function volumeUp() {
    if (video.volume <= 0.9) video.volume += 0.1;
}

function volumeDown() {
    if (video.volume >= 0.1) video.volume -= 0.1;
}

function seekRight() {
    video.currentTime += 5;
}

function seekLeft() {
    video.currentTime -= 5;
}

function toggleMute() {
    video.muted = !video.muted;
}

function vidFullscreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    }
}

playM3u8(window.location.href.split('#')[1]);

$(window).on('load', function () {
    // $('#video').on('click', function () {
    //     this.paused ? this.play() : this.pause();
    // });
    // Mousetrap.bind('space', playPause);
    Mousetrap.bind('up', volumeUp);
    Mousetrap.bind('down', volumeDown);
    Mousetrap.bind('right', seekRight);
    Mousetrap.bind('left', seekLeft);
    Mousetrap.bind('enter', vidFullscreen);
    Mousetrap.bind('m', toggleMute);
});
