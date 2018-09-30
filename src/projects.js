import { state } from "@/game";
import { playSound } from "@/audio"
import { removeFromArray } from "@/utils"

export const startProject = (scientific, project) => {
    scientific.project = project;
    scientific.status = "project";
    let duree = project.duree * state.researchTimeFactor * 1000
    scientific.projectDuree = duree
    scientific.projectEndTime = Date.now() + duree
    if (!project.infinite && !state.projectsStarted.includes(project.name)) {
        state.projectsStarted.push(project.name);
    }
    playSound("MissionStarted")
}

export const projectResume = (scientific) => {
    playSound("MissionComplete")
    for (let gain of scientific.project.gains) {
        gain.effect(state, scientific)
    }
    if (!scientific.project.infinite && !state.projectsFinished.includes(scientific.project.name)) {
        state.projectsFinished.push(scientific.project.name);
    }

    scientific.status = "idle";
    scientific.level += 1;
    delete scientific.project;
    delete scientific.projectEndTime;
    delete scientific.projectDuree;
}

export const calcRequiredRessources = (project) => {
    if (!project) return {};
    const requiredRessources = {};
    for (let res in project.ressources) {
        requiredRessources[res] = Math.ceil(project.ressources[res] * state.ressourcesConsumptionFactor[res]);
    }
    return requiredRessources;
}

