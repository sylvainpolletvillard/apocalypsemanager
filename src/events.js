import { playSound, playMusic, stopMusic } from "@/audio";
import { randomBetween } from "@/utils";
import { state, reserve, newMessage } from "@/game";

export const epochs = [
    {
        music: "1",
        message: {
            title: "Au rapport",
            text: `Bienvenue à la base, commandant. Nous avons assez de nourriture et d'eau pour quelques jours, et nous ne pourrons pas compter sur du ravitaillement. Je recommande donc d'envoyer des escouades en reconnaissance dans les quartiers résidentiels aux alentours. L'équipe scientifique me signale aussi qu'ils auront besoin de métaux et de composants pour leurs recherches. On doit pouvoir trouver ça à la décharge pas loin de la base. Le personnel attend vos ordres.`
        }
    },
    {
        music: "2",
        message: {
            title: "Message prioritaire",
            text: "Ici le général Hammond. La situation est grave. Skyfire, notre plan de contremesure nucléaire face à l'astéroïde, ne peut pas être mis à exécution. Les missiles n'ont pas la vitesse et les capacités techniques nécessaires pour atteindre la météorite suffisamment loin de la Terre pour éviter le drame. La population l'ignore encore, et pourvu que ça dure. Skyfire est le dernier espoir de tous ces gens, et c'est la seule chose qui maintient le peu d'ordre qui reste dans nos rues. Cela signifie donc que la mission Odyssée est le dernier espoir pour l'humanité. Vous n'avez pas le droit à l'échec. Vous êtes notre dernière chance."
        }
    },
    {
        music: "3",
        message: {
            title: "Flash info spécial",
            text: "Une source interne au gouvernement vient de nous informer que Skyfire, le plan pour détourner la météorite, ne fonctionnera pas. Le président refuse de répondre à nos questions et a été déplacé dans un endroit inconnu du public. Alors que les gens s'affolent et que les incidents se multiplient, certains refusent d'y croire, prétendant un complot ou une fake news comme en 2012."
        }
    },
    {
        music: "4",
        message: {
            title: "La météorite visible du ciel",
            text: "Il n'y a désormais plus aucun doute possible alors que la météorite est désormais visible avec un téléscope classique. Les astronomes disent qu'elle sera visible à l'oeil nu d'ici quelques jours. Les émeutes sont de plus en plus violentes, des groupes armés et des sectes mettent à sacs la plupart des grandes villes. Les forces de police et l'armée semblent complètement dépassées, alors que le gouvernement multiplie les appels au calme."
        }
    },
    {
        music: "5",
        message: {
            title: "Que Dieu nous vienne en aide",
            text: "C'est la phrase prononcée en toutes les langues par les dirigeants du monde entier. Toutes les solutions envisagées ont échoué. Des rumeurs tournent autour d'un vaisseau spatial refuge mais elles ne semblent pas crédibles. La société est à l'arrêt et on reporte de graves défaillances, notamment la centrale nucléaire qui émettrait d'importantes fumées radioactives. Mais plus personne n'y prête attention désormais. Ceci est notre dernière transmission, nous allons rejoindre nos familles. Adieu et bonne chance."
        }
    }
]

export const loadEpoch = () => {
    if (state.currentEpoch > epochs.length) return;

    let epoch = epochs[state.currentEpoch - 1]
    if (epoch.music) {
        stopMusic();
        playMusic(epoch.music, true, 6000)
    }
    if (epoch.message) {
        newMessage(epoch.message)
    }
}

export const defeatPart = {
    onStart() {
        stopMusic();
        playSound("YouLose");
    },
    lines: [
        `C'est fini... le dernier espoir de l'humanité s'est éteint.`,
        `Peut-être que si vous aviez fait d'autres choix, il en serait autrement...`
    ],
    actions: [{ text: "Game Over", link: "end" }]
};

export const victoryPart = {
    onStart() {
        stopMusic();
        playSound("YouWin");
        state.victory = true;
    },
    lines: [
        `La mission Odyssée est un succès !`,
        `La Terre n'est plus, mais l'humanité a encore de l'espoir grâce à vous.`
    ],
    actions: [{ text: "Félicitations !", link: "end" }]
};

