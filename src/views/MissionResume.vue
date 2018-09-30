<template>
<div id="missionresume" v-if="mission">
    <h1>Mission</h1>
    <ul>
        <li class="mission">
            <span class="name">{{mission.name}}</span>
            <p class="description">{{mission.description}}</p>
            <p v-if="shouldShowProbaSucces">Probabilité de succès: {{probaSucces}}%</p>
        </li>
    </ul>
    <h1>Résultat de la mission</h1>
    <div class="resultat" @click="$router.push('/squads')">
        <div v-if="squad.status === 'missionSuccess'">
            <h2>Mission accomplie !</h2>
        </div>
        <div v-else-if="squad.status === 'missionFail'">
            <div class="icon fail"></div>
            <h2>Echec de la mission</h2>
        </div>
        <div v-else-if="squad.status === 'dead'">
            <div class="icon dead"></div>
            <h2>Echec critique</h2>
        </div>
    </div>
    <p v-for="(event,i) in squad.missionResult.resume" :key="i">{{event}}</p>

    <template v-if="squad.status === 'missionSuccess'">
        <h1>Ressources obtenues</h1>
         <ul class="ressources">
            <li v-for="(val,res) in squad.missionResult.ressources" :key="res">
                <template v-if="val > 0">
                    {{val}} <div :class="['icon', res]"></div>
                </template>
            </li>
        </ul>
        <template v-if="squad.missionResult.squad || squad.missionResult.scientific">
            <h1>Personnes recrutées</h1>
            <ul class="ressources">
                <li v-if="squad.missionResult.squad">
                    <div class="icon squad"></div> de niveau {{squad.missionResult.squad}}
                </li>
                <li v-if="squad.missionResult.scientific">
                    <div class="icon scientific"></div> de niveau {{squad.missionResult.scientific}}
                </li>
            </ul>
        </template>
    </template>
</div>
</template>

<script>
import { state } from "@/game";
import { missionResume } from "@/missions";
import { clone } from "@/utils";

export default {
  name: "MissionResume",

  data() {
    return {
      state,
      mission: null,
      squad: null
    };
  },

  created() {
    let squad = state.squads[this.indexSquad];
    this.squad = clone(squad);
    this.mission = this.squad.mission;
    missionResume(squad);
  },

  computed: {
    indexSquad() {
      return parseInt(this.$route.params.indexSquad);
    },
    probaSucces() {
      let pc = Math.round(this.squad.missionResult.probaSucces * 100);
      pc = Math.max(0, Math.min(100, pc));
      return pc;
    },
    shouldShowProbaSucces() {
      return this.state.projectsFinished.includes("Supercalculateur");
    }
  }
};
</script>

<style lang="postcss" scoped>
h1 {
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5em;

  &:not(:first-of-type) {
    margin-top: 0.5em;
  }
}

.icon {
  display: inline-block;
  width: 36px;
  height: 36px;
  background-size: 36px 36px;
  margin: 0 0.5em 0 0;
  vertical-align: middle;
}

.ressources li {
  display: inline-block;
  margin: 8px;
}

.resultat {
  cursor: pointer;
  .icon {
    width: 48px;
    height: 48px;
    background-size: 48px 48px;
    margin: 0;
  }
}

p {
  padding: 0 0.5em;
}
</style>

