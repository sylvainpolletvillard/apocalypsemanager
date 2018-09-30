<template>
<li class="scientific">
    <div class="icon scientific" title="Scientifiques"></div>
    <div :class="['status', scientific.status]" v-if="showStatus" @click="onClickStatus()">
        <template v-if="scientific.status === 'project'">
            <p>Projet</p>
            <span class="time">{{getProjectTimeLeft(scientific)}}</span>
        </template>
        <template v-else-if="scientific.status === 'projectFinish'">
            <p>Projet terminé</p>
        </template>
        <template v-else-if="scientific.status === 'idle'">
            <p>Nouveau projet</p>
        </template>
    </div>
    <span class="name">Équipe {{getScientificName(indexScientific)}}</span>
    <p class="level">Niveau {{scientific.level}}</p>
</li>
</template>

<script>
import { alphabetGrec, formatTime } from "@/labels";
import { state } from "@/game";

export default {
  name: "Scientific",
  props: {
    showStatus: { type: Boolean, default: false },
    indexScientific: Number
  },
  data() {
    return {
      state,
      t: Date.now()
    };
  },
  computed: {
    scientific() {
      return this.state.scientifics[this.indexScientific];
    }
  },
  methods: {
    getScientificName: i => alphabetGrec[i],
    formatTime: formatTime,
    getProjectTimeLeft(scientific) {
      if (!scientific.projectEndTime) return "";
      let timeLeft = Math.max(0, scientific.projectEndTime - this.t);
      return formatTime(timeLeft);
    },

    updateProjectsStatus() {
      this.state.scientifics.forEach(scientific => {
        if (
          scientific.projectEndTime &&
          scientific.projectEndTime <= Date.now()
        ) {
          scientific.status = "projectFinish";
          delete scientific.projectEndTime;
        }
      });
    },

    onClickStatus() {
      switch (this.scientific.status) {
        case "projectFinish":
          this.$router.push("/project-resume/" + this.indexScientific);
          break;

        case "idle":
          this.$router.push("project/" + this.indexScientific);
          break;
      }
    }
  },

  created() {
    this.updateProjectsStatus();

    this.tInterval = setInterval(() => {
      this.updateProjectsStatus();
      this.t = Date.now();
    }, 1000);
  },

  destroyed() {
    clearInterval(this.tInterval);
  }
};
</script>

<style lang="postcss" scoped>
li.scientific {
  display: block;
  background-image: url("../assets/science.png");
  background-size: 100% 100%;
  height: 96px;
  text-align: left;

  .icon.scientific {
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

  .status.projectFinish {
    background-color: rgba(1, 195, 25, 0.25);
  }
  .status.idle {
    background-color: rgba(195, 195, 25, 0.15);
  }

  .status:not(.project) {
    box-shadow: inset 0 0 10px 2px goldenrod;
  }
}
</style>
