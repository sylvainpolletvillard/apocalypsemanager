<template>
<li class="squad">
    <div class="icon squad"></div>
    <div :class="['status', squad.status]" v-if="showStatus" @click="onClickStatus()">
        <template v-if="squad.status === 'mission'">
            <p>Mission</p>
            <span class="time">{{getSquadMissionTimeLeft(squad)}}</span>
        </template>
        <template v-else-if="squad.status === 'missionSuccess'">
            <p>Mission accomplie</p>
        </template>
        <template v-else-if="squad.status === 'missionFail'">
            <div class="icon fail"></div>
        </template>
        <template v-else-if="squad.status === 'dead'">
            <div class="icon dead"></div>
        </template>
        <template v-else>
            <p>Nouvelle mission</p>
        </template>
    </div>
    <span class="name">Escouade {{getSquadName(indexSquad)}}</span>
    <p class="level">Niveau {{squad.level}}</p>
</li>
</template>

<script>
import { alphabetMilitaire, formatTime } from "@/labels";
import { endMission } from "@/missions";
import { state } from "@/game";

export default {
  name: "Squad",
  props: {
    showStatus: { type: Boolean, default: false },
    indexSquad: Number
  },
  data() {
    return {
      state,
      t: Date.now()
    };
  },
  computed: {
    squad() {
      return this.state.squads[this.indexSquad];
    }
  },
  methods: {
    getSquadName: i => alphabetMilitaire[i],
    formatTime: formatTime,
    getSquadMissionTimeLeft(squad) {
      if (!squad.missionEndTime) return "";
      let timeLeft = squad.missionEndTime - this.t;
      if (timeLeft <= 0) {
        endMission(squad);
      }
      return formatTime(timeLeft);
    },

    onClickStatus() {
      switch (this.squad.status) {
        case "missionSuccess":
        case "missionFail":
        case "dead":
          this.$router.push("/mission-resume/" + this.indexSquad);
          break;

        case "idle":
          this.$router.push("mission/" + this.indexSquad);
          break;
      }
    }
  },

  created() {
    this.tInterval = setInterval(() => {
      this.t = Date.now();
    }, 1000);
  },

  destroyed() {
    clearInterval(this.tInterval);
  }
};
</script>

<style lang="postcss" scoped>
li.squad {
  display: block;
  background-image: url("../assets/squad.png");
  background-size: 100% 100%;
  height: 96px;
  text-align: left;
  overflow: hidden;

  .icon.squad {
    float: left;
    margin: 24px 16px;
  }

  .icon {
    width: 48px;
    height: 48px;
    margin: 8px 16px;
    display: inline-block;
  }

  .name {
    display: block;
    padding-top: 10px;
  }

  .level {
  }

  .status {
    cursor: pointer;
    width: 96px;
    height: 89px;
    float: right;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.25);
    padding: 10px 0;
    margin: 2px 0px;
    line-height: 1.3;
    box-shadow: -4px 0 4px rgba(0, 0, 0, 0.5);

    .time {
      display: block;
      margin: 0.25em 0;
    }

    p {
      padding: 0;
    }
  }

  .status.missionSuccess {
    background-color: rgba(1, 195, 25, 0.25);
  }
  .status.missionFail {
    background-color: rgba(195, 30, 30, 0.25);
  }
  .status.dead {
    background-color: rgba(255, 50, 50, 0.5);
  }
  .status.idle {
    background-color: rgba(195, 195, 25, 0.15);
  }

  .status:not(.mission) {
    box-shadow: inset 0 0 10px 2px goldenrod;
  }
}
</style>