export const tooLateDialog = {
    start: "toolate",
    parts: {
        toolate: {
            lines: [`Le vaisseau Odyssée n'a pas pu décoller à temps...`],
            chainWith: "defeat"
        },
        defeat: defeatPart
    }
};

export const hungryDialog = {
    start: "hungry",
    parts: {
        hungry: {
            lines: [
                `Face à la faim et la soif, vos équipes ont déserté la base les unes après les autres.`
            ],
            chainWith: "defeat"
        },
        defeat: defeatPart
    }
};

export const decollagePart = {
    onStart: () => {
        document.getElementById("gameover").className = "earthexploded";
        playMusic("1", true, 14000)
    },
    lines: [
        `L'équipage regarde avec effroi la météorite percuter la Terre. Le choc est d'une violence inouïe et secoue la carlingue pendant plusieurs minutes. Nul doute qu'il faudra des siècles pour que la planète se remette d'un tel cataclysme. Autour de vous, certains pleurent, d'autres se tiennent la tête dans les mains, d'autres encore ont le regard perdu dans le vide.`,
        `Le plan initial prévoit de se mettre en orbite autour de Cérès, planète naine de la ceinture d'astéroïdes riche en minerais et en eau. Mais il paraît de mauvais goût de se diriger vers un astéroïde après ce qui vient de se passer...`,
        `Quelle est votre première décision en tant que commandant ?`
    ],
    actions: [
        {
            text: "Mettre cap sur Cérès",
            link: "ceres"
        },
        {
            text: "Porter un toast aux victimes",
            link: "toast"
        },
        {
            text: "Laisser l'équipage se remettre du choc",
            link: "repos"
        }
    ]
}

export const getCeresPart = () => {

    let part = {};

    switch (randomBetween(1, 2)) {
        case 1:
            // 5 % reserve plutonium
            if (state.ressources.plutonium >= reserve.plutonium) {
                return {
                    lines: [
                        "Nous avons assez de plutonium à bord pour atteindre Cérès et récupérer les ressources dont nous avons besoin pour notre développement.",
                        "Le voyage prendra environ quatre ans."
                    ],
                    actions: [{
                        link: "phase2",
                        text: "En route !"
                    }]
                }
            }

            state.stockChance -= 30;

            part.lines = [
                "Nous n'avons pas emporté assez de plutonium pour atteindre Cérès, et aucune autre source d'eau facilement accessible n'est connue du système.",
                "Même en économisant et recyclant, notre stock finira par s'épuiser un jour."
            ]

            if (state.stockChance >= 0) {
                part.lines.push(`Heureusement, un ingénieur a eu une idée aussi géniale que complètement folle: se servir de la gravité de l'astéroïde comme rampe d'accélération et du blast de l'impact pour nous propulser vers notre destination et économiser du précieux carburant. ´Ça va pas mal secouer mais l'Odyssée filera à pleine vitesse vers Cérès.`)
                part.actions = [{
                    link: "phase2",
                    text: "Sauvés !"
                }]
            } else {
                part.lines.push("Une mort lente nous attend...")
                part.chainWith = "defeat"
            }

            return part

        case 2:
            // 5% labo embarqué

            part.lines = [
                "Après environ quatre ans de voyage, nous sommes finalement arrivés sur Cérès et avons préparé le premier site d'extraction.",
                "Les minerais et la glace de Cérès seront ce avec quoi nous construirons notre futur."
            ]

            if (state.projectsFinished.includes("Laboratoire embarqué")) {
                part.lines.push("Nous avons pu extraire des minerais et utiliser le laboratoire de l'Odyssée pour les raffiner. Nous avons maintenant de quoi faire nos réparations secondaires, voire même quelques extensions.")
                part.actions = [
                    {
                        link: "phase2",
                        text: "Au travail !"
                    }
                ];
                return part;
            }

            state.stockChance -= 30;

            if (state.stockChance >= 0) {
                part.lines.push(
                    `Malheureusement, sans laboratoire à bord, nous ne pouvons rien faire des minéraux extraits de Cérès. Or après plusieurs années de voyage, il nous faut des métaux pour effectuer les réparations qui s'imposent.`,
                    `En attendant qu'un laboratoire soit construit, nous pouvons démonter le mobilier pour obtenir les ressources dont nous avons besoin. Ce sera très inconfortable, mais on devrait tenir le coup.`
                )
                part.actions = [{
                    link: "phase2",
                    text: "Démontez tout ce qui n'est pas essentiel."
                }]
            } else {
                part.lines.push(
                    `Il y a un problème. Nous avons fait fondre le premier stock de glace de Cérès et intégré l'eau au système, mais tout le personnel est tombé malade.`,
                    `Nous n'avons pas de laboratoire pour analyser l'eau ni pour synthétiser des médicaments. Il y a déjà trois morts, et tout le personnel est contaminé.`,
                    `Est-ce la fin ? La fièvre m'empêche de réfléchir...`
                )
                part.chainWith = "defeat"
            }

            return part
    }
}


