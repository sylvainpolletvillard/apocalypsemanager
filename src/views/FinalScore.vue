<template>
    <div>
        <h1>Score</h1>
        <dl>
             <dt>{{state.victory ? "Succès" : "Echec"}}  de la mission:</dt>
             <dd>{{score.victory}}</dd>
             <dt>Recherches terminées:</dt>
             <dd>{{score.tech}}</dd>
             <dt>Ressources restantes:</dt>
             <dd>{{score.ressources}}</dd>
             <dt>Temps restant:</dt>
             <dd>{{score.time}}</dd>
             <dt class="bold">Score final:</dt>
             <dd class="bold">{{score.total}}</dd>
        </dl>
        <p class="newrecord bold" v-if="score.isNewRecord">Nouveau record !</p>
        <div class="action"><a @click="backToMenu()">Retour au menu</a></div>
    </div>
</template>

<script>
import { state, calcScore, deleteSave } from "@/game";

export default {
  name: "FinalScore",

  data() {
    return {
      state,
      score: null
    };
  },

  methods: {
    backToMenu() {
      deleteSave();
      this.$router.push("/");
    }
  },

  created() {
    if (!state.loaded) return this.$router.push("/");

    this.score = calcScore();
  }
};
</script>

<style lang="postcss" scoped>
dt {
  display: inline-block;
  text-align: right;
  width: calc(50% - 1em);
  margin: 0.5em;
  font-family: "Oswald", sans-serif;
}

dd {
  display: inline-block;
  text-align: left;
  width: calc(50% - 1em);
  margin: 0.5em;
}

.newrecord {
  color: goldenrod;
  margin: 1em;
}

.bold {
  font-weight: bold;
  font-size: 1.5em;
}
</style>
