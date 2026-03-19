


window.addEventListener('load', function () {
    const input = document.getElementById('video-placeholder');
    const input_subtitle = document.getElementById('subtitle-placeholder');

    // play
    const playButton = document.getElementById('play-btn');
    const videojsButton = document.getElementById('videojs-btn');
    const jsmpegButton = document.getElementById('jsmpeg-btn');

    // players
    const artplayerButton = document.getElementById('artplayer-btn');

    // input forms
    input.value = localStorage.getItem('video-link') || '';
    input_subtitle.value = localStorage.getItem('subtitle-link') || '';

    // key press mapping
    document.addEventListener('keydown', function (event) {
        console.log('Keydown event triggered');
        if (event.key === 'Enter') {
            console.log('Enter key pressed');
            playButton.click();
        }
    });

    // button click mapping
    // original video element of html5
    playButton.addEventListener('click', function () {
        console.log('Play button clicked');
        let url = input.value;
        localStorage.setItem('video-link', url);
        window.location.href = './play' + '#' + url;

    });
    // videojs
    videojsButton.addEventListener('click', function () {
        console.log('VideoJS button clicked');
        let url = input.value;
        localStorage.setItem('video-link', url);
        window.location.href = './videojs' + '#' + url;

    });
    // jsmpeg
    jsmpegButton.addEventListener('click', function () {
        console.log('JSMpeg button clicked');
        let url = input.value;
        localStorage.setItem('video-link', url);
        window.location.href = './jsmpeg' + '#' + url;

    });
    // artplayer
    artplayerButton.addEventListener('click', function () {
        console.log('ArtPlayer button clicked');
        let url = input.value;
        localStorage.setItem('video-link', url);
        window.location.href = './artplayer' + '#' + url;

    });
});