export const getToastPart = () => {

    let part = {};

    switch (randomBetween(1, 2)) {
        case 1:

            //  5% reserve bouffe
            if (state.ressources.food >= reserve.food) {
                return {
                    lines: [
                        "Nos réserves de nourriture vont nous permettre de survivre assez longtemps.",
                        "Nous avons même de quoi organiser quelques bons petits gueuletons. C'est l'une des rares choses qui remonte le moral des équipes.",
                        "Le médecin de bord s'avère être un excellent cuisinier, et veut vous faire goûter sa nouvelle recette de cake de l'espace."
                    ],
                    actions: [{
                        link: "phase2",
                        text: "Avec plaisir !"
                    }]
                }
            }

            state.stockChance -= 30;

            part.lines = [
                "Nous n'avons pas assez emporté de nourriture, et nos stocks diminuent à vitesse inquiétante. Nous devions déjà nous rationner dans les derniers jours sur Terre, et la plupart de l'équipage est maigre à faire peur."
            ]


            if (state.stockChance >= 0) {
                part.lines.push(
                    `Heureusement, le maïs génétiquement modifié emporté par le biologiste a poussé en quelques semaines à peine !`,
                    `Cela devrait nous permettre de tenir le coup en attendant les premières récoltes made-in space.`
                )
                part.actions = [{
                    link: "phase2",
                    text: "Qui veut du pop-corn ?"
                }]
            } else {
                part.lines.push(
                    `Pour couronner le tout, des souris se sont incrustées à bord et ont grignoté discrètement nos stocks. Nous les avons mangés, mais ça ne fait qu'un repas d'un soir.`,
                    `Qu'allons nous faire maintenant ?`)
                part.chainWith = "defeat"
            }

            return part

        case 2:
            // 5% kebab lyophilisé

            if (state.projectsFinished.includes("Kebab lyophilisé")) {
                part.lines = [
                    "La nourriture lyophilisée est une idée de génie. On manque d'espace dans le vaisseau, et le ratio valeur nutritive / mètre cube est imbatable pour le kebab lyophilisé.",
                    "Même si à la longue, on aimerait bien manger autre chose. D'ici quelques mois, on aura de bonnes patates de l'espace si tout va bien."
                ]
                part.actions = [
                    {
                        link: "phase2",
                        text: "Encore du kebab !?"
                    }
                ];
                return part;
            }

            state.stockChance -= 30;

            part.lines = [`Il y a eu plusieurs jours où nous avons souffert de la faim. J'aurais aimé que les scientifiques finissent leur recette de kebab. Qu'est-ce que je donnerais pour un bon kebab...`]

            if (state.stockChance >= 0) {
                part.lines.push(`On devra se contenter des barres protéinées pour le moment. C'est nutritif, non périssable et ça ne prend pas beaucoup de place, dit le biologiste. S'il avait emporté autre chose, on serait déjà morts de faim.`)
                part.actions = [{
                    link: "phase2",
                    text: "Il a sûrement raison..."
                }]
            } else {
                part.lines.push(`Saletés ! Des insectes ont envahi notre stock de nourriture, attiré par l'odeur. Une bonne partie n'est plus consommable maintenant. Je savais qu'on aurait dû prendre de la bouffe lyophilisée sous vide !`,
                    `Les mécanos ont agressé le biologiste ce matin, l'accusant à cause des larves qu'il garde au frigo pour son projet de préservation des espèces. L'équipage est à cran et devient agressif à cause de la faim. Je crains que ça dégénère rapidement...`)
                part.chainWith = "defeat"
            }

            return part
    }
}


