import { playSound } from "@/audio";

export const version = "0.8"

export const options = {
    mute: true // pas de son par défaut car obligé de cliquer pour avoir le droit de jouer un son sur Chrome
}

export const modes = [
    {
        id: 1,
        label: "Apocalypse des familles",
        description: `Partie de 30 minutes pour débutants`
    },
    {
        id: 2,
        label: "Apocalypse standard",
        description: `Partie de 25 minutes, difficulté moyenne`
    },
    {
        id: 3,
        label: "Apocalypse pas fastoche",
        description: `Partie de 20 minutes, difficulté élevée`
    },
    {
        id: 4,
        label: "Apocalypse apocalyptique",
        description: `Partie de 15 minutes, très difficile`
    },
]

export const state = {
    loaded: false
}

window._state = state;

export const everyDay = (onGameOver) => {

    Object.entries(state.ressourcesProductionPerDay).forEach(([res, val]) => {
        state.ressources[res] += val;
    })

    Object.entries(state.ressourcesConsumptionPerDay).forEach(([res, val]) => {
        state.ressources[res] -= Math.round(val * state.ressourcesConsumptionFactor[res]);
    })

    if (state.ressources.food < 0) {
        if (state.squads.length > 0) {
            state.squads.pop();
            newMessage({
                title: "Pénurie de nourriture",
                text: `Les stocks de nourriture sont vides. Une escouade a quitté la base pour en chercher, mais je ne crois pas qu'on les verra revenir.`
            })
        } else if (state.scientifics.length > 0) {
            state.scientifics.pop();
            newMessage({
                title: "On a faim !",
                text: `Les scientifiques sont affamés à lécher les murs. Une équipe a déserté et tente sa chance dans la ville d'à côté. Mais ils n'ont aucune chance de s'en sortir.`
            })
        } else {
            onGameOver('food')
        }
    }
    else if (state.ressources.water < 0) {
        if (state.squads.length > 0) {
            state.squads.pop();
            newMessage({
                title: "Pénurie d'eau",
                text: `Les escouades réclament à boire ! La dernière citerne est vide, une équipe a déserté pour se diriger vers la rivière.`
            })
        } else if (state.scientifics.length > 0) {
            state.scientifics.pop();
            newMessage({
                title: "De l'eau !",
                text: `Les scientifiques sont déshydratés et ne parviennent plus à travailler. Une des équipes a quitté la base après que plusieurs d'entre eux aient perdu connaissance.`
            })
        } else {
            onGameOver('water')
        }
    }

    Object.entries(state.ressources).forEach(([res, val]) => {
        if (val < 0) {
            state.ressources[res] = 0;
        }
    })

}

export const calcMissionChanceSucces = () => {
    return state.missionChanceSucces // technos comptent pour 75% du succès
        + Math.min(1, state.ressources.plutonium / reserve.plutonium) * 15
        + Math.min(1, state.ressources.water / reserve.water) * 5
        + Math.min(1, state.ressources.food / reserve.food) * 5
}

export const reserve = {
    food: 100,
    water: 100,
    //metal: 50,
    plutonium: 30
}

