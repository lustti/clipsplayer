


window.addEventListener('load', function () {
    const input = document.getElementById('video-placeholder');
    const input_subtitle = document.getElementById('subtitle-placeholder');
    // 添加点击 span 粘贴剪贴板内容的功能
    const videoLabel = document.getElementById('video-label');
    if (videoLabel) {
        videoLabel.addEventListener('click', function () {
            navigator.clipboard.readText()
                .then(text => {
                    input.value = text;
                    console.log('Pasted from clipboard:', text);
                })
                .catch(err => {
                    console.error('Failed to read clipboard:', err);
                    alert('Failed to read clipboard. Please manually paste the link.');
                });
        });
    }
    
    // 为 Subtitle 输入框添加相同的功能
    const subtitleLabel = document.getElementById('subtitle-label');
    if (subtitleLabel) {
        subtitleLabel.addEventListener('click', function () {
            navigator.clipboard.readText()
                .then(text => {
                    input_subtitle.value = text;
                    console.log('Pasted from clipboard to subtitle:', text);
                })
                .catch(err => {
                    console.error('Failed to read clipboard:', err);
                    alert('Failed to read clipboard. Please manually paste the link.');
                });
        });
    }

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
        localStorage.setItem('video-link', input.value);
        window.location.href = './play' + '#' + input.value;
    });

    // artplayer
    artplayerButton.addEventListener('click', function () {
        console.log('ArtPlayer button clicked');
        localStorage.setItem('video-link', input.value);
        window.location.href = './artplayer' + '#' + input.value;
    });
});