export const getReposPart = () => {

    let part = {};

    switch (randomBetween(1, 2)) {
        case 1:
            part.lines = [
                "Alors que l'équipage se reposait, un incendie s'est déclaré dans la salle des machines ! Le blast de la météorité a dû causer un court-circuit."
            ]


            if (state.ressources.water >= reserve.water) {
                part.lines.push(`Nous avons emporté assez d'eau pour contenir l'incendie. Quelques modules secondaires sont foutus mais on a limité la perte d'oxygène et les dégâts du feu.`)
                part.actions = [{
                    link: "phase2",
                    text: "Bien joué !"
                }]
                return part
            }

            state.stockChance -= 30;

            part.lines.push(`On a dû utiliser le peu de notre stock d'eau qui nous restait pour contenir les flammes.`)

            if (state.stockChance >= 0) {
                part.lines.push(`Mais un ingénieur a trouvé une solution pour recycler la vapeur d'eau résiduelle par hydrolyse. Nous allons pouvoir tenir de justesse...`)
                part.actions = [{
                    link: "phase2",
                    text: "Cap sur Cérès, il nous faut de l'eau !"
                }]
            } else {
                part.lines.push("L'incendie est éteint, mais nous allons mourrir de soif d'ici quelques jours...")
                part.chainWith = "defeat"
            }

            return part

        case 2:
            // 5% scanner

            part.lines = [
                "Il semble que la météorite avait quelques petits copains dans son sillage."
            ]

            if (state.projectsFinished.includes("Scanner")) {
                part.lines.push("Le scanner les a détecté assez vite pour qu'on puisse adapter notre trajectoire.")
                part.actions = [
                    {
                        link: "phase2",
                        text: "Ne restons pas ici."
                    }
                ];
                return part;
            }

            state.stockChance -= 30;

            if (state.stockChance >= 0) {
                part.lines.push(`Sans scanner, nous les avons détecté au dernier moment. Le pilote de garde les a évité au dernier moment, ça ne s'est joué à rien.`)
                part.actions = [{
                    link: "phase2",
                    text: "Ce pilote nous a tous sauvés !"
                }]
            } else {
                part.lines.push(`Sans scanner, nous ne les avons pas vus arriver. Un astéroïde a heurté la coque. Il y a une brèche et nous perdons notre air à une vitesse alarmante.`,
                    `Finalement, les météorites auront eu notre peau...`)
                part.chainWith = "defeat"
            }

            return part
    }
}

