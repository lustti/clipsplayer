// Check if the URL is a video link


async function playVideo(video_url) {
    var art = new Artplayer({
        container: '.artplayer-app',
        url: video_url,
        poster: '../assets/imgs/poster.jpeg',
        autoplay: true,
        pip: true,
        screenshot: true,
        setting: true,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        mutex: true,
        backdrop: true,
        playsInline: true,
        autoPlayback: true,
        theme: '#ffc0cb',
        customType: {
            m3u8: async function playM3u8(video, url, art) {
                if (Hls.isSupported()) {
                    if (art.hls) art.hls.destroy();
                    var m3u8Url = decodeURIComponent(url);
                    var noadsMu3u8Text = await removeM3u8Ads(m3u8Url);
                    // video.volume = 0.3;
                    const blob = new Blob([noadsMu3u8Text], { type: 'application/x-mpegURL' });
                    console.log(noadsMu3u8Text);
                    const noadsUrl = URL.createObjectURL(blob);
                    const hls = new Hls();
                    hls.loadSource(noadsUrl);
                    hls.attachMedia(video);
                    art.hls = hls;
                    art.on('destroy', () => hls.destroy());
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                } else {
                    art.notice.show = '不支持播放m3u8格式';
                    window.history.back();
                }
            }
        },

    });
    Artplayer.CONTEXTMENU = true;

}


playVideo(window.location.href.split('#')[1]);

