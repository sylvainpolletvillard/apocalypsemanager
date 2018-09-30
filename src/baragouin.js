let ctx = new AudioContext();
let wavetype = 'sawtooth'
let volume = 10;
let resonance = 10;
let pitch = 10;
let speed = 30;
let anger = 0;

let rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const note = (
    freq = (440 + rand(-40, 40)),
    duration = .5
) => {
    let o = ctx.createOscillator();
    o.frequency.value = freq + (pitch - 50) * 8;
    o.type = wavetype;

    let g = ctx.createGain()
    g.connect(ctx.destination);
    //g.gain.value = volume / 100;
    g.gain.setValueAtTime(volume / 100, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1 + resonance / 100)
    o.connect(g);

    o.start(0);
    o.stop(ctx.currentTime + duration);
}

export const play = (nbNotes = 10) => {
    note();
    if (nbNotes > 0) {
        setTimeout(() => play(--nbNotes), 100);
    }
}

export const baragouin = (text) => {
    let parts = text.split(/\b/)
    let t = 0;
    let tone = 100;
    let coefSpeed = 1 - speed / 120

    for (let p of parts) {
        if (/\w/.test(p)) {
            let nbSyllabs = Math.round(p.length / 3);
            for (let s = 0; s < nbSyllabs; s++) {
                t += 100 * coefSpeed;
                if (nbSyllabs == 2) tone -= 30;
                if (nbSyllabs >= 4) tone += rand(-anger / 4, anger / 4);

                let freq = 440 + tone + rand(-anger, anger);
                setTimeout(() => note(freq, 0.5 * coefSpeed), t);
            }
        } else {
            switch (p.trim()) {
                case "":
                    t += 50 * coefSpeed;
                    tone = 90;
                    break;
                case ",":
                case ";":
                    t += 400 * coefSpeed;
                    tone = 100;
                    break;
                case ".":
                case "?":
                case "!":
                case "\n":
                    t += 800 * coefSpeed;
                    break;
                case "...":
                    t += 1200 * coefSpeed;
                    break;
                default: break;
            }
        }
    }
}