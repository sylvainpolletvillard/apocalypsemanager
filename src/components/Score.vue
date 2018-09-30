<template>
    <div id="score">
        <p>Chances de succès de la mission Odyssée:</p>
        <h1>{{missionChanceSucces.toFixed(2)}} %</h1>

        <p>Réserves du vaisseau</p>
        <div class="bar food">
            <div class="barcompleted" :style="styleBar('food')"></div>
            {{ressources.food}} <div class="icon food" title="Nourriture"></div> / {{reserve.food}}
        </div>
        <div class="bar water">
            <div class="barcompleted" :style="styleBar('water')"></div>
            {{ressources.water}} <div class="icon water" title="Eau"></div> / {{reserve.water}}
        </div>
        <div class="bar plutonium">
            <div class="barcompleted" :style="styleBar('plutonium')"></div>
            {{ressources.plutonium}} <div class="icon plutonium" title="Plutonium"></div> / {{reserve.plutonium}}
        </div>

        <p>Technologies développées</p>
        <h2>{{state.projectsFinished.length}} / {{projects.length}}</h2>

        <div class="action disabled" v-if="!canTakeOff">
          <a>Décollage impossible</a>
          <small>{{reasonWhyCantTakeOff}}</small>
        </div>
        <div class="action decollage" v-else @click="takeOff()">
          <a>Décollage du vaisseau</a>
          <small>Cette action est irréversible, assurons-nous d'être prêts</small>
        </div>
    </div>
</template>

<script>
import { state, reserve, calcMissionChanceSucces } from "@/game";
import { projects } from "@/projects";

export default {
  name: "Score",

  data() {
    return {
      state,
      missionChanceSucces: calcMissionChanceSucces(),
      ressources: state.ressources,
      projects: projects.filter(p => !p.infinite),
      reserve: reserve
    };
  },

  computed: {
    canTakeOff() {
      return (
        this.state.projectsFinished.includes("Réacteur nucléaire") &&
        this.state.ressources.plutonium >= 10 &&
        this.state.ressources.food >= 30 &&
        this.state.ressources.water >= 30
      );
    },

    reasonWhyCantTakeOff() {
      if (!this.state.projectsFinished.includes("Réacteur nucléaire"))
        return "Il nous faut installer le réacteur nucléaire";
      if (this.state.ressources.plutonium < 10)
        return "On a besoin de 10 unités de plutonium pour décoller";
      if (this.state.ressources.food < 30)
        return "Pas question de partir sans 30 caisses de nourriture au moins";
      if (this.state.ressources.water < 30)
        return "Et l'eau ? Il nous faut au moins 30 citernes avant de décoller";
    }
  },

  created() {
    this.interval = setInterval(() => {
      this.missionChanceSucces = calcMissionChanceSucces();
    }, 1000);
  },

  destroyed() {
    clearInterval(this.interval);
  },

  methods: {
    styleBar(res) {
      const colors = {
        food: "rgba(255,85,0,0.25)",
        water: "rgba(0,150,255,0.25)",
        plutonium: "rgba(85,255,0,0.25)"
      };

      let pc = Math.min(1, this.ressources[res] / this.reserve[res]) * 100;

      return {
        width: pc + "%",
        backgroundColor: colors[res]
      };
    },

    takeOff() {
      this.$router.push("/gameover/odyssee");
    }
  }
};
</script>

<style lang="postcss" scoped>
h1 {
  font-size: 2em;
  padding: 0.25em;
}

h2 {
  margin: 8px 0;
}

.bar {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 8px;
  display: block;
  margin: 0.5em 0;
  position: relative;
}

.barcompleted {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}

.icon {
  display: inline-block;
  width: 36px;
  height: 36px;
  background-size: 36px 36px;
  vertical-align: middle;
}

small {
  display: block;
  font-size: 0.7em;
  padding-bottom: 16px;
}

.action.decollage {
  cursor: pointer;
}
</style>

