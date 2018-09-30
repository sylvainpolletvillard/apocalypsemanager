import { options } from "@/game"

export const SOUNDS = {}

let music;
let musicVolume = 0.6

export const stopMusic = () => {
    if (music) return fadeOut(music, 100)
    else return Promise.resolve(music)
}

export const playMusic = function (name, loop = true, fadeInDuration = 400) {
    if (!options.mute) return stopMusic().then(() => {
        music = SOUNDS[name];
        music.loop = loop;
        return fadeIn(music, fadeInDuration, musicVolume)
    })
}

export const playSound = function (name) {
    if (!options.mute) {
        try { SOUNDS[name].cloneNode(true).play(); } catch (e) { console.error(e) }
    }
}


const fadeVolumeIntervalRegister = new Map();

export const fadeVolume = (audioElem, initialVolume, finalVolume, duration, nbSteps) => {
    if (fadeVolumeIntervalRegister.has(audioElem)) {
        clearInterval(fadeVolumeIntervalRegister.get(audioElem))
    }

    let currentStep = 0;
    audioElem.volume = initialVolume;

    return new Promise((resolve) => {
        const fadeInterval = setInterval(() => {
            audioElem.volume += (finalVolume - initialVolume) / nbSteps;
            currentStep++;
            if (currentStep === nbSteps) {
                clearInterval(fadeInterval)
                fadeVolumeIntervalRegister.delete(audioElem);
                audioElem.volume = finalVolume;
                resolve(audioElem);
            }
        }, duration / nbSteps)

        fadeVolumeIntervalRegister.set(audioElem, fadeInterval)
    })
}

export const fadeIn = (audioElem, duration = 400, finalVolume = 1, nbSteps = 10) => {
    audioElem.volume = 0;
    try { music.play(); } catch (e) { console.error(e) }
    return fadeVolume(audioElem, 0, finalVolume, duration, nbSteps)
}

export const fadeOut = (audioElem, duration = 400, nbSteps = 10) => {
    return fadeVolume(audioElem, audioElem.volume, 0, duration, nbSteps).then((audioElem) => {
        audioElem.pause();
        audioElem.currentTime = 0;
        return audioElem
    })
}