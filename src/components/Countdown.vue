<template>
    <div class="countdown">
        {{formattedCountdown}}
    </div>
</template>

<script>
import { state, everyDay } from "@/game";
import { epochs, loadEpoch } from "@/events";
import { formatTime } from "@/labels";

export default {
  data() {
    return {
      state,
      timeLeft: state.apocalypseTime - Date.now()
    };
  },

  created() {
    let counterInterval = 100;
    this.timeInterval = setInterval(() => {
      this.timeLeft = this.state.apocalypseTime - Date.now();
      let meteorSize =
        Math.pow(
          (this.state.dureeJeu - this.timeLeft) / this.state.dureeJeu,
          3
        ) * 1000;
      document.getElementById("app").style.backgroundSize = meteorSize + "px";

      if (this.timeLeft < 0) {
        this.$router.push("/gameover/meteor");
        return;
      }

      if (
        this.timeLeft <
          this.state.timeBetweenEpochs *
            (epochs.length - this.state.currentEpoch) &&
        this.state.currentEpoch < epochs.length
      ) {
        this.state.currentEpoch++;
        loadEpoch();
        this.$router.push("/messages");
      }

      let realTimeForADay = 60 * 1000;

      if (this.timeLeft % realTimeForADay < counterInterval) {
        let onGameOver = reason => this.$router.push("/gameover/" + reason);
        everyDay(onGameOver);
      }
    }, counterInterval);
  },

  destroyed() {
    clearInterval(this.timeInterval);
  },

  computed: {
    formattedCountdown() {
      let timeLeft = this.timeLeft;
      timeLeft *= this.state.speed;
      return formatTime(timeLeft, true);
    }
  }
};
</script>

<style>
.countdown {
  font-size: 1.5em;
  height: 48px;
  line-height: 44px;
  color: red;
  border: 4px solid red;
}
</style>
