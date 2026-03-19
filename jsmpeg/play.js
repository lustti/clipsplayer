// Setup the option links and defaults
var setDefaultParam = function (q, key, value) {
    if (!q.has(key)) {
        q.set(key, value);
    }
};

var mergeParams = function (a, b) {
    var ret = new URLSearchParams(a.toString());
    for (var kv of b.entries()) {
        ret.set(kv[0], kv[1]);
    }
    return ret;
};

var q = new URLSearchParams(window.location.search);
setDefaultParam(q, 'file', 'blade-runner-2049-360p.ts');
setDefaultParam(q, 'webgl', '1');
setDefaultParam(q, 'wasm', '1');
setDefaultParam(q, 'audio', '1');

var optLinks = document.querySelectorAll('a.param');
for (var i = 0; i < optLinks.length; i++) {
    var optParams = new URLSearchParams(optLinks[i].href.replace(/.*\?/, ''));
    var newParams = mergeParams(q, optParams);

    if (q.toString() === newParams.toString()) {
        optLinks[i].classList.add('active');
    }
    optLinks[i].href = '?' + newParams.toString();
}

var PerformanceGraph = function (canvas, height) {
    this.avg = 0;
    this.width = 0;
    this.height = height || 256;
    this.maxMs = 50;
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.writePos = 0;
    this.data = new Float32Array(4096);
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
};

PerformanceGraph.prototype.resize = function () {
    this.width = Math.min(this.data.length, document.body.offsetWidth);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
};

PerformanceGraph.prototype.labeledLine = function (label, ms) {
    var ctx = this.context;
    var y = ((this.maxMs - ms) * (this.height / this.maxMs)) | 0;
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.strokeWidth = 1;
    ctx.moveTo(0, y);
    ctx.lineTo(this.width, y);
    ctx.stroke();

    ctx.fillStyle = '#ccc';
    ctx.fillText(label, 2, y - 2);
};

PerformanceGraph.prototype.draw = function () {
    var ctx = this.context;
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, this.width, this.height);

    this.labeledLine('16ms', 16);
    this.labeledLine('33ms', 33);

    ctx.strokeStyle = '#99c24d';
    ctx.beginPath();
    for (var x = 0; x < this.width; x++) {
        var i = (x + this.writePos) % this.width;
        var y = (this.maxMs - this.data[i]) * (this.height / this.maxMs);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = '#99c24d';
    ctx.fillText('Avg: ' + this.avg.toFixed(3) + 'ms', 2, 12);
};

PerformanceGraph.prototype.add = function (ms) {
    this.avg = this.avg ? this.avg * 0.95 + ms * 0.05 : ms;
    this.data[this.writePos] = ms;
    this.writePos = (this.writePos + 1) % this.data.length;
    this.draw();
};

var graph = new PerformanceGraph(document.getElementById('performance-graph'), 128);
graph.draw();


// Setup the jsmpeg player
var player = new JSMpeg.Player(q.get('file'), {
    canvas: document.getElementById('video'),
    decodeFirstFrame: true,
    disableWebAssembly: !parseInt(q.get('wasm')),
    throttled: false,
    chunkSize: 4 * 1024 * 1024,
    disableGl: !parseInt(q.get('webgl')),
    audio: !!parseInt(q.get('audio')),
    onVideoDecode: function (decoder, elapsedTime) {
        graph.add(elapsedTime * 1000);
    }
});
player.play();

document.getElementById('video').addEventListener('click', function () {
    if (player.isPlaying) {
        player.pause();
    }
    else {
        player.play();
    }
})