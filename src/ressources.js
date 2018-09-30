import { state } from "@/game"

export const hasRessources = ressources => {
    return Object.entries(ressources).every(([res, nb]) => state.ressources[res] >= nb)
}

export const takeRessources = ressources => {
    Object.entries(ressources).forEach(([res, nb]) => {
        state.ressources[res] -= nb;
    })
}

export const getRessources = ressources => {
    Object.entries(ressources).forEach(([res, nb]) => {
        state.ressources[res] += nb;
    })
}

export const ressources = {
    water: {
        name: "Eau",
        description: "consommée par les équipes ou utilisée en laboratoire"
    },
    food: {
        name: "Nourriture",
        description: "il faut bien nourrir tous les gens de cette base"
    },
    fuel: {
        name: "Carburant",
        description: "nécessaire au déplacement des escouades"
    },
    metal: {
        name: "Métaux",
        description: "matière première composant de nombreux objets"
    },
    battery: {
        name: "Batteries",
        description: "alimentation de nombreux appareils et énergie de secours"
    },
    component: {
        name: "Composants",
        description: "sert à la fabrication d'appareils plus ou moins complexes"
    },
    plutonium: {
        name: "Plutonium",
        description: "carburant principal des réacteurs"
    }
}