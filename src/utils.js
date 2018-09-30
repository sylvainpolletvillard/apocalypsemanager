export const coinflip = (n = 2) => {
    return Math.random() <= 1 / n
}

export const randomBetween = (a, b, integer = true) => {
    let r = a + Math.random() * (b - a + 1)
    return integer ? Math.floor(r) : r
}

export const pickRandom = list => {
    return list[Math.floor(Math.random() * list.length)];
}

export const clone = o => JSON.parse(JSON.stringify(o));

export const removeFromArray = (array, itemToRemove) => array.splice(array.indexOf(itemToRemove), 1)