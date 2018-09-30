export const alphabetMilitaire = [
    "Alpha",
    "Bravo",
    "Charlie",
    "Delta",
    "Echo",
    "Foxtrot",
    "Golf",
    "Hotel",
    "India",
    "Juliet",
    "Kilo",
    "Lima",
    "Mike",
    "November",
    "Oscar",
    "Papa",
    "Quebec",
    "Romeo",
    "Sierra",
    "Tango",
    "Uniform",
    "Victor",
    "Whiskey",
    "X-ray",
    "Yankee",
    "Zulu"
]

export const alphabetGrec = [
    "alpha",
    "bêta",
    "gamma",
    "delta",
    "epsilon",
    "zêta",
    "êta",
    "thêta",
    "iota",
    "kappa",
    "lambda",
    "mu",
    "nu",
    "xi",
    "omicron",
    "pi",
    "rhô",
    "sigma",
    "tau",
    "upsilon",
    "phi",
    "khi",
    "psi",
    "ôméga",
]

export const formatTime = (time, noSeconds = false) => {
    let days = Math.floor(time / (1000 * 60 * 60 * 24));
    time %= 1000 * 60 * 60 * 24;
    let hours = Math.floor(time / (1000 * 60 * 60));
    hours = ("0" + hours).slice(-2);
    time %= 1000 * 60 * 60;
    let minutes = Math.floor(time / (1000 * 60));
    minutes = ("0" + minutes).slice(-2);
    time %= 1000 * 60;
    let seconds = Math.floor(time / 1000)
    seconds = ("0" + seconds).slice(-2);

    let parts = [];
    if (days > 0) parts.push(`${days} jours`)
    if (hours > 0 || noSeconds) parts.push(`${hours}: ${minutes}`)
    else parts.push(`${minutes}: ${seconds}`)
    return parts.join(' ');
}