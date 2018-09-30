const images = [
    'spacerock.d83d2872.gif'
]

const sounds = [
    '1',
    '2',
    '3',
    '4',
    '5',
    'TitleScreen',
    'FlashInfo',
    'MissionAborted',
    'MissionComplete',
    'MissionFailed',
    'MissionStarted',
    'YouLose',
    'YouWin',
]

export const preloadGame = (onProgress) => {
    return new Promise((resolve) => {
        loadAssets(images, sounds, resolve, onProgress);
    })
}

export const loadAssets = function (imageNames, soundNames, callback, onProgress) {

    // load multiple images and callback when ALL images have loaded
    let images = {},
        sounds = {},
        assets = imageNames.concat(soundNames),
        loaded = 0,
        loadedAssets = {},
        started = 0,
        MAX_CONCURRENT_DL = 10;

    function onload(name) {
        if (loadedAssets.hasOwnProperty(name)) return;
        loadedAssets[name] = true;
        loaded++;
        onProgress(loaded / assets.length * 100);
        /*if (this._loadingTimeout) {
            clearTimeout(this._loadingTimeout);
        }*/
        if (loaded >= assets.length && callback) {
            callback({ images, sounds });
            callback = null;
        } else if (started < assets.length) {
            loadNext();
        }
    }

    function loadNext() {
        var name = assets[started];
        var type = started < imageNames.length ? "image" : "sound";
        started++;

        switch (type) {
            case "image":
                images[name] = document.createElement('img');
                images[name].addEventListener('load', () => onload(name));
                images[name].addEventListener('error', () => onload(name));
                images[name].src = "img/" + name;
                break;
            case "sound":
                sounds[name] = document.createElement('audio');
                sounds[name].addEventListener('canplaythrough', () => onload(name), false);
                sounds[name].addEventListener('canplay', () => onload(name), false);
                sounds[name].addEventListener('load', () => onload(name), false);
                sounds[name].addEventListener('error', () => onload(name), false);
                //sounds[name]._loadingTimeout = setTimeout(onload, 5000); // too long to load, skip
                sounds[name].src = 'audio/' + name + ".mp3";
                document.body.appendChild(sounds[name]);
                sounds[name].load();
                break;
        }
    }

    while (MAX_CONCURRENT_DL--) loadNext();
}