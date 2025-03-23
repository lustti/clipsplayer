window.addEventListener('load', function () {
    const input = document.getElementById('m3u8-placeholder');
    const playButton = document.getElementById('play-btn');
    const artplayButton = document.getElementById('artplay-btn');

    input.value = localStorage.getItem('m3u8-link') || '';

    document.addEventListener('keydown', function (event) {
        console.log('Keydown event triggered');
        if (event.key === 'Enter') {
            console.log('Enter key pressed');
            playButton.click();
        }
    });

    playButton.addEventListener('click', function () {
        console.log('Play button clicked');
        localStorage.setItem('m3u8-link', input.value);
        window.location.href = './play' + '#' + input.value;
    });
    artplayButton.addEventListener('click', function () {
        console.log('Play button clicked');
        localStorage.setItem('m3u8-link', input.value);
        window.location.href = './artplay' + '#' + input.value;
    });
});
