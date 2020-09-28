navigator.mediaDevices = function() {
    if (navigator.mediaDevices) {
        return navigator.mediaDevices;
    }

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
        return {
            getUserMedia: (c) => {
                return new Promise(function(y, n) {
                    navigator.getUserMedia(c, y, n);
                });
            }
        };
    }
}();

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;