export const projects = [
    {
        name: "Nouvelle cafetière",
        description: "Les scientifiques ont besoin de café pour bosser plus vite",
        level: 1,
        duree: 10,
        gains: [
            {
                description: "-5% à la durée des projets de recherche",
                effect: (state) => { state.researchTimeFactor -= 0.05 }
            },
            {
                description: "+1 niveau pour tous les scientifiques",
                effect: (state) => { state.scientifics.forEach(scientific => { scientific.level += 1 }) }
            }
        ],
        ressources: {
            metal: 5,
            component: 2,
            water: 5
        }
    },
    {
        name: "Vélos énergétiques",
        description: "Ces vélos couplés à une dynamo produisent de l'énergie pour recharger les batteries usagées, tout en faisant un peu de sport à ces mollusques de scientifiques.",
        level: 1,
        duree: 20,
        gains: [
            {
                description: "+2 unités d'eau consommée par jour",
                effect: (state) => { state.ressourcesConsumptionPerDay.water += 2 }
            },
            {
                description: "+ 1 batterie produite par jour",
                effect: (state) => { state.ressourcesProductionPerDay.battery += 1 }
            }
        ],
        ressources: {
            metal: 5,
            component: 2,
            battery: 4
        }
    },
    {
        name: "Toilettes à dépression",
        description: "Ces toilettes utilisent le vide comme énergie pour aspirer les excréments afin de faire des économies en eau, ce qui sera vital dans l'espace.",
        level: 2,
        duree: 25,
        gains: [
            {
                description: "-1 unité d'eau consommée par jour",
                effect: (state) => { state.ressourcesConsumptionPerDay.water -= 1 }
            }
        ],
        ressources: {
            metal: 8,
            component: 3
        }
    },
    {
        name: "Imprimantes 3D",
        description: "L'acquisition d'imprimantes 3D permet de réduire le nombre de composants requis et d'augmenter l'autonomie de la mission Odyssée.",
        level: 2,
        duree: 30,
        gains: [
            {
                description: "-20% de composants requis pour les recherches",
                effect: (state) => { state.ressourcesConsumptionFactor.component -= 0.2 }
            }
        ],
        ressources: {
            metal: 5,
            battery: 3,
            component: 8
        }
    },
    {
        name: "Kebab lyophilisé",
        description: "La découverte d'une nouvelle formule pour la sauce blanche permet de compacter et réduire la quantité de nourriture consommée par le personnel",
        level: 3,
        duree: 30,
        gains: [
            {
                description: "+5% chances de succès de la mission Odyssee",
                effect: (state) => { state.missionChanceSucces += 5 }
            },
            {
                description: "-20% consommation en nourriture du personnel",
                effect: (state) => { state.ressourcesConsumptionFactor.food -= 0.2 }
            }
        ],
        ressources: {
            food: 10,
            water: 5,
            component: 2
        }
    },
    {
        name: "Scanner",
        description: "L'ajout d'un scanner permet de détecter les objets spatiaux potentiellement dangereux et de cartographier les environs de la base.",
        level: 3,
        duree: 45,
        gains: [
            {
                description: "+5% chances de succès de la mission Odyssee",
                effect: (state) => { state.missionChanceSucces += 5 }
            },
            {
                description: "Détecte les ressources récupérables dans les régions autour de la base.",
                effect: () => { }
            }
        ],
        ressources: {
            metal: 15,
            component: 10,
            battery: 5
        }
    },
    {
        name: "Laboratoire embarqué",
        description: "Intègre un laboratoire au vaisseau, avec plus de matériel à disposition des équipes scientifiques",
        level: 4,
        duree: 60,
        gains: [
            {
                description: "+5% chances de succès de la mission Odyssée",
                effect: (state) => { state.missionChanceSucces += 5 }
            },
            {
                description: "-10% à la durée des projets de recherche",
                effect: (state) => { state.researchTimeFactor -= 0.1 }
            }
        ],
        ressources: {
            water: 15,
            metal: 15,
            component: 12,
            battery: 5
        }
    },
    {
        name: "Recycleur d'urine",
        description: "Boire sa pisse n'est pas très apprécié par le personnel, mais permet de grosses économies d'eau",
        level: 5,
        duree: 60,
        gains: [
            {
                description: "-50% consommation en eau du personnel",
                effect: (state) => { state.ressourcesConsumptionFactor.water -= 0.5 }
            }
        ],
        ressources: {
            metal: 10,
            battery: 3,
            component: 5,
            water: 10
        }
    },
    {
        name: "Biocarburant",
        description: "Si on ne trouve plus de carburant, synthétisons-le nous même ! Dommage que les plantes ne produisent pas de plutonium également...",
        level: 5,
        duree: 75,
        gains: [
            {
                description: "-5 unités d'eau et +3 unités de carburant par jour",
                effect: (state) => {
                    state.ressourcesConsumptionPerDay.water += 5
                    state.ressourcesProductionPerDay.fuel += 3
                }
            }
        ],
        ressources: {
            metal: 10,
            component: 5,
            battery: 1,
            water: 10
        }
    },
    {
        name: "Moteur turbo v12",
        description: "Ce moteur peut à la fois servir aux propulseurs latéraux du vaisseau et au tuning des jeeps des escouades",
        level: 6,
        duree: 75,
        gains: [
            {
                description: "+20% consommation en essence par les escouades",
                effect: (state) => { state.ressourcesConsumptionFactor.fuel += 0.2 }
            },
            {
                description: "-20% durée de voyage pour les missions",
                effect: (state) => { state.missionTimeFactor -= 0.2 }
            }
        ],
        ressources: {
            metal: 15,
            battery: 2,
            component: 8,
            fuel: 20
        }
    },
    {
        name: "Panneaux solaires",
        description: "Permet l'autonomie énergétique du vaisseau Odyssée, et pourrait aussi servir si le réseau électrique venait à tomber ici sur Terre.",
        level: 7,
        duree: 90,
        gains: [
            {
                description: "Energie de secours inépuisable",
                effect: (state) => { state.isImmuneToEnergyFailure = true }
            },
            {
                description: "+10% chances de succès de la mission Odyssée",
                effect: (state) => { state.missionChanceSucces += 10 }
            }
        ],
        ressources: {
            metal: 20,
            component: 10,
            battery: 10
        }
    },
    {
        name: "Supercalculateur",
        description: "Cet ordinateur pèse une tonne, mais devrait accélerer considérablement le temps que prennent nos recherches",
        level: 8,
        duree: 100,
        gains: [
            {
                description: "-20% durée des projets de recherche",
                effect: (state) => { state.researchTimeFactor -= 0.2 }
            },
            {
                description: "Calcule la probabilité de succès avant de lancer une mission",
                effect: () => { }
            }
        ],
        ressources: {
            metal: 30,
            battery: 8,
            component: 20
        }
    },
    {
        name: "Caissons de survie",
        description: "Ces caissons ralentissent les fonctions corporelles de leur hôte, ce qui réduit leurs besoins en nourriture et eau.",
        level: 8,
        duree: 90,
        gains: [
            {
                description: "-2 unités d'eau et de nourriture par jour",
                effect: (state) => {
                    state.ressourcesConsumptionPerDay.food -= 2;
                    state.ressourcesConsumptionPerDay.water -= 2;
                }
            },
            {
                description: "+10% chances de succès de la mission Odyssée",
                effect: (state) => { state.missionChanceSucces += 10 }
            }
        ],
        ressources: {
            metal: 25,
            battery: 8,
            component: 10
        }
    },
    {
        name: "Serre hydroponique",
        description: "Cela mettra du temps, mais devrait nous permettre l'autonomie alimentaire sur Terre comme sur Odyssée.",
        level: 9,
        duree: 120,
        gains: [
            {
                description: "+3 unités de nourriture par jour",
                effect: (state) => {
                    state.ressourcesProductionPerDay.food += 3
                }
            },
            {
                description: "+10% chances de succès de la mission Odyssée",
                effect: (state) => { state.missionChanceSucces += 10 }
            }
        ],
        ressources: {
            metal: 20,
            battery: 3,
            component: 15
        }
    },
    {
        name: "Réacteur nucléaire",
        description: "Element indispensable du vaisseau Odyssée, il fonctionne au plutonium raffiné.",
        level: 10,
        duree: 60,
        gains: [
            {
                description: "Nécessaire pour faire décoller le vaisseau Odyssée",
                effect: () => { }
            }
        ],
        ressources: {
            metal: 25,
            component: 25,
            plutonium: 5
        }
    },
    {
        name: "Planéharium",
        description: "Une banque de données sur la Terre couplée à un projecteur en réalité virtuelle, pour entretenir le souvenir pour les générations futures.",
        level: 11,
        duree: 110,
        gains: [
            {
                description: "+10% chances de succès de la mission Odyssée",
                effect: (state) => { state.missionChanceSucces += 10 }
            }
        ],
        ressources: {
            metal: 25,
            component: 25,
            battery: 10
        }
    },
    {
        name: "Coque anti-radiations",
        description: "Protège contre les radiations interstellaires, ce qui augmente les chances de succès de la mission Odyssée.",
        level: 12,
        duree: 120,
        gains: [
            {
                description: "+10% chances de succès de la mission Odyssée",
                effect: (state) => { state.missionChanceSucces += 10 }
            }
        ],
        ressources: {
            metal: 40,
            component: 40,
            battery: 5
        }
    },
    {
        name: "Hélicos à réaction",
        description: "Pas de temps à perdre ! Ces hélicos à rotor propulsé par un mini réacteur nucléaire accéléreront considérablement les déplacements des escouades.",
        level: 13,
        duree: 100,
        gains: [
            {
                description: "-50% durée de voyage pour les missions",
                effect: (state) => { state.missionTimeFactor -= 0.5 }
            }
        ],
        ressources: {
            metal: 40,
            component: 20,
            plutonium: 5
        }
    },
    {
        name: "Intelligence artificielle",
        description: "Elle prend vite la grosse tête, mais sait gérer l'intégralité du vaisseau mieux que quiconque.",
        level: 14,
        duree: 120,
        gains: [
            {
                description: "+10% chances de succès de la mission Odyssée",
                effect: (state) => { state.missionChanceSucces += 10 }
            },
            {
                description: "+3 niveaux pour tous les scientifiques",
                effect: (state) => { state.scientifics.forEach(scientific => { scientific.level += 3 }) }
            }
        ],
        ressources: {
            metal: 15,
            component: 25,
            battery: 20
        }
    },
    {
        name: "Armes nucléaires tactiques",
        description: "Quelques scientifiques ne sont pas convaincus que l'Odyssée doit disposer d'un armement lourd, mais ces armes pourraient aussi être utilisées en dernier recours par les escouades.",
        level: 16,
        duree: 130,
        gains: [
            {
                description: "+10% chances de succès de la mission Odyssée",
                effect: (state) => { state.missionChanceSucces += 10 }
            },
            {
                description: "+3 niveaux pour toutes les escouades",
                effect: (state) => { state.squads.forEach(squad => { squad.level += 3 }) }
            }
        ],
        ressources: {
            metal: 25,
            component: 25,
            plutonium: 5
        }
    },
    {
        name: "Formation scientifique",
        description: "Cours de rattrapage pour mettre à niveau les équipes scientifiques en retard",
        level: 1,
        duree: 120,
        ressources: {},
        gains: [{
            description: "+2 niveaux pour l'équipe scientifique",
            effect: (state, scientific) => {
                scientific.level += 1; // +2 en comptant le +1 par projet terminé
            }
        }],
        infinite: true
    },
    {
        name: "Mobilisation",
        description: "Vous êtes sûrs qu'il n'y a personne d'autre pour aller sur le terrain ?",
        level: 1,
        duree: 5,
        ressources: {},
        gains: [{
            description: "Réforme l'équipe scientifique en escouade de niveau 1",
            effect: (state, scientific) => {
                removeFromArray(state.scientifics, scientific)
                state.squads.push({ level: 1, status: "idle" })
            }
        }],
        infinite: true
    },
]