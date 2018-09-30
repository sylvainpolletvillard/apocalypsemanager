import { coinflip, randomBetween, pickRandom, removeFromArray } from "@/utils";
import { state } from "@/game";
import { getRessources } from "@/ressources";
import { playSound } from "./audio";

export const calcProbaSuccesMission = (squad, mission, dureeMission) => {
    let missionDifficulty = (mission.level + state.currentEpoch - 1) * (1 + 0.2 * (dureeMission - 1)) + 0.2 * (dureeMission - 1)
    let rapportDeForce = (2 + squad.level) / (2 + missionDifficulty)
    let probaSucces = 1 - Math.exp(-1.6 * Math.pow(rapportDeForce, 2))
    //console.log({ missionDifficulty, level: squad.level, rapportDeForce, probaSucces })
    return probaSucces
}

export const startMission = (squad, mission, dureeMission) => {
    squad.status = "mission";
    squad.mission = mission;
    let duree = (1 + mission.distance * 2 + dureeMission) * state.missionTimeFactor * 1000 * 5;
    squad.dureeMission = dureeMission
    squad.missionEndTime = Date.now() + duree
    playSound("MissionStarted")
}

export const endMission = squad => {
    delete squad.missionEndTime;

    let probaSucces = calcProbaSuccesMission(squad, squad.mission, squad.dureeMission)

    squad.missionResult = {
        probaSucces,
        resume: [],
        levelGain: 0
    }

    if (Math.random() <= probaSucces) {
        squad.status = "missionSuccess";

        squad.missionResult.levelGain += 1; // expérience de la mission

        if (probaSucces < 0.34) {
            squad.missionResult.resume.push(pickRandom([
                "On a eu de la chance !",
                "C'est pas passé loin...",
                "J'ai bien cru y rester",
                "C'était chaud mais on s'en est sortis"
            ]))
        } else if (probaSucces > 0.9) {
            squad.missionResult.resume.push(pickRandom([
                "Un vrai jeu d'enfant",
                "Comme sur des roulettes",
                "C'était une mission facile",
                "Vous n'avez pas plus dur comme mission pour nous ?"
            ]))
        } else {
            squad.missionResult.resume.push(pickRandom([
                "Rien à à signaler",
                "Tout s'est bien passé",
                "On est pas revenus les mains vides",
                "Regardez ce qu'on a ramené"
            ]))
        }

        if (coinflip(4)) {
            squad.missionResult.resume.push("On a trouvé des rescapés prêts à rejoindre nos rangs.")
            squad.missionResult.levelGain += 1
        }
        if (coinflip(8)) {
            squad.missionResult.resume.push("On a trouvé des armes pour mieux se défendre lors des prochaines missions.")
            squad.missionResult.levelGain += 2
        }
        squad.missionResult.resume.push(`Niveau de l'escouade +${squad.missionResult.levelGain}`)

        if (coinflip(4 - 2 * probaSucces) && squad.mission.squad) {
            squad.missionResult.resume.push(pickRandom([
                "On a recruté d'autres gens sur place, de quoi faire une nouvelle escouade.",
                "Certains hommes se sont dit prêts à se battre pour nous.",
                "Quelques bras cassés tiennent à nous aider, peut-être on en fera quelque-chose..."
            ]))
            squad.missionResult.squad = randomBetween(squad.mission.squad - 2, squad.mission.squad + 2)
        }
        if (coinflip(5 - 2 * probaSucces) && squad.mission.scientific) {
            squad.missionResult.resume.push(pickRandom([
                "Ces scientifiques se cachaient sous les tables quand on est arrivés. Ils disent qu'ils peuvent nous aider.",
                "On a trouvé plusieurs barbus en blouse là-bas. Ils pourraient aider au projet.",
                "Des matheux estiment notre probabilité de survivre à 12%, mais prétendent qu'elles montent à 93% si on les emmène avec nous."
            ]))
            squad.missionResult.scientific = randomBetween(squad.mission.scientific - 2, squad.mission.scientific + 2)
        }

        squad.missionResult.ressources = calcRessourcesObtained(squad.mission.ressources, squad.dureeMission, probaSucces)

    } else {
        let probaDeath = 0.5 * (1 - probaSucces)
        if (Math.random() <= probaDeath) {
            squad.status = "dead";
            squad.missionResult.resume.push(pickRandom([
                "Nous avons perdu le contact avec l'escouade. Aucune idée de ce qu'ils sont devenus",
                "Cette secte a lavé le cerveau de la moitié de l'équipe. Les autres ont été abattus par leur gourou.",
                "Un groupe armé local a tendu une embuscade à l'escouade. Il n'y a aucun survivant."
            ]))
        } else {
            squad.status = "missionFail";
            squad.missionResult.resume.push(pickRandom([
                "Une bande armée nous est tombée dessus. On a rien pu faire pour garder le stock",
                "Les gens sont fous. Dès qu'ils ont vu notre stock, ils se sont rués sur nous. On a du fuir avant qu'il y ait des morts.",
                "L'endroit était occupé par trop de forces hostiles, impossible de s'en rapprocher."
            ]))
        }
    }
}