export const getPhase2Part = () => {
    let part = {
        onStart() {
            document.getElementById("gameover").className = "ceres";
        },
        lines: [
            "Un an plus tard..."
        ]
    };

    switch (randomBetween(1, 3)) {
        case 1:
            // 10% serre
            if (state.projectsFinished.includes("Serre hydroponique")) {
                part.lines.push(`La serre hydroponique tient ses promesses. On a de belles tomates, des patates, et même des fraises de l'espace !`)
                part.actions = [{
                    link: "phase3",
                    text: "Tout ça pour des fraises !"
                }]
                return part
            }

            state.stockChance -= 30;

            part.lines.push(`On y est, le moment fatidique où les dernières réserves de nourriture sont épuisées. On a des graines mais pas de serre pour les faire pousser !`)

            if (state.stockChance >= 0) {
                part.lines.push(`Le biologiste a eu la présence d'esprit d'emmener un peu de notre bonne vieille terre pour planter les graines.`,
                    `Un potager improvisé a été aménagé dans la salle des machines près du réacteur, là où il fait le plus chaud.`)
                part.actions = [{
                    link: "phase3",
                    text: "Toujours les pieds sur terre !"
                }]
            } else {
                part.lines.push(`Les plants de patates que le doc a voulu faire pousser dans les WC ont tous crevés.`, `Ce sera bientôt notre tour...`)
                part.chainWith = "defeat"
            }

            return part

        case 2:
            // 10% panneaux solaires
            if (state.projectsFinished.includes("Panneaux solaires")) {
                part.lines.push(`Nos batteries à plat, les panneaux solaires ont pris le relais. On a assez d'énergie pour alimenter tout le vaisseau et faire fonctionner la propulsion secondaire.`)
                part.actions = [{
                    link: "phase3",
                    text: "Fini les repas dans le noir !"
                }]
                return part
            }

            state.stockChance -= 30;

            part.lines.push(`On a plus de carburant et nos batteries sont quasiment à plat.`)

            if (state.stockChance >= 0) {
                part.lines.push(`Mais la fille du labo a plus d'un tour dans son sac. Ele a bricolé des ailes solaires à greffer au vaisseau, qui devraient nous fournir assez d'électricité pour maintenir les systèmes principaux.`)
                part.actions = [{
                    link: "phase3",
                    text: "Sauvés ! Restons économes, chauffage minimum."
                }]
            } else {
                part.lines.push(`Avec quoi on est censés alimenter en énergie ce foutu vaisseau ? On a coupé le chauffage et la lumière pour retarder l'inévitable, mais à quoi bon ?`, `Il fait si froid...`)
                part.chainWith = "defeat"
            }

            return part

        case 3:
            // 10 % caissons survie
            part.lines = [
                `La propulsion secondaire fonctionne, mais le vaisseau avance très lentement. On bouffe trop d'oxygène et de biomasse, on ne tiendra pas la longueur à cette vitesse là.`
            ]

            if (state.projectsFinished.includes("Caissons de survie")) {
                part.lines.push(`Si on veut continuer les opérations à cette allure, il va falloir en mettre quelques-uns dans les caissons de survie.`)
                part.actions = [{
                    link: "phase3",
                    text: "Allez, au frigo !"
                }]
                return part
            }

            state.stockChance -= 30;

            if (state.stockChance >= 0) {
                part.lines.push(`Sans caisson de survie, on doit improviser: le médecin de bord peut plonger la moitié de l'équipage non critique en coma artificiel pour ralentir leurs fonctions vitales. C'est une décision difficile, mais aux grands maux, les grands remèdes.`)
                part.actions = [{
                    link: "phase3",
                    text: "On a pas le choix..."
                }]
            } else {
                part.lines.push(`Le climatisateur est défectueux et n'arrive pas à fournir assez d'oxygène à tout le monde. On a pas de caisson de survie pour temporiser en attendant les réparations.`,
                    `Les gens commencent à paniquer, ce qui a pour effet de bouffer encore plus de O2. Un mécanicien a suggéré d'euthanasier dix d'entre nous, en tirant à la courte paille.`,
                    `La situation dégénère complètement: deux groupes se battent tandis qu'une femme hyper-ventile, en proie à une crise d'angoisse.`,
                    `Que tout le monde se calme ! On doit économiser l'oxygène ! Arrêtez !`,
                    `Votre vision se trouble...`
                )
                part.chainWith = "defeat"
            }

            return part
    }

}

