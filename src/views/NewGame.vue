<template>
<div id="newgame">
  <Dialog :dialog="introDialog" @endDialog="startGame()"></Dialog>
</div>
</template>

<script>
import { newGame } from "@/game";

import Dialog from "@/components/Dialog";

export default {
  name: "NewGame",

  components: {
    Dialog
  },

  data() {
    return {
      introDialog: {
        start: "intro",
        actions: [
          { text: "Plan B ?", link: "skyfire" },
          { text: "Top secret ?", link: "topsecret" },
          { text: "Mes équipes ?", link: "equipes" },
          { text: "Comptez sur moi !", link: "end" }
        ],
        parts: {
          intro: {
            lines: [
              `Briefing de mission, nom de code: Odyssée.`,

              `Il y a trois semaines, l'agence spatiale a confirmé publiquement ce que de nombreux astrophysiciens avaient prédit : la météorite D347H s'écrasera sur Terre dans un mois. Vu sa taille et sa vitesse, la quasi-totalité de la biosphère est menacée d'extinction. Même en s'abritant en profondeur pour survivre à l'impact, il faudra des siècles pour que l'atmosphère redevienne vivable.`,

              `Votre mission, classée top secret : offrir un plan B, une issue de secours à l'humanité en lancant un vaisseau spatial avant le jour J. Vos équipes, scientifiques et hommes de terrain, ont 30 jours pour transformer la navette de tourisme spatial Odyssée en un vaisseau générationnel. Il devra être auto-suffisant pour les trois siècles à venir, en attendant que la Terre se remette du cataclysme si on ne parvient pas à l'empêcher.`
            ]
          },

          skyfire: {
            lines: [
              `Les gouvernements des grandes nations travaillent ensemble à un plan de sauvetage, nom de code Skyfire. Il s'agit d'unir nos programmes d'armement nucléaire pour envoyer des missiles à vol spatial très longue portée et faire exploser une charge nucléaire suffisante pour dévier la trajectoire de la météorite.`,

              `Mais entre le défi technique que cela représente, le caractère ultrasensible des données à partager entre gouvernements, et la panique mondiale qui règne, les premiers retours ne sont pas rassurants.`,

              `Il nous faut un plan B, et c'est là que vous intervenez.`
            ]
          },

          topsecret: {
            lines: [
              `Cette mission est ultra-confidentielle, seule une poignée d'individus est au courant. Comprenez que nous ne pouvons pas ébruiter l'idée d'un possible ticket de sortie alors que la population est déjà hystérique.`,

              `L'Odyssée a été choisi car il est viable pour le projet sans pour autant attirer trop d'attention. Pour ces mêmes raisons, nous ne pouvons pas vous affecter beaucoup d'hommes et de ressources, et nos communications seront limitées au strict minimum. `
            ]
          },

          equipes: {
            lines: [
              `L'Odyssée n'est pas prêt en l'état à un voyage de trois siècles. Il lui manque de nombreux équipements et technologies, à commencer par un réacteur plus puissant pour atteindre la distance requise. C'est là dessus que vont plancher vos équipes scientifiques pendant le mois qui va suivre. Ne les ménagez pas, chaque seconde compte.`,
              `Vous disposez également de deux escouades pour assurer la sécurité de la base. Vos scientifiques vont avoir besoin de matériel pour leurs recherches, vous devrez donc envoyer vos escouades réquisitionner ce dont vous avez besoin dans les alentours de la base.`,
              `Vos hommes devront agir discrètement sur le terrain, mais vu l'hystérie collective qui règne en ce moment, vous devriez passer inaperçus. Ils devront surtout se méfier des pillards, bandes armées et nouvelles sectes qui sèment la terreur dans les villes ces derniers jours. Ne comptez pas sur les forces de police ou l'armée, elles sont d'ores-et-déjà complètement désorganisées.`
            ]
          }
        }
      }
    };
  },

  methods: {
    startGame() {
      newGame();
      this.$router.push("/messages");
    }
  }
};
</script>

<style lang="postcss" scoped>
#newgame {
  background-image: url("../assets/earth.jpg");
  background-size: 100% auto;
  background-position: center bottom;
  background-repeat: no-repeat;
  padding: 4px;
  position: absolute;
  height: 100% !important;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>