export const missionResume = (squad) => {
    delete squad.mission;

    switch (squad.status) {
        case "missionSuccess":
            playSound("MissionComplete")
            getRessources(squad.missionResult.ressources);
            squad.level += squad.missionResult.levelGain;
            if (squad.missionResult.squad) {
                state.ressourcesConsumptionPerDay.food += 1;
                state.ressourcesConsumptionPerDay.water += 1;
                state.squads.push({
                    level: squad.missionResult.squad,
                    status: "idle"
                })
            }
            if (squad.missionResult.scientific) {
                state.ressourcesConsumptionPerDay.food += 1;
                state.ressourcesConsumptionPerDay.water += 1;
                state.scientifics.push({
                    level: squad.missionResult.scientific,
                    status: "idle"
                })
            }
            squad.status = "idle";
            break;
        case "missionFail":
            playSound("MissionAborted")
            squad.level = Math.max(1, squad.level - randomBetween(1, 2));
            squad.status = "idle";
            break;
        case "dead":
            playSound("MissionFailed")
            removeFromArray(state.squads, squad)
            state.ressourcesConsumptionPerDay.food -= 1;
            state.ressourcesConsumptionPerDay.water -= 1;
            break;
    }

    delete squad.missionResult
}

export const calcRequiredRessources = (mission) => {
    if (!mission) return {};
    return {
        fuel: Math.ceil(mission.distance * state.ressourcesConsumptionFactor.fuel)
    }
}

export const calcRessourcesObtained = (ressources, duree, probaSucces) => {
    if (!ressources) return {};
    let obtained = Object.assign({}, ressources);
    let facteurPerseverance = (duree - 1) * 0.25;
    let facteurPrevoyance = probaSucces * 0.25;
    let facteurChance = (1 - probaSucces);
    let factor = 1 + facteurPerseverance + facteurPrevoyance;
    Object.keys(obtained).forEach(res => {
        let gainRessource = ressources[res] * factor * randomBetween(1 - facteurChance, 1 + facteurChance, false)
        obtained[res] = Math.max(0, Math.round(gainRessource))
    })
    return obtained
}

export const missions = [
    {
        name: "Résidences abandonnées",
        description: "Siphonnez les véhicules et prenez tous les vivres que vous trouvez dans ces maisons abandonnées juste à côté.",
        level: 1,
        distance: 0,
        ressources: {
            food: 3,
            water: 3,
            fuel: 4
        }
    },
    {
        name: "Décharge",
        description: "Il doit y avoir un peu de métal et quelques composants utiles à récupérer dans cette décharge.",
        level: 2,
        distance: 2,
        ressources: {
            metal: 10,
            component: 5,
            battery: 1
        }
    },
    {
        name: "Zone industrielle",
        description: "On devrait trouver du matériel électrique dans ces usines.",
        level: 3,
        distance: 4,
        ressources: {
            metal: 7,
            component: 8,
            battery: 3,
        }
    },
    {
        name: "Centre commercial",
        description: "En espérant que ces magasins n'aient pas tous été complètement pillés...",
        level: 5,
        distance: 4,
        ressources: {
            food: 4,
            water: 8,
            fuel: 8
        }
    },
    {
        name: "Prison",
        description: "Il nous faut plus d'hommes. Des prisonniers seraient prêts à tout si on leur promet une voie de sortie à ce merdier.",
        level: 8,
        distance: 6,
        ressources: {},
        squad: 4
    },
    {
        name: "Université",
        description: "L'université est assez loin d'ici, mais c'est notre meilleure chance de recruter des cerveaux.",
        level: 10,
        distance: 8,
        ressources: {},
        scientific: 6
    },
    {
        name: "Camp militaire",
        description: "Même l'armée est en déroute après l'échec de Hammond. Il doit rester quelques hommes qui lui sont fidèles, si on arrive à les trouver.",
        level: 12,
        distance: 7,
        ressources: {
            fuel: 5
        },
        squad: 8
    },
    {
        name: "Centrale nucléaire",
        description: "Avec les fuites radioactives, c'est probablement un voyage en aller simple. Mais il nous faut absolument ce plutonium !",
        level: 15,
        distance: 10,
        ressources: {
            plutonium: 3
        },
        scientific: 10
    }
]