export const getPhase3Part = () => {
    let part = {
        lines: [
            "Cinquante ans plus tard..."
        ]
    };

    switch (randomBetween(1, 4)) {
        case 1:
            //10% coque antirad

            if (state.projectsFinished.includes("Coque anti-radiations")) {
                part.lines.push(
                    `Une éruption solaire a bien remué la coque anti-radiations hier. Mais celle-ci a encaissé le choc sans broncher.`,
                    `Mon père a construit cette coque alors qu'il était encore sur Terre. Il m'a souvent raconté comment il avait dû se battre pour récupérer les métaux et composants pour finir la coque, alors que le monde avait déjà sombré dans le chaos bien avant la chute de la météorite.`,
                    `Tu as fait du bon boulot, papa. J'espère que tu peux nous voir depuis les étoiles...`
                )
                part.chainWith = "victory";
                return part
            }

            state.stockChance -= 40;

            part.lines.push(`Au fil des années, le vent solaire a bousillé un à un tous nos capteurs externes.`)

            if (state.stockChance >= 0) {
                part.lines.push(
                    `On savait à quoi s'attendre sans coque antirad, et on s'est adaptés en conséquence.`,
                    `La navigation est assurée par l'ordinateur et par des trajectoires préprogrammées. Nous effectuons régulièrement des sorties dans l'espace en combinaison blindée pour prendre les mesures au compas et ajuster les erreurs de précision de l'ordinateur. La doyenne a dit que c'est aussi comme ça que se repéraient les premiers navigateurs de l'Histoire sur l'océan, en prenant leur compas et en regardant les étoiles.`,
                    `Je sais que je ne verrais jamais l'océan, juste une tâche bleue au fond d'un télescope et les glaciers de Cérès. Mais j'ai bon espoir que les petits enfants de mes petits enfants puissent le voir un jour...`
                )
                part.chainWith = "victory";
            } else {
                part.lines.push(
                    `Il n'y a rien que l'on puisse faire pour empêcher ça sans coque antirad. Alors on s'est fait à l'idée de voler en aveugle, même si le nouveau commandant prétend toujours savoir où il va.`,
                    `Mais il y a trois jours, cette saloperie de soleil nous a envoyé une vague de radiations assez forte pour bousiller les appareils électroniques à l'intérieur de la coque. Le système de survie est détraqué, les recycleurs d'eau ne fonctionnent plus, la température est étouffante et l'oxygène se raréfie. On est tous affairés à réparer mais il y a tellement à faire avec si peu de ressources...`,
                    `Cela fait trois jours que personne n'a dormi et que l'eau est rationnée. J'ai de plus en plus de mal à réfléchir. Je suis... si fatigué...`
                )
                part.chainWith = "defeat"
            }

            return part

        case 2:
            // 10% IA
            if (state.projectsFinished.includes("Intelligence artificielle")) {
                part.lines.push(
                    `Journal de bord. Hier, alors que la majorité de l'équipage dormait après avoir fini la récolte, une défaillance de la ventilation a bloqué l'arrivée de l'oxygène. Le personnel de garde a perdu connaissance avant d'avoir pu donner l'alerte. Sans l'intervention d'Amy, notre IA, on y serait tous restés.`,
                    `Les anciens avaient raison: il faut continuer à alimenter Amy en énergie. Depuis la mort du dernier informaticien, plus personne ne sait parler à Amy. Nous ne faisons que l'écouter et suivre ses consignes. Quelques jeunes prétendent qu'elle raconte des mensonges, qu'elle ne peut pas savoir comment va la Terre sans y être. Mais ce qui s'est passé hier est la preuve que Amy veille sur nous tous.`,
                    `Amy est la dernière à être née sur Terre, et un jour elle nous y réemmènera.`
                )
                part.chainWith = "victory";
                return part
            }

            state.stockChance -= 40;

            part.lines.push(
                `Le vieux doc n'arrêtait pas de le répéter: les jeunes sont trop grands. Nos bras et nos jambes sont plus longs, moins musclés et trappus que les anciens. Notre dos est courbé à cause des couloirs de l'Odyssée. Et nous en avons assez de perdre notre temps à la salle de musculation à pédaler devant l'espace.`,
                `C'est la quatrième fois qu'on baisse la vitesse de rotation pour réduire la gravité, et quel bonheur à chaque fois ! Les articulations sont soulagées, on dort mieux et on travaille plus efficacement. Nombreux sont ceux qui voudraient la réduire encore, mais quelques anciens ont posé leur véto. Ils disent qu'on ne pourra jamais revenir sur Terre si on ne sait pas marcher à 1G.`,
                `Mais on a payé très cher notre fainéantise...`,
            )

            if (state.stockChance >= 0) {
                part.lines.push(
                    `Avec le temps, l'électronique de l'Odyssée se détériore et toujours de façon imprévisible.`,
                    `Un problème inconnu a interverti deux bits dans le programme de contrôle des propulseurs latéraux, et multiplié notre vitesse de rotation par 1024. L'équipage s'est écroulé et a perdu connaissance sous la pression, sauf le vieux mécano. Il a eu l'estomac assez accroché et les bras assez forts pour ramper jusqu'aux commandes.`,
                    `Qui aurait cru que ce serait ce vieux bossu qui nous sauverait ? Plus aucun jeune ne se moquera de ses grosses épaules dorénavant.`,
                    `Il a été nommé à l'unanimité pour remplacer le commandant qui a eu la colonne brisée pendant l'incident. Son premier ordre a été d'instaurer un entraînement physique obligatoire pour tout l'équipage, et de rétablir la gravité à 1G par paliers de 1% par semaine. Ce sera dur, mais nécessaire.`
                )
                part.chainWith = "victory";
            } else {
                part.lines.push(
                    `Le nouvel ingénieur aux réacteurs a été négligent pendant la dernière opération d'étalonnage du réacteur. Il a commis une erreur qui a réglé notre vitesse de poussée à 4G. La dernière fois qu'on avait poussé les réacteurs à un tel niveau, c'était il y a cinquante ans lors du décollage de la Terre.`,
                    `Nous nous sommes tous retrouvés plaqués aux parois, incapables de bouger. Cela fait plusieurs minutes que l'accélération écrase mes poumons.`,
                    `Ma tête est bloquée sur le côté et je ne peux que regarder du coin de l'oeil la porte de l'atelier se plier tout doucement, avant de céder brutalement. Une foreuse et des cargaisons de minerais sont projetés avec violence contre la coque.`,
                    `Il y a une brèche ! L'air s'échappe dans un sifflement suraigu. Je dois intervenir mais je suis incapable de bouger, mon corps est en plomb...`,
                    `Alors que l'Odyssée file à toute allure vers le néant de l'espace, les dernières bulles d'air s'échappent de la carlingue...`
                )
                part.chainWith = "defeat"
            }

            return part

        case 3:
            // 10% armes
            part.lines.push(
                `Alors que notre télescope pointé vers la Tette effectuait des mesures de température et de réfraction atmosphérique, nous avons capté de drôles d'interférences. L'opérateur a triangulé la source des interférences. C'est là que nous l'avons vu...`,
                `Un vaisseau alien, ressemblant vaguement à un zeppelin, est en orbite géostationnaire autour de ce qui reste de notre Terre. S'agit-il de notre premier contact extraterrestre ? Ou du deuxième, si l'on considère les polycristaux intelligents découverts sur Cérès comme une forme de vie ?`,
                `Quoiqu'il en soit, nous décidons de nous approcher du vaisseau inconnu. Les interférences ont cessé dès notre changement de cap. Tout à coup, l'équipage est pris de violents maux de tête.`
            )

            if (state.projectsFinished.includes("Armes nucléaires tactiques")) {
                part.lines.push(
                    `Le commandant donne immédiatement ordre d'utiliser les ogives nucléaires tactiques pour détruire le vaisseau alien. L'explosion sature tous les capteurs et éblouit le cockpit pendant plusieurs secondes. Quand le visuel est rétabli, le vaisseau est toujours là, parfaitement intact ! L'instant d'après, il disparait en un éclair et les douleurs cessent immédiatement.`,
                    `Il semble que notre premier contact avec ces extraterrestres fut aussi court que douloureux. Je me demande si nous les reverrons un jour.`)
                part.chainWith = "victory";
                return part
            }

            state.stockChance -= 40;

            if (state.stockChance >= 0) {
                part.lines.push(
                    `Nous essayons de faire demi-tour mais l'ordinateur de bord ne répond plus. Pris de panique, un opérateur martèle tous les boutons de son tableau de commandes. Il déclenche sans le vouloir le laser de ciblage destiné aux télécommunications optiques spatiales. Les douleurs cessent alors soudainement. S'en suit un long silence, puis le vaisseau alien prend la fuite à une vitesse incommensurable.`,
                    `Il semble que notre premier contact avec ces extraterrestres fut aussi court que douloureux. Je me demande si nous les reverrons un jour.`
                )
                part.chainWith = "victory";
            } else {
                part.lines.push(
                    `L'intercom hurle pour nous indiquer une défaillance de l'étanchéité du vaisseau. La carlingue commence à grincer comme si on l'enserrait dans un étau.`,
                    `Sans armes pour nous défendre, nous essayons vainement de faire demi-tour mais les commandes ne répondent plus, et deux des opérateurs ont perdu connaissance.`,
                    `L'espace semble se comprimer autour de nous. Je commence à suffoquer...`
                )
                part.chainWith = "defeat"
            }

            return part

        case 4:

            part.lines.push(
                `Après plusieurs décennies dans l'espace, les anciens souffrent énormément sur le plan psychologique. Ils n'arrêtent pas de répéter que l'humain n'est pas fait pour vivre dans l'espace. Qu'il a besoin de sentir la terre sous ses pieds. La luminothérapie, la psychanalyse et les drogues de synthèse ont limité les dégâts, mais nous avons dû faire face à plusieurs suicides.`,
                `Nous les jeunes sommes bien plus stables mentalement. Peut-être parce que nous n'avons jamais marché sur Terre. Mais ça, les anciens ne l'acceptent pas. Ces vieux séniles ! J'ai entendu l'ancien commandant dire que nous étions peut être humains, mais pas des terriens. Que les premiers hommes disparaisseraient avec eux, enfants ou pas.`,
                `Face au mal de l'espace et aux crises de délire qui touchaient de plus en plus les anciens, nous avons dû prendre une grave décision. Au cinquantième anniversaire du décollage de l'Odyssée, nous avons décidé de prendre le commandement de l'Odyssée par la force.`
            )

            // 10% planéharium
            if (state.projectsFinished.includes("Planéharium")) {
                part.lines.push(
                    `Tous les anciens ont été relevés de leurs fonctions et déclarés à la retraite. Le planéharium nous a beaucoup appris sur le putsch et les révolutions de l'Histoire Terrienne. Notre révolution, elle, s'est faite sans trop de violence, principalement parce que nous savions bien mieux nos battre en apesanteur que les anciens.`,
                    `Les anciens pourront finir leurs jours au planéharium à contempler leur passé. Ceux qui le souhaitent pourront demander l'euthanasie. C'est aux jeunes de Cérès désormais que l'avenir appartient.`,
                    `Qu'allons-nous faire maintenant ? Pourquoi devrions-nous revenir sur Terre, ce puits de gravité en ruine dont nous ne connaissons rien, alors que nous avons tout l'espace pour nous ? C'est un nouveau chapitre qui s'écrit pour l'humanité...`)
                part.chainWith = "victory";
                return part
            }

            state.stockChance -= 40;

            part.lines.push(
                `Les anciens veulent résister. Ils se sont retranchés dans les quartiers du commandement et menacent d'ouvrir le sas si nous n'abandonnons pas la rébellion. Ces vieux fous vont tous nous tuer !`
            )

            if (state.stockChance >= 0) {
                part.lines.push(
                    `Je ne voulais pas en arriver à de telles extrémités, mais ils ne nous laissent pas le choix...`,
                    `Nous avons fait expulser le module de commandement dans l'espace, avec tous les anciens à bord. Les 23 derniers représentants des Terriens ont péri aujourd'hui. C'était la seule solution, ou nous risquions de tous y rester. Les Terriens étaient des étrangers ici. Ils n'étaient pas chez eux dans l'espace. Ils ne sont pas nés ici.`,
                    `Qu'allons-nous faire maintenant ? Pourquoi devrions-nous revenir sur Terre, ce puits de gravité en ruine dont nous ne connaissons rien, alors que nous avons tout l'espace pour nous ? C'est un nouveau chapitre qui s'écrit pour l'humanité...`
                )
                part.chainWith = "victory";
            } else {
                part.lines.push(
                    `Nous avons décidé de répliquer en coupant leur arrivée d'oxygène. En réponse, ils changent la trajectoire du vaisseau pour survoler en basse altitude Cérès. Ils doivent penser que l'accélération gravitationnelle nous mettra KO, nous qui n'avons pas des jambes de terriens.`,
                    `L'Odyssée n'est pas prévu pour subir une telle accélération ! Nous allons trop vite et nous perdons trop d'altitude ! Je hurle à l'intercom d'arrêter cette folie. Mais l'ancien commandant semble délirer avec le manque d'oxygène.`,
                    `"La Terre... je vois la Terre... enfin, nous sommes de retour. Enfin de retour..."`
                )
                part.chainWith = "defeat"
            }

            return part
    }
}

export const endDialog = {
    start: "init",
    parts: {
        init: {
            lines: [
                "Initialisation du décollage... Tests moteur... OK",
                "Décollage en cours... le réacteur nucléaire ronronne...",
                "L'Odyssée a décollé avec succès et s'éloigne à grande vitesse !",
            ],
            chainWith: "decollage"
        },

        decollage: decollagePart,

        defeat: defeatPart,
        victory: victoryPart
    }
};

export const initEndDialog = () => {

    state.timeLeft = state.apocalypseTime - Date.now();

    // random parts
    state.stockChance = randomBetween(0, 100, false)

    Object.assign(endDialog.parts, {
        ceres: getCeresPart,
        toast: getToastPart,
        repos: getReposPart,
        phase2: getPhase2Part,
        phase3: getPhase3Part
    });

    return endDialog
}