export const newGame = () => {

    Object.assign(state, {
        currentEpoch: 1,
        researchTimeFactor: 1,
        missionTimeFactor: 1,
        missionChanceSucces: 0,

        ressourcesConsumptionPerDay: {
            food: 4,
            water: 4,
            fuel: 0,
            metal: 0,
            battery: 0,
            component: 0,
            plutonium: 0
        },

        ressourcesProductionPerDay: {
            food: 0,
            water: 0,
            fuel: 0,
            metal: 0,
            battery: 0,
            component: 0,
            plutonium: 0
        },

        ressourcesConsumptionFactor: {
            food: 1,
            water: 1,
            fuel: 1,
            metal: 1,
            battery: 1,
            component: 1,
            plutonium: 1
        },

        hasNewMessage: false,
        messages: [],

        scientifics: [
            {
                level: 2,
                status: "idle"
            },
            {
                level: 1,
                status: "idle"
            }
        ],

        projectsStarted: [],
        projectsFinished: []
    })

    switch (state.mode.id) {
        case 1:
            Object.assign(state, {
                dureeJeu: 30 * 60 * 1000,
                ressources: {
                    food: 50,
                    water: 50,
                    fuel: 20,
                    metal: 5,
                    component: 2,
                    battery: 1,
                    plutonium: 0
                },
                squads: [
                    {
                        level: 3,
                        status: "idle"
                    },
                    {
                        level: 2,
                        status: "idle"
                    },
                    {
                        level: 1,
                        status: "idle"
                    }
                ],
                timeBetweenEpochs: 1000 * 60 * 6 // 6 minutes
            })
            break;

        case 2:
            Object.assign(state, {
                dureeJeu: 25 * 60 * 1000,
                ressources: {
                    food: 25,
                    water: 25,
                    fuel: 10,
                    metal: 5,
                    component: 2,
                    battery: 1,
                    plutonium: 0
                },
                squads: [
                    {
                        level: 2,
                        status: "idle"
                    },
                    {
                        level: 1,
                        status: "idle"
                    }
                ],
                timeBetweenEpochs: 1000 * 60 * 5 // 5 minutes
            })
            break;

        case 3:
            Object.assign(state, {
                dureeJeu: 20 * 60 * 1000,
                ressources: {
                    food: 20,
                    water: 20,
                    fuel: 15,
                    metal: 5,
                    component: 2,
                    battery: 1,
                    plutonium: 0
                },
                squads: [
                    {
                        level: 3,
                        status: "idle"
                    },
                    {
                        level: 2,
                        status: "idle"
                    }
                ],
                researchTimeFactor: 0.75,
                missionTimeFactor: 0.75,
                currentEpoch: 2,
                timeBetweenEpochs: 1000 * 60 * 5 // 5 minutes
            })
            break;

        case 4:
            Object.assign(state, {
                dureeJeu: 15 * 60 * 1000,
                ressources: {
                    food: 10,
                    water: 10,
                    fuel: 20,
                    metal: 5,
                    component: 0,
                    battery: 0,
                    plutonium: 0
                },
                squads: [
                    {
                        level: 5,
                        status: "idle"
                    },
                    {
                        level: 3,
                        status: "idle"
                    }
                ],
                researchTimeFactor: 0.5,
                missionTimeFactor: 0.5,
                currentEpoch: 3,
                timeBetweenEpochs: 1000 * 60 * 5 // 5 minutes
            })
            break;
    }

    state.apocalypseTime = Date.now() + state.dureeJeu;
    state.speed = (30 * 24 * 60 * 60 * 1000) / state.dureeJeu; // 1min = 1 jour en difficulté 1


    //TODO: test rapide = CHEAT
    /*
    state.ressources.food = 99;
    state.ressources.water = 99;
    state.ressources.plutonium = 99;
    state.projectsFinished.push("Réacteur nucléaire")
    */
}

export const saveGame = () => {
    state.apocalypseRemainingTime = state.apocalypseTime - Date.now();
    for (let squad of state.squads) {
        if (squad.missionEndTime) squad.missionRemainingTime = squad.missionEndTime - Date.now();
    }
    for (let scientific of state.scientifics) {
        if (scientific.projectEndTime) scientific.projectRemainingTime = scientific.projectEndTime - Date.now();
    }
    localStorage.setItem(`SAVE_V${version}`, JSON.stringify(state))
}

export const loadSavedGame = () => {
    Object.assign(state, JSON.parse(localStorage.getItem(`SAVE_V${version}`)))
    state.apocalypseTime = Date.now() + state.apocalypseRemainingTime;
    for (let squad of state.squads) {
        if (squad.missionRemainingTime) squad.missionEndTime = Date.now() + squad.missionRemainingTime
    }
    for (let scientific of state.scientifics) {
        if (scientific.projectRemainingTime) scientific.projectEndTime = Date.now() + scientific.projectRemainingTime
    }
}

export const deleteSave = () => {
    localStorage.removeItem(`SAVE_V${version}`)
}

export const hasSavedGame = () => localStorage.getItem(`SAVE_V${version}`) != null

export const newMessage = (message) => {
    if (state.messages.map(m => JSON.stringify(m)).includes(JSON.stringify(message))) {
        return; // duplicate message
    }

    playSound("FlashInfo");
    state.messages.push(message);
    state.hasNewMessage = true;
}

export const getBestScore = mode => {
    return localStorage.getItem(`SCORE_V${version}_D${mode.id}`);
}

export const calcScore = () => {
    let score = {
        victory: state.victory ? +state.mode.id * 1000 : 0,
        tech: state.projectsFinished.length * 50,
        ressources: Object.entries(state.ressources).reduce(
            (total, [res, amount]) => total + amount * (res === "plutonium" ? 5 : 1), 0
        ),
        time: Math.ceil((state.timeLeft || 0) / 1000)
    }

    score.total = score.victory + score.tech + score.ressources + score.time;

    let key = `SCORE_V${version}_D${state.mode.id}`;
    let oldScore = getBestScore(state.mode);
    score.isNewRecord = !oldScore || score.total > oldScore;
    if (score.isNewRecord) {
        localStorage.setItem(key, score.total);
    }

    return score;
}