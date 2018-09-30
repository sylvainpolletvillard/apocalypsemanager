<template>
    <div id="mission">
        <ul>
            <Squad :indexSquad="indexSquad" />
        </ul>
        <h1>Choix de la mission</h1>
        <ul>
            <li v-for="(mission,i) in missions" :key="i"
                v-if="!selectedMission || selectedMission === mission"
                :class="['mission', { selected: selectedMission === mission }]"
                @click="selectedMission ? selectedMission = null : selectedMission = mission">
                <span class="name">{{mission.name}}</span>
                <p class="description" v-if="selectedMission === mission">{{mission.description}}</p>
                <p v-if="shoulsShowMissionRessources">Ressources récupérables:
                    <ul class="ressources">
                        <li v-for="(val,res) in mission.ressources" :key="res">
                            <div :class="['icon', res]" :title="res"></div>
                        </li>
                        <li v-if="mission.squad"><div class="icon squad"></div></li>
                        <li v-if="mission.scientific"><div class="icon scientific"></div></li>
                    </ul>
                </p>
                <p class="level">
                  Distance: {{mission.distance}} km -
                  Niveau recommandé:
                  <span :class="{ insufficient: calcMissionLevel(mission) > squad.level }">
                    {{calcMissionLevel(mission)}}
                  </span>
                </p>
            </li>
        </ul>
        <template v-if="selectedMission">
        <h1>Durée de la mission</h1>
        <div class="params">
          <p class="info">Rester plus longtemps sur place est plus risqué mais permet de trouver davantage de ressources.</p>
          <input type="range" name="dureemission" id="dureemission" min="1" max="5"
            v-model.number="dureeMission">
            <span class="duree">{{dureeMission}} h</span>

            <p>
              <template v-if="shouldShowProbaSucces">
                Probabilité de succès: {{probaSucces}} %&nbsp;&nbsp;&nbsp;
              </template>

              <template v-if="requiresRessources">
                Ressources requises:
                <ul class="ressources">
                    <li v-for="(val,res) in requiredRessources" :key="res"
                        :class="{ insufficient: !hasRessources({ [res]: val }) }">
                        <template v-if="val > 0">
                          {{val}} <div :class="['icon', res]"></div>
                        </template>
                    </li>
                </ul>
              </template>
            </p>
        </div>

        <div class="action disabled" v-if="!hasRessources(requiredRessources)">
          <a>Ressources insuffisantes</a>
        </div>
        <div class="action" v-if="canStartMission">
            <a @click="startMission()">Lancer la mission</a>
        </div>

         </template>
    </div>
</template>

<script>
import Squad from "@/components/Squad.vue";
import {
  missions,
  calcRequiredRessources,
  calcProbaSuccesMission,
  startMission
} from "@/missions.js";
import { hasRessources, takeRessources } from "@/ressources.js";
import { state } from "@/game.js";

export default {
  name: "Mission",
  components: { Squad },

  data() {
    return {
      state,
      missions,
      selectedMission: null,
      dureeMission: 1
    };
  },

  computed: {
    indexSquad() {
      return parseInt(this.$route.params.indexSquad);
    },
    requiredRessources() {
      return calcRequiredRessources(this.selectedMission);
    },
    requiresRessources() {
      return Object.values(this.requiredRessources).some(val => val > 0);
    },
    canStartMission() {
      return this.selectedMission && hasRessources(this.requiredRessources);
    },
    squad() {
      return state.squads[this.indexSquad];
    },
    probaSucces() {
      let proba = calcProbaSuccesMission(
        this.squad,
        this.selectedMission,
        this.dureeMission
      );
      let pc = Math.round(proba * 100);
      pc = Math.max(0, Math.min(100, pc));
      return pc;
    },
    shouldShowProbaSucces() {
      return this.state.projectsFinished.includes("Supercalculateur");
    },
    shoulsShowMissionRessources() {
      return this.state.projectsFinished.includes("Scanner");
    }
  },

  methods: {
    hasRessources,

    startMission() {
      takeRessources(this.requiredRessources);
      startMission(this.squad, this.selectedMission, this.dureeMission);
      this.$router.push("/squads");
    },

    calcMissionLevel(mission) {
      return mission.level + state.currentEpoch - 1;
    }
  }
};
</script>

<style lang="postcss" scoped>
ul.ressources {
  display: inline-block;
  vertical-align: text-bottom;

  margin-left: 0.5em;

  li {
    display: inline-block;
    vertical-align: text-bottom;

    .icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      background-size: 24px 24px;
      margin: 0 0.5em 0 0;
      vertical-align: middle;
    }
  }
}

.mission {
  background-image: url("../assets/mission.png");
  background-size: 100% 100%;
  text-align: left;
  padding: 4px 64px 12px 16px;
  position: relative;
  cursor: pointer;

  &.selected::after {
    content: url("../assets/icon-tick.png");
    position: absolute;
    right: 16px;
    top: 24px;
  }

  p {
    line-height: 1;
    font-size: 0.8em;
    margin-bottom: 4px;
  }
}

.params {
  background-image: url("../assets/mission.png");
  background-size: 100% 100%;
  padding: 4px 16px;
  min-height: 96px;

  .duree {
    margin-left: 1em;
    padding: 0.25em;
    display: inline-block;
  }

  .info {
    font-size: 0.8em;
    line-height: 1;
    margin-top: 4px;
  }

  p {
    text-align: left;
    padding-bottom: 0.5em;
  }
}

li.squad {
  margin-top: 0.25em;
}

.insufficient {
  color: red;
}
</style>


