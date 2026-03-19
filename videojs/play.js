var video = document.getElementById('video-play');

async function playVideo(video_url) {
    // video_source = document.createElement('source');
    // video_source.src = video_url;
    // video_source.type = 'video/webm';
    // video_source.type = 'video/mp4';
    // video_source.type = 'video/x-matroska';
    // video.appendChild(video_source);
    // 创建 Blob 并生成 URL
    if (video_url.endsWith('.m3u8')) {
        var m3u8Url = decodeURIComponent(video_url);
        var noadsMu3u8Text = await window.removeM3u8Ads(m3u8Url);
        // video.volume = 0.3;
        const blob = new Blob([noadsMu3u8Text], { type: 'application/x-mpegURL' });
        console.log(noadsMu3u8Text);
        const noadsUrl = URL.createObjectURL(blob);
        video_url = noadsUrl;
    }
    videojsOptions = {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        enableSmoothSeeking: true,
        playbackRates: [0.5, 1, 1.5, 2],
        controlBar: {
            skipButtons: {
                forward: 5,
                backward: 10,
            }
        },
        sources: [{
            src: video_url,
            type: 'video/webm'
        }]
    }
    var player = videojs('video-play', videojsOptions);
    // player.play();
}

playVideo(window.location.href.split('#')[1]);