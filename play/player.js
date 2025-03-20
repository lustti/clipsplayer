var video = document.getElementById('video');

// Check if the URL is a video link
function isVideoUrl(url) {
    const videoExtensions = ['.mp4', '.webm', '.m3u8'];
    const lowerCaseUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerCaseUrl.endsWith(ext));
}

function playM3u8(url) {
    if (isVideoUrl(url)) {
        if (Hls.isSupported() && url.endsWith('.m3u8')) {
            video.volume = 0.3;
            var hls = new Hls();
            var m3u8Url = decodeURIComponent(url);
            hls.loadSource(m3u8Url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
            // document.title = url;
     // } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        } else {
            video.src = url;
            video.addEventListener('canplay', function () {
                video.play();
            });
            video.volume = 0.3;
            // document.title = url;
        }
    } else {
        console.error('After # URL is NOT valid Supported (.mp4,.webm,.m3u8)video URL');
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
    $('#video').on('click', function () {
        this.paused ? this.play() : this.pause();
    });
    Mousetrap.bind('space', playPause);
    Mousetrap.bind('up', volumeUp);
    Mousetrap.bind('down', volumeDown);
    Mousetrap.bind('right', seekRight);
    Mousetrap.bind('left', seekLeft);
    Mousetrap.bind('f', vidFullscreen);
    Mousetrap.bind('m', toggleMute);
});
