var video = document.getElementById('video-play');

function playVideo(video_url) {
    // video_source = document.createElement('source');
    // video_source.src = video_url;
    // video_source.type = 'video/webm';
    // video_source.type = 'video/mp4';
    // video_source.type = 'video/x-matroska';
    // video.appendChild(video_source);
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